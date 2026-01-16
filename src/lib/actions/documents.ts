// src/lib/actions/documents.ts
'use server';

import { db } from '@/lib/db';
import { documents, envelopes, signers } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createDocument(formData: FormData) {
  const { user } = await requireAuth();

  const title = formData.get('title') as string;
  const fileName = formData.get('fileName') as string;
  const fileUrl = formData.get('fileUrl') as string;

  const [document] = await db
    .insert(documents)
    .values({
      userId: user.id,
      title,
      fileName,
      fileUrl,
      status: 'draft',
    })
    .returning();

  revalidatePath('/documents');
  return { documentId: document.id };
}

export async function addSigners(
  documentId: string,
  signersData: Array<{ email: string; name: string; routingOrder: number }>
) {
  await requireAuth();

  const [envelope] = await db
.insert(envelopes)
.values({
documentId,
status: 'created',
})
.returning();
await db.insert(signers).values(
signersData.map((signer) => ({
envelopeId: envelope.id,
email: signer.email,
name: signer.name,
routingOrder: signer.routingOrder,
}))
);
await db
.update(documents)
.set({
status: 'pending_payment',
updatedAt: new Date(),
})
.where(eq(documents.id, documentId));
revalidatePath(/documents/${documentId});
return { envelopeId: envelope.id };
}
export async function getDocuments() {
const { user } = await requireAuth();
return db
.select()
.from(documents)
.where(eq(documents.userId, user.id))
.orderBy(documents.createdAt);
}
export async function getDocument(documentId: string) {
const { user } = await requireAuth();
const [document] = await db
.select()
.from(documents)
.where(eq(documents.id, documentId))
.limit(1);
if (!document || document.userId !== user.id) {
throw new Error('Document not found');
}
const [envelope] = await db
.select()
.from(envelopes)
.where(eq(envelopes.documentId, documentId))
.limit(1);
const signersList = envelope
? await db.select().from(signers).where(eq(signers.envelopeId, envelope.id))
: [];
return { document, envelope, signers: signersList };
}