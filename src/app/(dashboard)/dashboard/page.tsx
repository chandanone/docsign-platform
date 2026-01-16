import { DocumentList } from '@/components/documents/document-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Link href="/documents/new">
          <Button>New Document</Button>
        </Link>
      </div>
      <DocumentList />
    </div>
  );
}