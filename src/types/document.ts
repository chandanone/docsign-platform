// src/types/document.ts
export type DocumentStatus = 
  | 'draft'
  | 'pending_payment'
  | 'pending_signatures'
  | 'completed'
  | 'failed';

export interface Document {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type EnvelopeStatus =
  | 'created'
  | 'sent'
  | 'delivered'
  | 'signed'
  | 'completed'
  | 'declined'
  | 'voided';

export interface Envelope {
  id: string;
  documentId: string;
  docusignEnvelopeId: string | null;
  status: EnvelopeStatus;
  signedDocumentUrl: string | null;
  auditTrailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SignerRole = 'signer' | 'cc';

export type SignerStatus = 
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'signed'
  | 'completed'
  | 'declined';

export interface Signer {
  id: string;
  envelopeId: string;
  email: string;
  name: string;
  role: SignerRole;
  routingOrder: number;
  docusignRecipientId: string | null;
  signedAt: Date | null;
  status: string;
  createdAt: Date;
}

export interface SignerInput {
  email: string;
  name: string;
  routingOrder: number;
  role?: SignerRole;
}

export interface DocumentWithDetails {
  document: Document;
  envelope: Envelope | null;
  signers: Signer[];
}

export interface CreateDocumentInput {
  title: string;
  fileName: string;
  fileUrl: string;
}

export interface DocumentUploadResult {
  documentId: string;
}

export interface AddSignersResult {
  envelopeId: string;
}

export interface InitiateSigningResult {
  success: boolean;
  envelopeId: string;
}

export interface EmbeddedSigningUrlRequest {
  envelopeId: string;
  recipientEmail: string;
  recipientName: string;
}

export interface EmbeddedSigningUrlResponse {
  url: string;
}

export interface DocuSignWebhookEvent {
  event: string;
  data: {
    envelopeId: string;
    recipientEmail?: string;
    status?: string;
  };
}