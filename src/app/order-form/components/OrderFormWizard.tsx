'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Check, ChevronRight, Loader2, Link as LinkIcon, AlertCircle, CheckCircle, Upload, X, Copy, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SERVICES_BY_PLATFORM, PLATFORMS, MINIMUM_ORDER_QTY, MINIMUM_ORDER_MESSAGE, calcTotal } from '@/lib/pricing';

type OrderFormData = {
  platform: string;
  serviceId: string;
  url: string;
  quantity: number;
};

const BUSINESS_BANK_DETAILS = {
  bankName: 'Zenith Bank',
  accountNumber: '2234567890',
  accountName: 'PrimeBoost Nigeria Ltd',
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

  // Bank transfer state
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bank_transfer'>('wallet');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [transferRef, setTransferRef] = useState('');

  const { user } = useAuth();
  const supabase = createClient();

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<OrderFormData>({
    defaultValues: { quantity: MINIMUM_ORDER_QTY }
  });

  const selectedPlatform = watch('platform');
  const selectedServiceId = watch('serviceId');
  const quantity = watch('quantity');

  const availableServices = selectedPlatform ? SERVICES_BY_PLATFORM[selectedPlatform] || [] : [];
  const selectedService = availableServices.find(s => s.id === selectedServiceId);
  const totalPrice = selectedService ? calcTotal(selectedService.pricePerUnit, quantity || 0) : 0;
  const hasSufficientBalance = totalPrice <= walletBalance;

  useEffect(() => {
    if (!user?.id) return;
    fetchWalletBalance();
  }, [user?.id]);

  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setWalletBalance(Number(data.balance || 0));
        setWalletId(data.id);
      }
    } catch (err: any) {
      console.log('Wallet fetch error:', err?.message);
    }
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeProofFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`));
  };

  const submitBankTransferOrder = async (data: OrderFormData) => {
    if (!user?.id || !selectedService) {
      toast.error('Please sign in to place an order');
      return;
    }
    if (!proofFile) {
      toast.error('Please upload proof of payment');
      return;
    }

    setLoading(true);
    setUploadingProof(true);
    try {
      // Upload proof of payment
      const fileExt = proofFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, proofFile, { upsert: false });

      if (uploadError) throw new Error('Failed to upload proof: ' + uploadError.message);

      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      setUploadingProof(false);

      // Create order with pending status (no wallet deduction yet)
      const { data: newOrder, error: orderError } = await supabase
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

      if (orderError) throw orderError;

      // Create bank transfer payment record
      const { error: paymentError } = await supabase
        .from('bank_transfer_payments')
        .insert({
          user_id: user.id,
          order_id: newOrder.id,
          amount: totalPrice,
          reference: transferRef.trim() || `TRF-${newOrder.id.slice(0, 8).toUpperCase()}`,
          proof_url: urlData?.publicUrl || '',
          proof_path: filePath,
          status: 'pending',
        });

      if (paymentError) throw paymentError;

      setOrderId(newOrder.id.slice(0, 8).toUpperCase());
      setOrderPlaced(true);
      toast.success('Order submitted! Awaiting payment confirmation.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
      setUploadingProof(false);
    }
  };

  const submitWalletOrder = async (data: OrderFormData) => {
    if (!user?.id || !selectedService || !walletId) {
      toast.error('Please sign in to place an order');
      return;
    }
    if (!hasSufficientBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setLoading(true);
    try {
      const { data: newOrder, error: orderError } = await supabase
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

      if (orderError) throw orderError;

      await supabase
        .from('wallets')
        .update({ balance: walletBalance - totalPrice, total_spent: totalPrice })
        .eq('id', walletId);

      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        wallet_id: walletId,
        transaction_type: 'debit',
        source: 'order_payment',
        amount: totalPrice,
        description: `Order payment - ${data.platform} ${selectedService.name}`,
        reference: newOrder.id,
      });

      setWalletBalance(prev => prev - totalPrice);
      setOrderId(newOrder.id.slice(0, 8).toUpperCase());
      setOrderPlaced(true);
      toast.success('Order placed successfully!');

      try {
        const userEmail = user?.email;
        const userName = user?.user_metadata?.full_name || user?.email || '';
        if (userEmail) {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'order_confirmation',
              to: userEmail,
              name: userName,
              order: {
                orderId: newOrder.id.slice(0, 8).toUpperCase(),
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
        // Non-blocking
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order. Please try again.');
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
    if (currentStep === 1 && !selectedPlatform) { toast.error('Please select a platform'); return; }
    if (currentStep === 2 && !selectedServiceId) { toast.error('Please select a service'); return; }
    if (currentStep === 2 && !watch('url')) { toast.error('Please enter your profile/post URL'); return; }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  if (orderPlaced) {
    const isBankTransfer = paymentMethod === 'bank_transfer';
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in ${isBankTransfer ? 'bg-yellow-400/10 border-2 border-yellow-400' : 'bg-green-400/10 border-2 border-green-400'}`}>
          {isBankTransfer ? <Building2 size={40} className="text-yellow-400" /> : <CheckCircle size={40} className="text-green-400" />}
        </div>
        <h1 className="text-2xl font-extrabold mb-3">{isBankTransfer ? 'Order Submitted!' : 'Order Placed!'}</h1>
        <p className="text-muted-foreground mb-2 text-sm">
          {isBankTransfer
            ? 'Your order is pending payment confirmation. We will activate it once your transfer is verified.'
            : 'Your order has been submitted and is being processed.'}
        </p>
        {isBankTransfer && (
          <div className="mb-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
            <AlertCircle size={14} className="text-yellow-400 flex-shrink-0" />
            <p className="text-xs text-yellow-300">Verification usually takes 1–4 hours on business days.</p>
          </div>
        )}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 mb-8">
          <span className="text-sm font-bold gold-gradient-text">#{orderId}</span>
        </div>
        <div className="card-base card-gradient-bg text-left mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-semibold">{selectedPlatform}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service</span>
            <span className="font-semibold">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-semibold tabular-nums">{quantity?.toLocaleString('en-NG')}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-3">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-extrabold gold-gradient-text tabular-nums">₦{totalPrice.toLocaleString('en-NG')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span className={`font-semibold text-xs ${isBankTransfer ? 'text-yellow-400' : 'text-green-400'}`}>
              {isBankTransfer ? '🏦 Bank Transfer (Pending)' : '💰 Wallet (Paid)'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/user-dashboard" className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold text-center">
            View Dashboard
          </Link>
          <button
            onClick={() => {
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
            }}
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Place New Order</h1>
        <p className="text-sm text-muted-foreground">Wallet balance: <span className="font-bold text-primary tabular-nums">₦{walletBalance.toLocaleString('en-NG')}</span></p>
      </div>

      {/* Step progress */}
      <div className="flex items-center mb-8">
        {steps.map((step, idx) => (
          <React.Fragment key={`step-${step.id}`}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep > step.id
                    ? 'gold-gradient-bg text-primary-foreground'
                    : currentStep === step.id
                    ? 'border-2 border-primary text-primary bg-primary/10' : 'border-2 border-border text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? <Check size={16} /> : step.id}
              </div>
              <span className={`text-[10px] mt-1.5 font-semibold whitespace-nowrap ${currentStep === step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300 ${currentStep > step.id ? 'gold-gradient-bg' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Platform selection */}
        {currentStep === 1 && (
          <div className="card-base card-gradient-bg animate-fade-in-up">
            <h2 className="font-bold text-lg mb-2">Select Platform</h2>
            <p className="text-sm text-muted-foreground mb-6">Which platform do you want to boost?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={`platform-select-${platform.toLowerCase().replace(/[\s()]/g, '-')}`}
                  type="button"
                  onClick={() => { setValue('platform', platform); setValue('serviceId', ''); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPlatform === platform
                      ? 'border-primary bg-primary/10 glow-gold-sm' : 'border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40'
                  }`}
                >
                  <span className="text-3xl">
                    {platform === 'TikTok' && '🎵'}
                    {platform === 'Instagram' && '📸'}
                    {platform === 'Telegram' && '✈️'}
                    {platform === 'Snapchat' && '👻'}
                    {platform === 'X (Twitter)' && '𝕏'}
                    {platform === 'YouTube' && '▶️'}
                  </span>
                  <span className={`text-xs font-bold ${selectedPlatform === platform ? 'text-primary' : 'text-foreground'}`}>{platform}</span>
                  <span className="text-[10px] text-muted-foreground">{(SERVICES_BY_PLATFORM[platform] || []).length} services</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Service + URL */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-2">Select Service</h2>
              <p className="text-sm text-muted-foreground mb-5">Choose what you want to boost on {selectedPlatform}</p>
              <div className="space-y-2">
                {availableServices.map((svc) => (
                  <button
                    key={`svc-select-${svc.id}`}
                    type="button"
                    onClick={() => setValue('serviceId', svc.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedServiceId === svc.id
                        ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40 bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${selectedServiceId === svc.id ? 'gold-gradient-bg' : 'bg-muted/60'}`}>
                        {selectedServiceId === svc.id && <Check size={16} className="text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">{svc.quality} Quality · {svc.delivery}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm gold-gradient-text tabular-nums">₦{svc.pricePerUnit.toLocaleString('en-NG')}</p>
                      <p className="text-[10px] text-muted-foreground">{svc.unit}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-base mb-1">Profile / Post URL</h2>
              <p className="text-xs text-muted-foreground mb-4">Paste the full URL of your profile or post. We never ask for your password.</p>
              <div className="relative">
                <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  className="input-field pl-9"
                  placeholder={
                    selectedPlatform === 'TikTok' ? 'https://tiktok.com/@yourusername' :
                    selectedPlatform === 'Instagram' ? 'https://instagram.com/yourusername' :
                    selectedPlatform === 'Telegram' ? 'https://t.me/yourchannel' :
                    selectedPlatform === 'Snapchat' ? 'https://snapchat.com/add/yourusername' :
                    selectedPlatform === 'YouTube' ? 'https://youtube.com/@yourchannel' :
                    'https://x.com/yourusername'
                  }
                  {...register('url', {
                    required: 'URL is required',
                    pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL starting with https://' }
                  })}
                />
              </div>
              {errors.url && <p className="text-red-400 text-xs mt-1.5">{errors.url.message}</p>}
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                <AlertCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">Make sure your account is public before placing the order. Private accounts cannot receive services.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Quantity + price calculator */}
        {currentStep === 3 && selectedService && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-1">Select Quantity</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Min: <span className="font-semibold tabular-nums">{selectedService.minQty.toLocaleString()}</span> ·
                Max: <span className="font-semibold tabular-nums">{selectedService.maxQty.toLocaleString()}</span>
              </p>
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">
                  Quantity <span className="text-xs text-muted-foreground font-normal">(minimum {MINIMUM_ORDER_QTY.toLocaleString()})</span>
                </label>
                <input
                  type="number"
                  className="input-field text-lg font-bold tabular-nums"
                  min={MINIMUM_ORDER_QTY}
                  max={selectedService.maxQty}
                  step={100}
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: MINIMUM_ORDER_QTY, message: MINIMUM_ORDER_MESSAGE },
                    max: { value: selectedService.maxQty, message: `Maximum is ${selectedService.maxQty.toLocaleString()}` },
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
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick select</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    MINIMUM_ORDER_QTY,
                    MINIMUM_ORDER_QTY * 2,
                    MINIMUM_ORDER_QTY * 5,
                    MINIMUM_ORDER_QTY * 10,
                    MINIMUM_ORDER_QTY * 20,
                  ].filter(q => q <= selectedService.maxQty).map((qty) => (
                    <button
                      key={`qty-${qty}`}
                      type="button"
                      onClick={() => setValue('quantity', qty)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        quantity === qty
                          ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
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
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Price Calculator
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-semibold">{selectedPlatform} {selectedService.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per unit</span>
                  <span className="font-semibold tabular-nums">₦{selectedService.pricePerUnit.toLocaleString('en-NG')} {selectedService.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-semibold tabular-nums">{(quantity || 0).toLocaleString('en-NG')}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-extrabold gold-gradient-text tabular-nums">₦{totalPrice.toLocaleString('en-NG')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && selectedService && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Order summary */}
            <div className="card-base card-gradient-bg">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2.5 mb-4">
                {[
                  { label: 'Platform', value: selectedPlatform },
                  { label: 'Service', value: selectedService.name },
                  { label: 'URL', value: watch('url'), mono: true },
                  { label: 'Quantity', value: (quantity || 0).toLocaleString('en-NG') },
                  { label: 'Est. Delivery', value: selectedService.delivery },
                ].map((item) => (
                  <div key={`confirm-${item.label}`} className="flex justify-between gap-4 text-sm border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-muted-foreground flex-shrink-0">{item.label}</span>
                    <span className={`font-semibold text-right truncate max-w-[200px] ${item.mono ? 'font-mono text-xs text-primary' : ''}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="font-bold text-sm">Total Amount</span>
                <span className="text-2xl font-extrabold gold-gradient-text tabular-nums">₦{totalPrice.toLocaleString('en-NG')}</span>
              </div>
            </div>

            {/* Payment method selector */}
            <div className="card-base card-gradient-bg">
              <h3 className="font-bold text-base mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Wallet option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === 'wallet'
                      ? 'border-primary bg-primary/10 glow-gold-sm' : 'border-border hover:border-primary/40 bg-muted/20'
                  }`}
                >
                  <span className="text-2xl">💰</span>
                  <span className={`text-xs font-bold ${paymentMethod === 'wallet' ? 'text-primary' : 'text-foreground'}`}>Wallet</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">₦{walletBalance.toLocaleString('en-NG')}</span>
                </button>

                {/* Bank Transfer option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === 'bank_transfer' ?'border-yellow-400 bg-yellow-400/10' : 'border-border hover:border-yellow-400/40 bg-muted/20'
                  }`}
                >
                  <span className="text-2xl">🏦</span>
                  <span className={`text-xs font-bold ${paymentMethod === 'bank_transfer' ? 'text-yellow-400' : 'text-foreground'}`}>Bank Transfer</span>
                  <span className="text-[10px] text-muted-foreground">Manual verify</span>
                </button>
              </div>

              {/* Wallet payment details */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Balance after order</span>
                    <span className={`font-bold tabular-nums ${hasSufficientBalance ? 'text-green-400' : 'text-red-400'}`}>
                      ₦{Math.max(0, walletBalance - totalPrice).toLocaleString('en-NG')}
                    </span>
                  </div>
                  {!hasSufficientBalance && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-400/5 border border-red-400/20">
                      <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-400">Insufficient balance. Fund your wallet or use Bank Transfer.</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-400/5 border border-green-400/20">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">Instant activation. Order starts immediately after payment.</p>
                  </div>
                </div>
              )}

              {/* Bank Transfer details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-4">
                  {/* Bank account details */}
                  <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/30 space-y-3">
                    <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide">Transfer to this account</p>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Bank Name</p>
                          <p className="text-sm font-bold">{BUSINESS_BANK_DETAILS.bankName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Account Number</p>
                          <p className="text-lg font-extrabold tabular-nums tracking-widest gold-gradient-text">{BUSINESS_BANK_DETAILS.accountNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(BUSINESS_BANK_DETAILS.accountNumber, 'Account number')}
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                          title="Copy account number"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Account Name</p>
                          <p className="text-sm font-semibold">{BUSINESS_BANK_DETAILS.accountName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-yellow-400/20">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Amount to Transfer</p>
                          <p className="text-xl font-extrabold gold-gradient-text tabular-nums">₦{totalPrice.toLocaleString('en-NG')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(totalPrice.toString(), 'Amount')}
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                          title="Copy amount"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transfer reference */}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">
                      Transfer Reference / Narration <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="input-field text-sm"
                      placeholder="e.g. TRF-YOURNAME or leave blank"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                    />
                  </div>

                  {/* Proof of payment upload */}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">
                      Upload Proof of Payment <span className="text-red-400">*</span>
                    </label>
                    {!proofFile ? (
                      <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20">
                        <Upload size={22} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground text-center">
                          Click to upload screenshot or receipt<br />
                          <span className="text-[10px]">JPG, PNG, PDF · Max 5MB</span>
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
                        {proofPreview && proofFile.type.startsWith('image/') ? (
                          <img src={proofPreview} alt="Payment proof preview" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
                            <Upload size={20} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{proofFile.name}</p>
                          <p className="text-[10px] text-muted-foreground">{(proofFile.size / 1024).toFixed(0)} KB</p>
                          <span className="flex items-center gap-1 text-[10px] text-green-400 mt-0.5">
                            <CheckCircle size={10} /> Ready to upload
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeProofFile}
                          className="p-1.5 rounded-lg hover:bg-red-400/10 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                    <AlertCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">After submitting, your order will be held as <strong>pending</strong> until our team confirms your payment. This usually takes 1–4 hours.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
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
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                loading ||
                (paymentMethod === 'wallet' && !hasSufficientBalance) ||
                (paymentMethod === 'bank_transfer' && !proofFile)
              }
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {uploadingProof ? 'Uploading proof...' : 'Submitting...'}
                </>
              ) : paymentMethod === 'bank_transfer' ? (
                <>🏦 Submit Order · ₦{totalPrice.toLocaleString('en-NG')}</>
              ) : (
                <>Place Order · ₦{totalPrice.toLocaleString('en-NG')}</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}