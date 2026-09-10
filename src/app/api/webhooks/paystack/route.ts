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

  // Always return 200 so Paystack does not retry
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

  // Paystack sends amount in kobo
  const amountNaira = Number(amount) / 100;

  if (!Number.isFinite(amountNaira) || amountNaira < 1) {
    console.error(`Webhook: invalid amount for reference ${reference}`);
    return;
  }

  // Look up the user by email in user_profiles (the correct table)
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', customer.email.toLowerCase())
    .maybeSingle();

  if (!userProfile) {
    console.warn(`Webhook: no profile found for email ${customer.email}`);
    return;
  }

  await creditWallet(supabase, userProfile.id, amountNaira, reference);
}

async function creditWallet(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  amountNaira: number,
  reference: string
) {
  // Find the user's wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!wallet) {
    console.warn(`Webhook: no wallet found for user ${userId}`);
    return;
  }

  // Atomically credit the wallet via the database function.
  // The function inserts the transaction record first (protected by a
  // UNIQUE index on reference), then updates the balance only if the
  // insert succeeded.  If the reference already exists it returns false
  // without touching the balance — preventing any double-credit.
  const { data: credited, error: rpcError } = await supabase.rpc(
    'credit_wallet_for_payment',
    {
      p_user_id: userId,
      p_wallet_id: wallet.id,
      p_amount: amountNaira,
      p_reference: reference,
      p_description: 'Wallet funded via Paystack (webhook)',
    }
  );

  if (rpcError) {
    console.error('Webhook: credit_wallet_for_payment RPC error:', rpcError);
    throw rpcError;
  }

  if (credited === false) {
    console.log(`Webhook: reference ${reference} already processed, skipping`);
  } else {
    console.log(
      `Webhook: credited ₦${amountNaira} to wallet for user ${userId} (ref: ${reference})`
    );
  }
}

async function handleTransferSuccess(data: {
  reference: string;
  amount: number;
  recipient?: { details?: { account_number?: string } };
}) {
  const supabase = await createClient();

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
