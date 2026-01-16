import { getDocument } from '@/lib/actions/documents';
import { getPaymentStatus } from '@/lib/actions/payments';
import { Card } from '@/components/ui/card';
import { SignerForm } from '@/components/documents/signer-form';
import { PaymentForm } from '@/components/payments/payment-form';
import { Button } from '@/components/ui/button';
import { initiateSigningProcess } from '@/lib/actions/signing';

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const { document, envelope, signers } = await getDocument(params.id);
  const paymentStatus = await getPaymentStatus(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{document.title}</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Document Details</h2>
        <p className="text-sm text-gray-600">Status: {document.status}</p>
        <p className="text-sm text-gray-600">File: {document.fileName}</p>
      </Card>

      {document.status === 'draft' && !envelope && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Signers</h2>
          <SignerForm documentId={document.id} />
        </Card>
      )}

      {document.status === 'pending_payment' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
          <p className="mb-4 text-gray-600">
            Complete payment to send document for signing
          </p>
          <PaymentForm documentId={document.id} />
        </Card>
      )}

      {document.status === 'pending_signatures' && envelope && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Signers</h2>
          <div className="space-y-2">
            {signers.map((signer) => (
              <div key={signer.id} className="flex justify-between">
                <span>{signer.name}</span>
                <span className="text-sm text-gray-600">{signer.status}</span>
              </div>
            ))}
          </div>
          {!envelope.docusignEnvelopeId && (
            <form action={initiateSigningProcess.bind(null, document.id)}>
              <Button type="submit" className="mt-4">
                Send for Signatures
              </Button>
            </form>
          )}
        </Card>
      )}

      {document.status === 'completed' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          <p className="text-green-600">All signatures collected</p>
        </Card>
      )}
    </div>
  );
}