import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  // Read raw body for signature verification
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  // Validate the HMAC SHA512 signature from Paystack
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    console.warn('Paystack webhook: invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Return 200 immediately so Paystack doesn't retry
  const event = JSON.parse(body);

  try {
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'transfer.success':
        await handleTransferSuccess(event.data);
        break;

      case 'transfer.failed':
        await handleTransferFailed(event.data);
        break;

      default:
        // Acknowledge all other events without processing
        break;
    }
  } catch (err) {
    // Log but still return 200 — Paystack should not retry for processing errors
    console.error('Paystack webhook processing error:', err);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleChargeSuccess(data: {
  reference: string;
  amount: number;
  status: string;
  customer: { email: string };
  metadata?: Record<string, unknown>;
}) {
  const { reference, amount, status, customer } = data;

  if (status !== 'success') return;

  const supabase = await createClient();

  // Idempotency: skip if this reference was already processed
  const { data: existing } = await supabase
    .from('wallet_transactions')
    .select('id')
    .eq('reference', reference)
    .maybeSingle();

  if (existing) {
    console.log(`Webhook: reference ${reference} already processed, skipping`);
    return;
  }

  // Paystack sends amount in kobo
  const amountNaira = Number(amount) / 100;

  if (!Number.isFinite(amountNaira) || amountNaira < 1) {
    console.error(`Webhook: invalid amount for reference ${reference}`);
    return;
  }

  // Look up the user by email
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', customer.email.toLowerCase())
    .maybeSingle();

  if (!profile) {
    console.warn(`Webhook: no profile found for email ${customer.email}`);
    return;
  }

  // Find the user's wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance, total_funded')
    .eq('user_id', profile.id)
    .maybeSingle();

  if (!wallet) {
    console.warn(`Webhook: no wallet found for user ${profile.id}`);
    return;
  }

  const currentBalance = Number(wallet.balance || 0);
  const currentTotalFunded = Number(wallet.total_funded || 0);

  // Credit the wallet
  const { error: walletError } = await supabase
    .from('wallets')
    .update({
      balance: currentBalance + amountNaira,
      total_funded: currentTotalFunded + amountNaira,
    })
    .eq('id', wallet.id)
    .eq('user_id', profile.id);

  if (walletError) {
    console.error('Webhook: wallet update failed:', walletError);
    throw walletError;
  }

  // Record the transaction
  const { error: txError } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: profile.id,
      wallet_id: wallet.id,
      transaction_type: 'credit',
      amount: amountNaira,
      reference,
      description: 'Wallet funded via Paystack (webhook)',
    });

  if (txError) {
    console.error('Webhook: transaction insert failed:', txError);
    throw txError;
  }

  console.log(
    `Webhook: credited ₦${amountNaira} to wallet for ${customer.email} (ref: ${reference})`
  );
}

async function handleTransferSuccess(data: {
  reference: string;
  amount: number;
  recipient?: { details?: { account_number?: string } };
}) {
  const supabase = await createClient();

  // Mark the matching payout request as completed
  const { error } = await supabase
    .from('payout_requests')
    .update({ status: 'completed' })
    .eq('reference', data.reference)
    .eq('status', 'processing');

  if (error) {
    console.error('Webhook: payout update failed:', error);
  } else {
    console.log(`Webhook: payout ${data.reference} marked as completed`);
  }
}

async function handleTransferFailed(data: {
  reference: string;
  amount: number;
}) {
  const supabase = await createClient();

  // Mark the matching payout request as failed
  const { error } = await supabase
    .from('payout_requests')
    .update({ status: 'failed' })
    .eq('reference', data.reference)
    .eq('status', 'processing');

  if (error) {
    console.error('Webhook: payout failure update failed:', error);
  } else {
    console.log(`Webhook: payout ${data.reference} marked as failed`);
  }
}
