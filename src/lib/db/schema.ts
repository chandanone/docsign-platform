import { pgTable, text, timestamp, uuid, varchar, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  name: varchar('name', { length: 255 }),
  googleId: varchar('google_id', { length: 255 }),
  instagramId: varchar('instagram_id', { length: 255 }),
  instagramUsername: varchar('instagram_username', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentStatusEnum = pgEnum('document_status', ['draft', 'pending_payment', 'pending_signatures', 'completed', 'failed']);

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  status: documentStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const envelopeStatusEnum = pgEnum('envelope_status', ['created', 'sent', 'delivered', 'signed', 'completed', 'declined', 'voided']);

export const envelopes = pgTable('envelopes', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  docusignEnvelopeId: varchar('docusign_envelope_id', { length: 255 }).unique(),
  status: envelopeStatusEnum('status').notNull().default('created'),
  signedDocumentUrl: text('signed_document_url'),
  auditTrailUrl: text('audit_trail_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const signerRoleEnum = pgEnum('signer_role', ['signer', 'cc']);

export const signers = pgTable('signers', {
  id: uuid('id').defaultRandom().primaryKey(),
  envelopeId: uuid('envelope_id').notNull().references(() => envelopes.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: signerRoleEnum('role').notNull().default('signer'),
  routingOrder: integer('routing_order').notNull().default(1),
  docusignRecipientId: varchar('docusign_recipient_id', { length: 255 }),
  signedAt: timestamp('signed_at'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'succeeded', 'failed', 'refunded']);

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).unique().notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('usd'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  documents: many(documents),
  payments: many(payments),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
  envelope: one(envelopes),
  payment: one(payments),
}));

export const envelopesRelations = relations(envelopes, ({ one, many }) => ({
  document: one(documents, { fields: [envelopes.documentId], references: [documents.id] }),
  signers: many(signers),
}));

export const signersRelations = relations(signers, ({ one }) => ({
  envelope: one(envelopes, { fields: [signers.envelopeId], references: [envelopes.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  document: one(documents, { fields: [payments.documentId], references: [documents.id] }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));
