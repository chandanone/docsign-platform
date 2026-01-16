'use server';

import { db } from '@/lib/db';
import { documents, envelopes, signers } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/session';
import { createEnvelope } from '@/lib/docusign/envelope';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function initiateSigningProcess(documentId: string) {
  await requireAuth();

  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!document || document.status !== 'pending_signatures') {
    throw new Error('Document not ready for signing');
  }

  const [envelope] = await db
    .select()
    .from(envelopes)
    .where(eq(envelopes.documentId, documentId))
    .limit(1);

  const signersList = await db
    .select()
    .from(signers)
    .where(eq(signers.envelopeId, envelope.id));

  const response = await fetch(document.fileUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const docusignEnvelopeId = await createEnvelope(
    base64,
    document.fileName,
    envelope.id,
    signersList
  );

  revalidatePath(`/documents/${documentId}`);
  return { success: true, envelopeId: docusignEnvelopeId };
}