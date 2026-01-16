'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addSigners } from '@/lib/actions/documents';
import { useRouter } from 'next/navigation';

interface SignerFormProps {
  documentId: string;
}

export function SignerForm({ documentId }: SignerFormProps) {
  const [signers, setSigners] = useState([
    { email: '', name: '', routingOrder: 1 },
  ]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function addSigner() {
    setSigners([
      ...signers,
      { email: '', name: '', routingOrder: signers.length + 1 },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await addSigners(documentId, signers);
    router.push(`/documents/${documentId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {signers.map((signer, idx) => (
        <div key={idx} className="p-4 border rounded-md space-y-2">
          <h3 className="font-medium">Signer {idx + 1}</h3>
          <Input
            placeholder="Name"
            value={signer.name}
            onChange={(e) => {
              const updated = [...signers];
              updated[idx].name = e.target.value;
              setSigners(updated);
            }}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={signer.email}
            onChange={(e) => {
              const updated = [...signers];
              updated[idx].email = e.target.value;
              setSigners(updated);
            }}
            required
          />
          <Input
            placeholder="Routing Order"
            type="number"
            min="1"
            value={signer.routingOrder}
            onChange={(e) => {
              const updated = [...signers];
              updated[idx].routingOrder = parseInt(e.target.value);
              setSigners(updated);
            }}
            required
          />
        </div>
      ))}
      <Button type="button" onClick={addSigner} variant="outline">
        Add Signer
      </Button>
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Continue to Payment'}
      </Button>
    </form>
  );
}