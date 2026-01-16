// src/lib/docusign/envelope.ts
import docusign from 'docusign-esign';
import { getDocuSignClient } from './client';
import { db } from '@/lib/db';
import { envelopes, signers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Signer {
  email: string;
  name: string;
  routingOrder: number;
}

export async function createEnvelope(
  documentBase64: string,
  fileName: string,
  envelopeId: string,
  signersList: Signer[]
) {
  const apiClient = await getDocuSignClient();
  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const recipients = signersList.map((signer, idx) => ({
    email: signer.email,
    name: signer.name,
    recipientId: String(idx + 1),
    routingOrder: String(signer.routingOrder),
    clientUserId: undefined,
  }));

  const envelopeDefinition: docusign.EnvelopeDefinition = {
    emailSubject: 'Please sign this document',
    documents: [
      {
        documentBase64,
        name: fileName,
        fileExtension: 'pdf',
        documentId: '1',
      },
    ],
    recipients: {
      signers: recipients,
    },
    status: 'sent',
  };

  const results = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    { envelopeDefinition }
  );

  await db
    .update(envelopes)
    .set({
      docusignEnvelopeId: results.envelopeId!,
      status: 'sent',
      updatedAt: new Date(),
    })
    .where(eq(envelopes.id, envelopeId));

  for (let i = 0; i < signersList.length; i++) {
    await db
      .update(signers)
      .set({
        docusignRecipientId: String(i + 1),
      })
      .where(eq(signers.email, signersList[i].email));
  }

  return results.envelopeId!;
}

export async function createEmbeddedSigningUrl(
  envelopeId: string,
  recipientEmail: string,
  recipientName: string,
  returnUrl: string
): Promise<string> {
  const apiClient = await getDocuSignClient();
  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const [signer] = await db
    .select()
    .from(signers)
    .where(eq(signers.email, recipientEmail))
    .limit(1);

  const viewRequest: docusign.RecipientViewRequest = {
    returnUrl,
    authenticationMethod: 'none',
    email: recipientEmail,
    userName: recipientName,
    clientUserId: signer.id,
  };

  const results = await envelopesApi.createRecipientView(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    envelopeId,
    { recipientViewRequest: viewRequest }
  );

  return results.url!;
}

export async function downloadSignedDocument(
  docusignEnvelopeId: string
): Promise<Buffer> {
  const apiClient = await getDocuSignClient();
  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const results = await envelopesApi.getDocument(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    docusignEnvelopeId,
    'combined'
  );

  return Buffer.from(results as any);
}

export async function downloadAuditTrail(
  docusignEnvelopeId: string
): Promise<Buffer> {
  const apiClient = await getDocuSignClient();
  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const results = await envelopesApi.getDocument(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    docusignEnvelopeId,
    'certificate'
  );

  return Buffer.from(results as any);
}