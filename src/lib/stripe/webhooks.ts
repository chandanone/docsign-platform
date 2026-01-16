// src/lib/stripe/webhooks.ts
import { stripe } from './client';
import { db } from '@/lib/db';
import { payments, documents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<any> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const { id: stripePaymentIntentId, metadata } = paymentIntent;
  const { documentId, userId } = metadata;

  await db
    .update(payments)
    .set({ 
      status: 'succeeded',
      updatedAt: new Date(),
    })
    .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId));

  await db
    .update(documents)
    .set({ 
      status: 'pending_signatures',
      updatedAt: new Date(),
    })
    .where(eq(documents.id, documentId));
}

export async function handlePaymentIntentFailed(paymentIntent: any) {
  const { id: stripePaymentIntentId } = paymentIntent;

  await db
    .update(payments)
    .set({ 
      status: 'failed',
      updatedAt: new Date(),
    })
    .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId));
}