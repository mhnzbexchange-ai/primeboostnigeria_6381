import React from 'react';
import AppLayout from '@/components/AppLayout';
import OrderFormWizard from './components/OrderFormWizard';

export default function OrderFormPage() {
  return (
    <AppLayout>
      <OrderFormWizard />
    </AppLayout>
  );
}