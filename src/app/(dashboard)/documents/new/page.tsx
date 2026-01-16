import { DocumentUpload } from '@/components/documents/document-upload';
import { Card } from '@/components/ui/card';

export default function NewDocumentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Upload Document</h1>
      <Card className="p-6">
        <DocumentUpload />
      </Card>
    </div>
  );
}