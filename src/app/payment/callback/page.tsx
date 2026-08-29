'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading'
  );
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams?.get('reference');

      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference was found.');
        return;
      }

      try {
        const response = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference,
          }),
        });

        const data = await response?.json();

        if (!response?.ok || !data?.success) {
          setStatus('failed');
          setMessage(data?.error || 'Payment verification failed.');
          return;
        }

        setStatus('success');
        setMessage(
          `₦${Number(data?.amount || 0)?.toLocaleString(
            'en-NG'
          )} has been added to your wallet.`
        );

        setTimeout(() => {
          router?.push('/user-dashboard');
        }, 2500);
      } catch (error) {
        console.error('Payment verification error:', error);

        setStatus('failed');
        setMessage(
          'We could not verify your payment. Please contact support if money was deducted.'
        );
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center card-base card-gradient-bg p-8 rounded-2xl">
        {status === 'loading' && (
          <>
            <Loader2
              size={50}
              className="mx-auto mb-5 text-primary animate-spin"
            />

            <h1 className="text-xl font-bold mb-2">
              Verifying Payment
            </h1>

            <p className="text-sm text-muted-foreground">
              Please wait while we confirm your Paystack payment.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle
              size={55}
              className="mx-auto mb-5 text-green-400"
            />

            <h1 className="text-xl font-bold mb-2">
              Payment Successful
            </h1>

            <p className="text-sm text-muted-foreground">
              {message}
            </p>

            <p className="text-xs text-muted-foreground mt-4">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle
              size={55}
              className="mx-auto mb-5 text-red-400"
            />

            <h1 className="text-xl font-bold mb-2">
              Payment Verification Failed
            </h1>

            <p className="text-sm text-muted-foreground">
              {message}
            </p>

            <button
              onClick={() => router?.push('/user-dashboard')}
              className="btn-primary mt-6 px-5 py-3 rounded-xl text-sm font-semibold"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center card-base card-gradient-bg p-8 rounded-2xl">
            <Loader2 size={50} className="mx-auto mb-5 text-primary animate-spin" />
            <h1 className="text-xl font-bold mb-2">Loading...</h1>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}