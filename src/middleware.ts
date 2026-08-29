import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = [
  '/user-dashboard',
  '/admin-dashboard',
  '/order-form',
];

// Admin-only paths — authenticated users without admin role are redirected
const ADMIN_PATHS = ['/admin-dashboard'];

export async function middleware(
  request: NextRequest
) {
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  const isAdminPath = ADMIN_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  /*
   * Public pages don't need Supabase authentication.
   */
  if (!isProtected) {
    return NextResponse.next();
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Supabase environment variables are missing.'
    );

    return NextResponse.next();
  }

  /*
   * IMPORTANT:
   * The response must be created with the request
   * so Supabase can refresh authentication cookies.
   */
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              request.cookies.set(
                name,
                value
              );

              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  try {
    /*
     * getUser() validates the session with Supabase.
     * This is preferable to reading the user directly
     * from an untrusted cookie.
     */
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(
        'Supabase middleware getUser error:',
        error
      );
    }

    /*
     * No authenticated user:
     * redirect to login.
     */
    if (!user) {
      const loginUrl =
        request.nextUrl.clone();

      loginUrl.pathname =
        '/sign-up-login-screen';

      loginUrl.searchParams.set(
        'redirect',
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    /*
     * Admin-only route check.
     * Verify the user has admin role in app_meta_data or user_meta_data.
     * This is set server-side and cannot be spoofed by the client.
     */
    if (isAdminPath) {
      const isAdmin =
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'admin';

      if (!isAdmin) {
        // Non-admin user trying to access admin pages — redirect to their dashboard
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = '/user-dashboard';
        dashboardUrl.searchParams.delete('redirect');
        return NextResponse.redirect(dashboardUrl);
      }
    }

    /*
     * User is authenticated (and admin-checked if needed).
     * Return the response containing any refreshed
     * Supabase authentication cookies.
     */
    return response;
  } catch (error) {
    console.error(
      'Supabase middleware error:',
      error
    );

    /*
     * For protected pages, don't silently allow
     * an unknown authentication state.
     */
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      '/sign-up-login-screen';

    return NextResponse.redirect(
      loginUrl
    );
  }
}

export const config = {
  matcher: [
    '/user-dashboard/:path*',
    '/admin-dashboard/:path*',
    '/order-form/:path*',
  ],
};