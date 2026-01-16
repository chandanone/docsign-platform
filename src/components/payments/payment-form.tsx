'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { createDocumentPayment } from '@/lib/actions/payments';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error(error);
    }

    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay $9.99'}
      </Button>
    </form>
  );
}

interface PaymentFormProps {
  documentId: string;
}

export function PaymentForm({ documentId }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    createDocumentPayment(documentId).then(({ clientSecret }) => {
      setClientSecret(clientSecret!);
    });
  }, [documentId]);

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}