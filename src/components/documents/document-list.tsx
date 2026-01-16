import { getDocuments } from '@/lib/actions/documents';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export async function DocumentList() {
  const documents = await getDocuments();

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Link key={doc.id} href={`/documents/${doc.id}`}>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">{doc.title}</h3>
            <p className="text-sm text-gray-600">{doc.status}</p>
            <p className="text-xs text-gray-500">
              {doc.createdAt.toLocaleDateString()}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}