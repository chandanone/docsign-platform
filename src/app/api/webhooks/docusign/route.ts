// src/app/api/webhooks/docusign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  handleEnvelopeCompleted,
  handleRecipientCompleted,
} from '@/lib/docusign/webhooks';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data } = body;

    if (event === 'envelope-completed') {
      await handleEnvelopeCompleted(data.envelopeId);
    } else if (event === 'recipient-completed') {
      await handleRecipientCompleted(
        data.envelopeId,
        data.recipientEmail
      );
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}