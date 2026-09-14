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

    if (!Number.isFinite(amountNaira) || amountNaira < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Make sure the Paystack customer email matches the logged-in account (case-insensitive)
    const paystackEmail = payment.customer?.email?.toLowerCase().trim() ?? '';
    const userEmail = user.email?.toLowerCase().trim() ?? '';

    if (paystackEmail && userEmail && paystackEmail !== userEmail) {
      console.error(
        `Verify: email mismatch — Paystack: ${payment.customer.email}, user: ${user.email}`
      );
      return NextResponse.json(
        { success: false, error: 'This payment does not belong to your account' },
        { status: 403 }
      );
    }

    // Use the confirmed-working reconcile_paystack_payment function.
    // It handles: user lookup by email, wallet lookup, idempotent credit,
    // and duplicate-reference protection — all atomically.
    const { data: result, error: rpcError } = await supabase.rpc(
      'reconcile_paystack_payment',
      {
        p_reference: reference,
        p_email: payment.customer?.email ?? user.email,
        p_amount_naira: amountNaira,
      }
    );

    if (rpcError) {
      console.error('reconcile_paystack_payment RPC error:', rpcError);
      console.error('RPC error details:', JSON.stringify(rpcError));
      return NextResponse.json(
        {
          success: false,
          error:
            'Payment verified by Paystack, but wallet update failed. Please contact support with reference: ' +
            reference,
        },
        { status: 500 }
      );
    }

    if (!result?.success) {
      console.error('reconcile_paystack_payment returned failure:', result);
      return NextResponse.json(
        {
          success: false,
          error:
            result?.error ||
            'Payment verified but wallet could not be credited. Please contact support with reference: ' +
              reference,
        },
        { status: 500 }
      );
    }

    const alreadyProcessed = result?.already_credited === true;

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