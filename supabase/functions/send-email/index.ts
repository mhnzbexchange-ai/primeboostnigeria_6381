import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const { type, to, name, link, order } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    let subject = "";
    let html = "";

    const headerHtml = `
      <tr>
        <td style="background:linear-gradient(135deg,#b8860b,#ffd700,#b8860b);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#0a0a0a;font-size:24px;font-weight:800;letter-spacing:-0.5px;">PrimeBoost Nigeria</h1>
          <p style="margin:6px 0 0;color:#0a0a0a;font-size:13px;opacity:0.8;">Nigeria's #1 Social Media Growth Platform</p>
        </td>
      </tr>`;

    const footerHtml = `
      <tr>
        <td style="padding:20px 36px;border-top:1px solid #222;text-align:center;">
          <p style="margin:0;color:#444;font-size:12px;">🇳🇬 PrimeBoost Nigeria · Proudly Nigerian · Naira Payments · 24/7 Support</p>
        </td>
      </tr>`;

    const wrapEmail = (body: string) => `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid #222;overflow:hidden;max-width:560px;width:100%;">
                ${headerHtml}
                <tr><td style="padding:40px 36px;">${body}</td></tr>
                ${footerHtml}
              </table>
            </td></tr>
          </table>
        </body>
      </html>`;

    if (type === "email_verification") {
      subject = "Verify your PrimeBoost email address";
      html = wrapEmail(`
        <h2 style="margin:0 0 12px;color:#ffd700;font-size:20px;font-weight:700;">Verify Your Email Address</h2>
        <p style="margin:0 0 20px;color:#aaa;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
        <p style="margin:0 0 28px;color:#aaa;font-size:15px;line-height:1.6;">
          Welcome to PrimeBoost! Please verify your email address to activate your account and start growing your social media presence.
        </p>
        <div style="text-align:center;margin:0 0 32px;">
          <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#b8860b,#ffd700);color:#0a0a0a;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
            Verify Email Address
          </a>
        </div>
        <p style="margin:0 0 8px;color:#666;font-size:13px;line-height:1.6;">Or copy and paste this link into your browser:</p>
        <p style="margin:0 0 28px;color:#ffd700;font-size:12px;word-break:break-all;">${link}</p>
        <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
          This link expires in 24 hours. If you didn't create a PrimeBoost account, you can safely ignore this email.
        </p>
      `);
    } else if (type === "password_reset") {
      subject = "Reset your PrimeBoost password";
      html = wrapEmail(`
        <h2 style="margin:0 0 12px;color:#ffd700;font-size:20px;font-weight:700;">Reset Your Password</h2>
        <p style="margin:0 0 20px;color:#aaa;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
        <p style="margin:0 0 28px;color:#aaa;font-size:15px;line-height:1.6;">
          We received a request to reset your PrimeBoost account password. Click the button below to create a new password.
        </p>
        <div style="text-align:center;margin:0 0 32px;">
          <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#b8860b,#ffd700);color:#0a0a0a;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
            Reset Password
          </a>
        </div>
        <p style="margin:0 0 8px;color:#666;font-size:13px;line-height:1.6;">
          Or copy and paste this link into your browser:
        </p>
        <p style="margin:0 0 28px;color:#ffd700;font-size:12px;word-break:break-all;">${link}</p>
        <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
        </p>
      `);
    } else if (type === "order_confirmation") {
      subject = `Order Confirmed ✅ — #${order?.orderId || ''} | PrimeBoost Nigeria`;
      html = wrapEmail(`
        <h2 style="margin:0 0 12px;color:#ffd700;font-size:20px;font-weight:700;">Order Confirmed! 🎉</h2>
        <p style="margin:0 0 20px;color:#aaa;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
        <p style="margin:0 0 24px;color:#aaa;font-size:15px;line-height:1.6;">
          Your order has been placed successfully and is now being processed. Here's a summary:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;margin:0 0 28px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Order ID</td>
                  <td style="text-align:right;color:#ffd700;font-size:13px;font-weight:700;font-family:monospace;">#${order?.orderId || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Platform</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.platform || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Service</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.serviceName || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Quantity</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.quantity ? Number(order.quantity).toLocaleString() : ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Est. Delivery</td>
                  <td style="text-align:right;color:#4ade80;font-size:13px;font-weight:600;">${order?.delivery || 'Processing'}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:14px;font-weight:700;">Amount Charged</td>
                  <td style="text-align:right;font-size:18px;font-weight:800;background:linear-gradient(135deg,#b8860b,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#ffd700;">₦${order?.amount ? Number(order.amount).toLocaleString() : ''}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://primeboost7331.builtwithrocket.new'}/user-dashboard" style="display:inline-block;background:linear-gradient(135deg,#b8860b,#ffd700);color:#0a0a0a;text-decoration:none;font-weight:700;font-size:14px;padding:12px 32px;border-radius:10px;">
            Track Your Order
          </a>
        </div>
        <p style="margin:0;color:#555;font-size:13px;line-height:1.6;text-align:center;">
          If delivery fails, your wallet will be automatically refunded within 24 hours.
        </p>
      `);
    } else if (type === "order_delivered") {
      subject = `Order Delivered 🚀 — #${order?.orderId || ''} | PrimeBoost Nigeria`;
      html = wrapEmail(`
        <h2 style="margin:0 0 12px;color:#4ade80;font-size:20px;font-weight:700;">Order Delivered! 🚀</h2>
        <p style="margin:0 0 20px;color:#aaa;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
        <p style="margin:0 0 24px;color:#aaa;font-size:15px;line-height:1.6;">
          Great news! Your PrimeBoost order has been successfully delivered. Your social media presence is growing!
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;margin:0 0 28px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Order ID</td>
                  <td style="text-align:right;color:#ffd700;font-size:13px;font-weight:700;font-family:monospace;">#${order?.orderId || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Platform</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.platform || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Service</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.serviceName || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Quantity Delivered</td>
                  <td style="text-align:right;color:#4ade80;font-size:13px;font-weight:700;">${order?.quantity ? Number(order.quantity).toLocaleString() : ''} ✓</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="background:#0d2818;border:1px solid #166534;border-radius:12px;padding:16px 20px;margin:0 0 28px;text-align:center;">
          <p style="margin:0;color:#4ade80;font-size:14px;font-weight:700;">✅ Delivery Complete</p>
          <p style="margin:6px 0 0;color:#86efac;font-size:12px;">Your order has been fully delivered to your account.</p>
        </div>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://primeboost7331.builtwithrocket.new'}/order-form" style="display:inline-block;background:linear-gradient(135deg,#b8860b,#ffd700);color:#0a0a0a;text-decoration:none;font-weight:700;font-size:14px;padding:12px 32px;border-radius:10px;">
            Place Another Order
          </a>
        </div>
        <p style="margin:0;color:#555;font-size:13px;line-height:1.6;text-align:center;">
          Thank you for choosing PrimeBoost Nigeria. We're here to grow your social media presence!
        </p>
      `);
    } else if (type === "order_cancelled") {
      subject = `Order Cancelled — #${order?.orderId || ''} | PrimeBoost Nigeria`;
      html = wrapEmail(`
        <h2 style="margin:0 0 12px;color:#f87171;font-size:20px;font-weight:700;">Order Cancelled</h2>
        <p style="margin:0 0 20px;color:#aaa;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
        <p style="margin:0 0 24px;color:#aaa;font-size:15px;line-height:1.6;">
          Your PrimeBoost order has been cancelled. If this was unexpected, please contact our support team.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;margin:0 0 28px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Order ID</td>
                  <td style="text-align:right;color:#ffd700;font-size:13px;font-weight:700;font-family:monospace;">#${order?.orderId || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Platform</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.platform || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Service</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">${order?.serviceName || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#888;font-size:13px;">Amount</td>
                  <td style="text-align:right;color:#eee;font-size:13px;font-weight:600;">₦${order?.amount ? Number(order.amount).toLocaleString() : ''}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="background:#1c0a0a;border:1px solid #7f1d1d;border-radius:12px;padding:16px 20px;margin:0 0 28px;">
          <p style="margin:0;color:#f87171;font-size:13px;font-weight:700;">💰 Refund Information</p>
          <p style="margin:8px 0 0;color:#fca5a5;font-size:13px;line-height:1.6;">
            If a payment was made, your wallet balance will be refunded within 24 hours. Please check your PrimeBoost wallet.
          </p>
        </div>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://primeboost7331.builtwithrocket.new'}/support-center" style="display:inline-block;background:linear-gradient(135deg,#b8860b,#ffd700);color:#0a0a0a;text-decoration:none;font-weight:700;font-size:14px;padding:12px 32px;border-radius:10px;">
            Contact Support
          </a>
        </div>
        <p style="margin:0;color:#555;font-size:13px;line-height:1.6;text-align:center;">
          Need help? Our support team is available 24/7 to assist you.
        </p>
      `);
    } else {
      throw new Error(`Unknown email type: ${type}`);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to send email via Resend");
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
