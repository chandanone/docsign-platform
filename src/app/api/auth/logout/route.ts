import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';

export async function POST() {
  await deleteSession();
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
}
```
```typescript
// src/app/api/docusign/signing-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createEmbeddedSigningUrl } from '@/lib/docusign/envelope';
import { requireAuth } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const { envelopeId, recipientEmail, recipientName } = await req.json();

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

    const signingUrl = await createEmbeddedSigningUrl(
      envelopeId,
      recipientEmail,
      recipientName,
      returnUrl
    );

    return NextResponse.json({ url: signingUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}