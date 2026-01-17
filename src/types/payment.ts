// src/types/payment.ts
export type PaymentStatus = 
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'refunded';

export interface Payment {
  id: string;
  documentId: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentIntentInput {
  documentId: string;
  amount?: number;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentMetadata {
  documentId: string;
  userId: string;
  documentTitle?: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface PaymentIntentSucceededData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata: PaymentMetadata;
}

export interface PaymentIntentFailedData {
  id: string;
  last_payment_error?: {
    message: string;
    code?: string;
  };
  metadata: PaymentMetadata;
}

export interface PaymentFormProps {
  documentId: string;
  amount?: number;
}

export interface PaymentStatusResult {
  status: PaymentStatus | null;
  payment: Payment | null;
}

export const DEFAULT_PAYMENT_AMOUNT = 999; // $9.99 in cents
export const DEFAULT_CURRENCY = 'usd';