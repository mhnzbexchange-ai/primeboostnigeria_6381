import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, amount } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid email is required' },
        { status: 400 }
      );
    }

    // Validate amount
    const nairaAmount = Number(amount);

    if (!Number.isFinite(nairaAmount) || nairaAmount < 500) {
      return NextResponse.json(
        {
          success: false,
          error: 'Minimum wallet funding amount is ₦500',
        },
        { status: 400 }
      );
    }

    // Paystack uses kobo, not naira
    const amountInKobo = Math.round(nairaAmount * 100);

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey || secretKey === 'your_paystack_secret_key_here') {
      console.error('PAYSTACK_SECRET_KEY is missing');

      return NextResponse.json(
        {
          success: false,
          error: 'Paystack is not configured correctly',
        },
        { status: 500 }
      );
    }

    // Generate a unique reference
    const reference = `PB-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // Your live website
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://primeboostnigeria.com';

    const callbackUrl = `${siteUrl}/payment/callback`;

    // Initialize transaction with Paystack
    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountInKobo,
          currency: 'NGN',
          reference,
          callback_url: callbackUrl,

          metadata: {
            service: 'PrimeBoost Nigeria Wallet Funding',
            amount_naira: nairaAmount,
            reference,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error('Paystack initialization error:', data);

      return NextResponse.json(
        {
          success: false,
          error:
            data?.message ||
            'Unable to initialize Paystack payment',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error('Paystack initialize error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong while starting payment',
      },
      { status: 500 }
    );
  }
}