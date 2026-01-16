'use server';

import { db } from '@/lib/db';
import { payments, documents } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/session';
import { createPaymentIntent } from '@/lib/stripe/client';
import { eq } from 'drizzle-orm';

export async function createDocumentPayment(documentId: string) {
  const { user } = await requireAuth();

  const amount = 999;

  const paymentIntent = await createPaymentIntent(
    amount,
    documentId,
    user.id
  );

  await db.insert(payments).values({
    documentId,
    userId: user.id,
    stripePaymentIntentId: paymentIntent.id,
    amount,
    currency: 'usd',
    status: 'pending',
  });

  return { clientSecret: paymentIntent.client_secret };
}

export async function getPaymentStatus(documentId: string) {
  await requireAuth();

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.documentId, documentId))
    .limit(1);

  return payment?.status || null;
}