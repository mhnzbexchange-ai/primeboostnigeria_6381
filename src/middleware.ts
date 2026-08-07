import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Compute project ref once at module load instead of on every request
const PROJECT_REF = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
})();

// Protected paths as a module-level constant
const PROTECTED_PATHS = ['/user-dashboard', '/admin-dashboard', '/order-form'];

function injectTokenFromHeader(request: NextRequest): void {
  const token = request.headers.get('x-sb-token');
  if (!token) return;

  // Use the exact cookie name instead of scanning all cookies (faster)
  const cookieName = `sb-${PROJECT_REF}-auth-token`;
  if (request.cookies.get(cookieName)) return;

  request.cookies.set(cookieName, token);
}

export async function middleware(request: NextRequest) {
  // Fast-path: only run token injection and auth checks when necessary
  injectTokenFromHeader(request);

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  // If route is not protected, avoid creating Supabase client or making network calls
  if (!isProtected) {
    return NextResponse.next();
  }

  // Ensure required envs are present before creating the client
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Incomplete config: allow the request but do not block app availability
    return NextResponse.next();
  }

  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-up-login-screen';
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // If Supabase call fails, prefer failing open (don't block) and log for debugging
    // eslint-disable-next-line no-console
    console.error('Supabase auth.getUser error in middleware:', err);
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
