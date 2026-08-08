import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference || typeof reference !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment reference is required',
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY is missing');

      return NextResponse.json(
        {
          success: false,
          error: 'Paystack is not configured correctly',
        },
        { status: 500 }
      );
    }

    // Get the currently logged-in user
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must be logged in to verify this payment',
        },
        { status: 401 }
      );
    }

    // Verify transaction directly with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
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
        {
          success: false,
          error: data?.message || 'Unable to verify payment',
        },
        { status: 400 }
      );
    }

    const payment = data.data;

    // Payment must actually be successful
    if (payment.status !== 'success') {
      return NextResponse.json(
        {
          success: false,
          error: `Payment was not successful. Status: ${payment.status}`,
        },
        { status: 400 }
      );
    }

    // Paystack returns the amount in kobo
    const amountNaira = Number(payment.amount) / 100;

    if (!Number.isFinite(amountNaira) || amountNaira < 500) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment amount',
        },
        { status: 400 }
      );
    }

    // Make sure this payment email belongs to the logged-in account
    if (
      payment.customer?.email &&
      user.email &&
      payment.customer.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'This payment does not belong to your account',
        },
        { status: 403 }
      );
    }

    /*
     * IMPORTANT:
     * Check whether this Paystack reference has already been credited.
     */
    const { data: existingTransaction, error: existingError } =
      await supabase
        .from('wallet_transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('reference', reference)
        .maybeSingle();

    if (existingError) {
      console.error(
        'Existing transaction check failed:',
        existingError
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to verify wallet transaction',
        },
        { status: 500 }
      );
    }

    // Already credited
    if (existingTransaction) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        amount: amountNaira,
        message: 'Payment has already been added to your wallet',
      });
    }

    // Find the user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id, balance, total_funded')
      .eq('user_id', user.id)
      .maybeSingle();

    if (walletError) {
      console.error('Wallet lookup error:', walletError);

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to access your wallet',
        },
        { status: 500 }
      );
    }

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet not found for this account',
        },
        { status: 404 }
      );
    }

    const currentBalance = Number(wallet.balance || 0);
    const currentTotalFunded = Number(wallet.total_funded || 0);

    const newBalance = currentBalance + amountNaira;
    const newTotalFunded = currentTotalFunded + amountNaira;

    // Update wallet
    const { error: updateWalletError } = await supabase
      .from('wallets')
      .update({
        balance: newBalance,
        total_funded: newTotalFunded,
      })
      .eq('id', wallet.id)
      .eq('user_id', user.id);

    if (updateWalletError) {
      console.error(
        'Wallet update error:',
        updateWalletError
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Payment verified, but wallet update failed',
        },
        { status: 500 }
      );
    }

    // Record the successful payment
    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        transaction_type: 'credit',
        source: 'wallet_fund',
        amount: amountNaira,
        reference: reference,
        description: `Wallet funded via Paystack`,
      });

    if (transactionError) {
      console.error(
        'Transaction record error:',
        transactionError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Payment was verified and wallet updated, but transaction recording failed',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyProcessed: false,
      amount: amountNaira,
      reference,
      message: 'Payment verified and wallet funded successfully',
    });
  } catch (error) {
    console.error('Paystack verification error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong while verifying payment',
      },
      { status: 500 }
    );
  }
}