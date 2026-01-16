// src/lib/docusign/webhooks.ts
import { db } from '@/lib/db';
import { envelopes, signers, documents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function handleEnvelopeCompleted(envelopeId: string) {
  const [envelope] = await db
    .select()
    .from(envelopes)
    .where(eq(envelopes.docusignEnvelopeId, envelopeId))
    .limit(1);

  if (!envelope) return;

  await db
    .update(envelopes)
    .set({
      status: 'completed',
      updatedAt: new Date(),
    })
    .where(eq(envelopes.id, envelope.id));

  await db
    .update(documents)
    .set({
      status: 'completed',
      updatedAt: new Date(),
    })
    .where(eq(documents.id, envelope.documentId));
}

export async function handleRecipientCompleted(
  envelopeId: string,
  recipientEmail: string
) {
  const [envelope] = await db
    .select()
    .from(envelopes)
    .where(eq(envelopes.docusignEnvelopeId, envelopeId))
    .limit(1);

  if (!envelope) return;

  await db
    .update(signers)
    .set({
      status: 'completed',
      signedAt: new Date(),
    })
    .where(eq(signers.email, recipientEmail));
}