import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference || typeof reference !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: 'Paystack is not configured correctly' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Make sure the customer is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to verify this payment' },
        { status: 401 }
      );
    }

    // Ask Paystack to verify the transaction
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status || !data.data) {
      console.error('Paystack verification failed:', data);
      return NextResponse.json(
        { success: false, error: data?.message || 'Unable to verify payment' },
        { status: 400 }
      );
    }

    const payment = data.data;

    // Only successful Paystack payments can fund the wallet
    if (payment.status !== 'success') {
      return NextResponse.json(
        { success: false, error: `Payment was not successful. Status: ${payment.status}` },
        { status: 400 }
      );
    }

    // Paystack amount is returned in kobo
    const amountNaira = Number(payment.amount) / 100;

    if (!Number.isFinite(amountNaira) || amountNaira < 500) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Make sure the Paystack customer matches the logged-in account
    if (
      payment.customer?.email &&
      user.email &&
      payment.customer.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: 'This payment does not belong to your account' },
        { status: 403 }
      );
    }

    // Find the customer's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id, balance, total_funded')
      .eq('user_id', user.id)
      .maybeSingle();

    if (walletError) {
      console.error('Wallet lookup error:', walletError);
      return NextResponse.json(
        { success: false, error: 'Unable to access your wallet' },
        { status: 500 }
      );
    }

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found for this account' },
        { status: 404 }
      );
    }

    // Atomically credit the wallet via the database function.
    // The function inserts the transaction record first (protected by a
    // UNIQUE index on reference), then updates the balance only if the
    // insert succeeded.  If the reference already exists it returns false
    // without touching the balance — preventing any double-credit.
    const { data: credited, error: rpcError } = await supabase.rpc(
      'credit_wallet_for_payment',
      {
        p_user_id: user.id,
        p_wallet_id: wallet.id,
        p_amount: amountNaira,
        p_reference: reference,
        p_description: 'Wallet funded via Paystack',
      }
    );

    if (rpcError) {
      console.error('credit_wallet_for_payment RPC error:', rpcError);
      return NextResponse.json(
        { success: false, error: 'Payment verified, but wallet update failed' },
        { status: 500 }
      );
    }

    // credited === false means the reference was already processed
    const alreadyProcessed = credited === false;

    return NextResponse.json({
      success: true,
      alreadyProcessed,
      amount: amountNaira,
      reference,
      message: alreadyProcessed
        ? 'This payment has already been added to your wallet'
        : 'Payment verified and wallet funded successfully',
    });
  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong while verifying payment' },
      { status: 500 }
    );
  }
}