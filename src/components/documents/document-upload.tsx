'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createDocument } from '@/lib/actions/documents';
import { useRouter } from 'next/navigation';

export function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    const uploadFormData = new FormData();
    uploadFormData.append('title', formData.get('title') as string);
    uploadFormData.append('fileName', file.name);
    uploadFormData.append('fileUrl', URL.createObjectURL(file));

    const { documentId } = await createDocument(uploadFormData);
    router.push(`/documents/${documentId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input type="text" name="title" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Document</label>
        <Input type="file" name="file" accept=".pdf" required />
      </div>
      <Button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </form>
  );
}