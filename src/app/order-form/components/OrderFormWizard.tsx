'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Info,
  Link as LinkIcon,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  SERVICES_BY_PLATFORM,
  PLATFORMS,
  MINIMUM_ORDER_QTY,
  MINIMUM_ORDER_MESSAGE,
  calcTotal,
} from '@/lib/pricing';

type OrderFormData = {
  platform: string;
  serviceId: string;
  url: string;
  quantity: number;
};

const BUSINESS_BANK_DETAILS = {
  bankName: 'Kuda bank',
  accountNumber: '3004047015',
  accountName: 'CHUKWUDI AWA MBA,
};

const steps = [
  { id: 1, label: 'Platform' },
  { id: 2, label: 'Service & URL' },
  { id: 3, label: 'Quantity' },
  { id: 4, label: 'Payment' },
];

export default function OrderFormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);
  const [walletId, setWalletId] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<
    'wallet' | 'bank_transfer'
  >('wallet');

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [transferRef, setTransferRef] = useState('');

  const { user } = useAuth();
  const supabase = createClient();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      quantity: MINIMUM_ORDER_QTY,
    },
  });

  const selectedPlatform = watch('platform');
  const selectedServiceId = watch('serviceId');
  const quantity = watch('quantity');

  const availableServices = selectedPlatform
    ? SERVICES_BY_PLATFORM[selectedPlatform] || []
    : [];

  const selectedService = availableServices.find(
    (service) => service.id === selectedServiceId
  );

  const totalPrice = selectedService
    ? calcTotal(selectedService.pricePerUnit, quantity || 0)
    : 0;

  const hasSufficientBalance = totalPrice <= walletBalance;

  useEffect(() => {
    if (!user?.id) return;
    fetchWalletBalance();
  }, [user?.id]);

  const fetchWalletBalance = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.log('Wallet fetch error:', error.message);
        return;
      }

      if (data) {
        setWalletBalance(Number(data.balance || 0));
        setWalletId(data.id);
      }
    } catch (error: any) {
      console.log('Wallet fetch error:', error?.message);
    }
  };

  const handleProofFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, WEBP or PDF file.');
      return;
    }

    setProofFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setProofPreview(event.target?.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setProofPreview(null);
    }
  };

  const removeProofFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!navigator.clipboard) {
      toast.error('Copy is not available on this device.');
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied!`))
      .catch(() => toast.error('Unable to copy.'));
  };

  const createOrder = async (data: OrderFormData) => {
    if (!user?.id || !selectedService) {
      throw new Error('Please sign in and select a service.');
    }

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_id: data.serviceId,
        platform: data.platform,
        service_name: selectedService.name,
        target_url: data.url,
        quantity: data.quantity,
        amount: totalPrice,
        order_status: 'pending',
        progress: 0,
      })
      .select('id')
      .single();

    if (error) throw error;

    return newOrder;
  };

  const submitBankTransferOrder = async (data: OrderFormData) => {
    if (!user?.id || !selectedService) {
      toast.error('Please sign in to place an order.');
      return;
    }

    if (!proofFile) {
      toast.error('Please upload proof of payment.');
      return;
    }

    setLoading(true);
    setUploadingProof(true);

    try {
      const fileExt = proofFile.name.split('.').pop() || 'file';
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, proofFile, {
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          `Failed to upload proof: ${uploadError.message}`
        );
      }

      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      setUploadingProof(false);

      const newOrder = await createOrder(data);

      const reference =
        transferRef.trim() ||
        `TRF-${newOrder.id.slice(0, 8).toUpperCase()}`;

      const { error: paymentError } = await supabase
        .from('bank_transfer_payments')
        .insert({
          user_id: user.id,
          order_id: newOrder.id,
          amount: totalPrice,
          reference,
          proof_url: urlData?.publicUrl || '',
          proof_path: filePath,
          status: 'pending',
        });

      if (paymentError) throw paymentError;

      setOrderId(newOrder.id.slice(0, 8).toUpperCase());
      setOrderPlaced(true);

      toast.success(
        'Order submitted. Payment is awaiting verification.'
      );
    } catch (error: any) {
      toast.error(
        error?.message ||
          'Failed to submit your order. Please try again.'
      );
    } finally {
      setLoading(false);
      setUploadingProof(false);
    }
  };

  const submitWalletOrder = async (data: OrderFormData) => {
    if (!user?.id || !selectedService || !walletId) {
      toast.error('Please sign in and make sure your wallet is available.');
      return;
    }

    if (!hasSufficientBalance) {
      toast.error('Insufficient wallet balance.');
      return;
    }

    setLoading(true);

    try {
      const newOrder = await createOrder(data);

      /*
       * Keep the existing wallet behaviour.
       *
       * Note:
       * For production, wallet debits should ideally be handled by
       * a secure server-side/database transaction so two simultaneous
       * orders cannot spend the same balance.
       */
      const newBalance = walletBalance - totalPrice;

      const { error: walletError } = await supabase
        .from('wallets')
        .update({
          balance: newBalance,
        })
        .eq('id', walletId);

      if (walletError) throw walletError;

      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          wallet_id: walletId,
          transaction_type: 'debit',
          source: 'order_payment',
          amount: totalPrice,
          description: `Order payment - ${data.platform} ${selectedService.name}`,
          reference: newOrder.id,
        });

      if (transactionError) throw transactionError;

      setWalletBalance(newBalance);
      setOrderId(newOrder.id.slice(0, 8).toUpperCase());
      setOrderPlaced(true);

      toast.success('Order placed successfully!');

      /*
       * Email confirmation is non-blocking.
       */
      try {
        const userEmail = user.email;
        const userName =
          user.user_metadata?.full_name || user.email || '';

        if (userEmail) {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'order_confirmation',
              to: userEmail,
              name: userName,
              order: {
                orderId: newOrder.id
                  .slice(0, 8)
                  .toUpperCase(),
                platform: data.platform,
                serviceName: selectedService.name,
                quantity: data.quantity,
                amount: totalPrice,
                delivery: selectedService.delivery,
              },
            }),
          });
        }
      } catch {
        // Email failure does not cancel the order.
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          'Failed to place your order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (paymentMethod === 'bank_transfer') {
      await submitBankTransferOrder(data);
    } else {
      await submitWalletOrder(data);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedPlatform) {
      toast.error('Please select a platform.');
      return;
    }

    if (currentStep === 2 && !selectedServiceId) {
      toast.error('Please select a service.');
      return;
    }

    if (currentStep === 2 && !watch('url')) {
      toast.error('Please enter your profile or post URL.');
      return;
    }

    if (currentStep === 3 && selectedService) {
      const currentQuantity = Number(quantity || 0);

      if (currentQuantity < selectedService.minQty) {
        toast.error(
          `Minimum quantity is ${selectedService.minQty.toLocaleString()}.`
        );
        return;
      }

      if (currentQuantity > selectedService.maxQty) {
        toast.error(
          `Maximum quantity is ${selectedService.maxQty.toLocaleString()}.`
        );
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    setCurrentStep(1);
    setValue('platform', '');
    setValue('serviceId', '');
    setValue('url', '');
    setValue('quantity', MINIMUM_ORDER_QTY);

    setPaymentMethod('wallet');
    setProofFile(null);
    setProofPreview(null);
    setTransferRef('');
    setOrderId('');
  };

  const platformEmoji = (platform: string) => {
    if (platform === 'TikTok') return '🎵';
    if (platform === 'Instagram') return '📸';
    if (platform === 'Telegram') return '✈️';
    if (platform === 'Snapchat') return '👻';
    if (platform === 'X (Twitter)') return '𝕏';
    if (platform === 'YouTube') return '▶️';

    return '📱';
  };

  if (orderPlaced) {
    const isBankTransfer =
      paymentMethod === 'bank_transfer';

    return (
      <div className="max-w-lg mx-auto py-10">
        <div className="text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isBankTransfer
                ? 'bg-yellow-400/10 border-2 border-yellow-400'
                : 'bg-green-400/10 border-2 border-green-400'
            }`}
          >
            {isBankTransfer ? (
              <Building2
                size={40}
                className="text-yellow-400"
              />
            ) : (
              <CheckCircle
                size={40}
                className="text-green-400"
              />
            )}
          </div>

          <h1 className="text-2xl font-extrabold mb-3">
            {isBankTransfer
              ? 'Order Submitted'
              : 'Order Placed'}
          </h1>

          <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
            {isBankTransfer
              ? 'Your order has been recorded and is awaiting payment verification. The service will not be activated until the payment is confirmed.'
              : 'Your payment was recorded and your order has been submitted for processing.'}
          </p>

          {isBankTransfer && (
            <div className="mb-4 flex items-start gap-2 text-left p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
              <Clock
                size={15}
                className="text-yellow-400 flex-shrink-0 mt-0.5"
              />

              <p className="text-xs text-yellow-200/90 leading-relaxed">
                Bank transfers are manually reviewed. Verification
                time can vary depending on payment confirmation and
                business hours.
              </p>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 mb-8">
            <span className="text-sm font-bold gold-gradient-text">
              Order #{orderId}
            </span>
          </div>
        </div>

        <div className="card-base card-gradient-bg text-left mb-5 space-y-3">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              Platform
            </span>
            <span className="font-semibold">
              {selectedPlatform}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              Service
            </span>
            <span className="font-semibold text-right">
              {selectedService?.name}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              Quantity
            </span>
            <span className="font-semibold tabular-nums">
              {quantity?.toLocaleString('en-NG')}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-sm border-t border-border pt-3">
            <span className="text-muted-foreground">
              Amount
            </span>
            <span className="font-extrabold gold-gradient-text tabular-nums">
              ₦{totalPrice.toLocaleString('en-NG')}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              Payment
            </span>

            <span
              className={`font-semibold text-xs ${
                isBankTransfer
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }`}
            >
              {isBankTransfer
                ? 'Bank Transfer · Pending Verification'
                : 'Wallet · Paid'}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info
              size={15}
              className="text-primary flex-shrink-0 mt-0.5"
            />

            <div>
              <p className="text-xs font-semibold mb-1">
                Important information
              </p>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Delivery estimates are service estimates and may
                vary. Results can also vary by platform and service.
                You can monitor your order from your dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/user-dashboard"
            className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold text-center"
          >
            View Dashboard
          </Link>

          <button
            onClick={resetOrder}
            className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold"
          >
            New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Place New Order
            </h1>

            <p className="text-sm text-muted-foreground">
              Choose a service, review the price and submit your
              order.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-400">
            <ShieldCheck size={15} />
            Secure checkout
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
          <span className="text-xs text-muted-foreground">
            Available wallet balance
          </span>

          <span className="font-bold text-primary tabular-nums">
            ₦{walletBalance.toLocaleString('en-NG')}
          </span>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={`step-${step.id}`}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep > step.id
                    ? 'gold-gradient-bg text-primary-foreground'
                    : currentStep === step.id
                    ? 'border-2 border-primary text-primary bg-primary/10'
                    : 'border-2 border-border text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={16} />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={`text-[10px] mt-1.5 font-semibold whitespace-nowrap ${
                  currentStep === step.id
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 rounded-full ${
                  currentStep > step.id
                    ? 'gold-gradient-bg'
                    : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-2">
                Select Platform
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Select the platform associated with the service
                you want to order.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <button
                    key={`platform-select-${platform
                      .toLowerCase()
                      .replace(/[\s()]/g, '-')}`}
                    type="button"
                    onClick={() => {
                      setValue('platform', platform);
                      setValue('serviceId', '');
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedPlatform === platform
                        ? 'border-primary bg-primary/10 glow-gold-sm'
                        : 'border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    <span className="text-3xl">
                      {platformEmoji(platform)}
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        selectedPlatform === platform
                          ? 'text-primary'
                          : 'text-foreground'
                      }`}
                    >
                      {platform}
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      {(SERVICES_BY_PLATFORM[platform] || [])
                        .length}{' '}
                      services
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-4">
              <div className="flex items-start gap-2">
                <Info
                  size={15}
                  className="text-blue-400 flex-shrink-0 mt-0.5"
                />

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Available services, pricing, minimum quantities
                  and estimated delivery information are shown
                  before you confirm payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-2">
                Select Service
              </h2>

              <p className="text-sm text-muted-foreground mb-5">
                Choose the specific service you want for{' '}
                <span className="text-primary font-semibold">
                  {selectedPlatform}
                </span>
                .
              </p>

              <div className="space-y-2">
                {availableServices.map((service) => (
                  <button
                    key={`svc-select-${service.id}`}
                    type="button"
                    onClick={() =>
                      setValue('serviceId', service.id)
                    }
                    className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedServiceId === service.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40 bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedServiceId === service.id
                            ? 'gold-gradient-bg'
                            : 'bg-muted/60'
                        }`}
                      >
                        {selectedServiceId === service.id ? (
                          <Check
                            size={16}
                            className="text-primary-foreground"
                          />
                        ) : (
                          <span className="text-base">
                            {platformEmoji(selectedPlatform)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {service.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {service.quality} Quality ·{' '}
                          {service.delivery}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-sm gold-gradient-text tabular-nums">
                        ₦
                        {service.pricePerUnit.toLocaleString(
                          'en-NG'
                        )}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {service.unit}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-base mb-1">
                Profile / Post URL
              </h2>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Enter the public URL where the selected service
                should be applied. PrimeBoost does not require your
                social media password for a standard order.
              </p>

              <div className="relative">
                <LinkIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="url"
                  className="input-field pl-9"
                  placeholder={
                    selectedPlatform === 'TikTok'
                      ? 'https://tiktok.com/@yourusername'
                      : selectedPlatform === 'Instagram'
                      ? 'https://instagram.com/yourusername'
                      : selectedPlatform === 'Telegram'
                      ? 'https://t.me/yourchannel'
                      : selectedPlatform === 'Snapchat'
                      ? 'https://snapchat.com/add/yourusername'
                      : selectedPlatform === 'YouTube'
                      ? 'https://youtube.com/@yourchannel'
                      : 'https://x.com/yourusername'
                  }
                  {...register('url', {
                    required: 'URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message:
                        'Enter a valid URL starting with https://',
                    },
                  })}
                />
              </div>

              {errors.url && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.url.message}
                </p>
              )}

              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                <AlertCircle
                  size={14}
                  className="text-blue-400 flex-shrink-0 mt-0.5"
                />

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Make sure the URL is correct and accessible.
                  Private accounts or restricted content may affect
                  whether a service can be completed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && selectedService && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-1">
                Select Quantity
              </h2>

              <p className="text-sm text-muted-foreground mb-5">
                Minimum:{' '}
                <span className="font-semibold tabular-nums">
                  {selectedService.minQty.toLocaleString()}
                </span>{' '}
                · Maximum:{' '}
                <span className="font-semibold tabular-nums">
                  {selectedService.maxQty.toLocaleString()}
                </span>
              </p>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">
                  Quantity{' '}
                  <span className="text-xs text-muted-foreground font-normal">
                    (minimum{' '}
                    {selectedService.minQty.toLocaleString()})
                  </span>
                </label>

                <input
                  type="number"
                  className="input-field text-lg font-bold tabular-nums"
                  min={selectedService.minQty}
                  max={selectedService.maxQty}
                  step={100}
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: {
                      value: selectedService.minQty,
                      message: MINIMUM_ORDER_MESSAGE,
                    },
                    max: {
                      value: selectedService.maxQty,
                      message: `Maximum is ${selectedService.maxQty.toLocaleString()}`,
                    },
                    valueAsNumber: true,
                  })}
                />

                {errors.quantity && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Quick select
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    selectedService.minQty,
                    selectedService.minQty * 2,
                    selectedService.minQty * 5,
                    selectedService.minQty * 10,
                    selectedService.minQty * 20,
                  ]
                    .filter(
                      (qty) => qty <= selectedService.maxQty
                    )
                    .map((qty) => (
                      <button
                        key={`qty-${qty}`}
                        type="button"
                        onClick={() =>
                          setValue('quantity', qty)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          quantity === qty
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {qty.toLocaleString()}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="card-base card-gradient-bg border-primary/30">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Price Calculator
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Service
                  </span>

                  <span className="font-semibold text-right">
                    {selectedPlatform} {selectedService.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Price per unit
                  </span>

                  <span className="font-semibold tabular-nums">
                    ₦
                    {selectedService.pricePerUnit.toLocaleString(
                      'en-NG'
                    )}{' '}
                    {selectedService.unit}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Quantity
                  </span>

                  <span className="font-semibold tabular-nums">
                    {(quantity || 0).toLocaleString('en-NG')}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm border-t border-border pt-3">
                  <span className="font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold gold-gradient-text tabular-nums">
                    ₦{totalPrice.toLocaleString('en-NG')}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex items-start gap-2">
                <Info
                  size={15}
                  className="text-primary flex-shrink-0 mt-0.5"
                />

                <p className="text-xs text-muted-foreground leading-relaxed">
                  The displayed total is calculated from the
                  selected service price and quantity. Review the
                  complete order summary before payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && selectedService && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Summary */}
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-4">
                Review Your Order
              </h2>

              <div className="space-y-2.5 mb-4">
                {[
                  {
                    label: 'Platform',
                    value: selectedPlatform,
                  },
                  {
                    label: 'Service',
                    value: selectedService.name,
                  },
                  {
                    label: 'URL',
                    value: watch('url'),
                    mono: true,
                  },
                  {
                    label: 'Quantity',
                    value: (quantity || 0).toLocaleString(
                      'en-NG'
                    ),
                  },
                  {
                    label: 'Estimated delivery',
                    value: selectedService.delivery,
                  },
                ].map((item) => (
                  <div
                    key={`confirm-${item.label}`}
                    className="flex justify-between gap-4 text-sm border-b border-border/50 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="text-muted-foreground flex-shrink-0">
                      {item.label}
                    </span>

                    <span
                      className={`font-semibold text-right truncate max-w-[220px] ${
                        item.mono
                          ? 'font-mono text-xs text-primary'
                          : ''
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="font-bold text-sm">
                  Total Amount
                </span>

                <span className="text-2xl font-extrabold gold-gradient-text tabular-nums">
                  ₦{totalPrice.toLocaleString('en-NG')}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="card-base card-gradient-bg">
              <h3 className="font-bold text-base mb-2">
                Payment Method
              </h3>

              <p className="text-xs text-muted-foreground mb-4">
                Choose how you would like to pay for this order.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod('wallet')
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === 'wallet'
                      ? 'border-primary bg-primary/10 glow-gold-sm'
                      : 'border-border hover:border-primary/40 bg-muted/20'
                  }`}
                >
                  <span className="text-2xl">💰</span>

                  <span
                    className={`text-xs font-bold ${
                      paymentMethod === 'wallet'
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}
                  >
                    Wallet
                  </span>

                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    ₦
                    {walletBalance.toLocaleString('en-NG')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod('bank_transfer')
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-border hover:border-yellow-400/40 bg-muted/20'
                  }`}
                >
                  <span className="text-2xl">🏦</span>

                  <span
                    className={`text-xs font-bold ${
                      paymentMethod === 'bank_transfer'
                        ? 'text-yellow-400'
                        : 'text-foreground'
                    }`}
                  >
                    Bank Transfer
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    Manual verification
                  </span>
                </button>
              </div>

              {/* Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Balance after payment</span>

                    <span
                      className={`font-bold tabular-nums ${
                        hasSufficientBalance
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      ₦
                      {Math.max(
                        0,
                        walletBalance - totalPrice
                      ).toLocaleString('en-NG')}
                    </span>
                  </div>

                  {!hasSufficientBalance && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-400/5 border border-red-400/20">
                      <AlertCircle
                        size={14}
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="text-xs font-semibold text-red-400">
                          Insufficient wallet balance
                        </p>

                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Add funds to your wallet or select Bank
                          Transfer if available.
                        </p>
                      </div>
                    </div>
                  )}

                  {hasSufficientBalance && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-400/5 border border-green-400/20">
                      <CheckCircle
                        size={14}
                        className="text-green-400 flex-shrink-0 mt-0.5"
                      />

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your wallet will be debited by the displayed
                        order total when the order is submitted.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bank transfer */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/30 space-y-3">
                    <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                      Bank Transfer Details
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Bank Name
                        </p>

                        <p className="text-sm font-bold">
                          {BUSINESS_BANK_DETAILS.bankName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Account Number
                          </p>

                          <p className="text-lg font-extrabold tabular-nums tracking-widest gold-gradient-text">
                            {BUSINESS_BANK_DETAILS.accountNumber}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              BUSINESS_BANK_DETAILS.accountNumber,
                              'Account number'
                            )
                          }
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
                          title="Copy account number"
                        >
                          <Copy size={14} />
                        </button>
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Account Name
                        </p>

                        <p className="text-sm font-semibold">
                          {BUSINESS_BANK_DETAILS.accountName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-yellow-400/20">
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Amount to Transfer
                          </p>

                          <p className="text-xl font-extrabold gold-gradient-text tabular-nums">
                            ₦
                            {totalPrice.toLocaleString(
                              'en-NG'
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              totalPrice.toString(),
                              'Amount'
                            )
                          }
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
                          title="Copy amount"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">
                      Transfer Reference / Narration{' '}
                      <span className="font-normal">
                        (optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      className="input-field text-sm"
                      placeholder="e.g. TRF-YOURNAME"
                      value={transferRef}
                      onChange={(event) =>
                        setTransferRef(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">
                      Proof of Payment{' '}
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    {!proofFile ? (
                      <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20">
                        <Upload
                          size={22}
                          className="text-muted-foreground"
                        />

                        <span className="text-xs text-muted-foreground text-center">
                          Upload your transfer receipt or
                          screenshot
                          <br />

                          <span className="text-[10px]">
                            JPG, PNG, WEBP or PDF · Maximum 5MB
                          </span>
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          onChange={handleProofFileChange}
                        />
                      </label>
                    ) : (
                      <div className="relative rounded-xl border border-green-400/30 bg-green-400/5 p-3 flex items-center gap-3">
                        {proofPreview &&
                        proofFile.type.startsWith(
                          'image/'
                        ) ? (
                          <img
                            src={proofPreview}
                            alt="Payment proof preview"
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
                            <Upload
                              size={20}
                              className="text-muted-foreground"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">
                            {proofFile.name}
                          </p>

                          <p className="text-[10px] text-muted-foreground">
                            {(
                              proofFile.size / 1024
                            ).toFixed(0)}{' '}
                            KB
                          </p>

                          <span className="flex items-center gap-1 text-[10px] text-green-400 mt-0.5">
                            <CheckCircle size={10} />
                            Ready for upload
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={removeProofFile}
                          className="p-1.5 rounded-lg hover:bg-red-400/10 text-muted-foreground hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                    <AlertCircle
                      size={14}
                      className="text-blue-400 flex-shrink-0 mt-0.5"
                    />

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your order will remain{' '}
                      <strong>pending</strong> until the transfer
                      is reviewed and confirmed. Do not send
                      additional payment unless instructed by
                      PrimeBoost support.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Final transparency notice */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={16}
                  className="text-primary flex-shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-xs font-semibold mb-1">
                    Before you submit
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please confirm that the platform, service, URL,
                    quantity and total amount are correct. Service
                    results and delivery times may vary depending
                    on the service and platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() =>
                setCurrentStep(currentStep - 1)
              }
              className="btn-outline-gold px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                loading ||
                (paymentMethod === 'wallet' &&
                  !hasSufficientBalance) ||
                (paymentMethod === 'bank_transfer' &&
                  !proofFile)
              }
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  {uploadingProof
                    ? 'Uploading proof...'
                    : 'Submitting...'}
                </>
              ) : paymentMethod === 'bank_transfer' ? (
                <>
                  🏦 Submit Order · ₦
                  {totalPrice.toLocaleString('en-NG')}
                </>
              ) : (
                <>
                  Place Order · ₦
                  {totalPrice.toLocaleString('en-NG')}
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Footer information */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={13} />
          <span>
            Review all service information before payment.
          </span>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4 text-xs">
          <Link
            href="/service-catalog"
            className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            View Services
            <ExternalLink size={11} />
          </Link>

          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}