import { FileText, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AdminContentPage() {
  const contentPages = [
    { id: 1, title: 'About Page', lastUpdated: '1 week ago', status: 'Published' },
    { id: 2, title: 'Meetups Programme', lastUpdated: '2 weeks ago', status: 'Published' },
    { id: 3, title: 'Skills Programme', lastUpdated: '3 weeks ago', status: 'Published' },
    { id: 4, title: 'Tech Star Women', lastUpdated: '1 month ago', status: 'Published' },
    { id: 5, title: 'Privacy Policy', lastUpdated: '2 months ago', status: 'Published' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Management
        </h1>
        <p className="text-gray-600">
          Manage website pages and content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentPages.map((page) => (
          <div key={page.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{page.title}</h3>
                <p className="text-sm text-gray-600">{page.lastUpdated}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {page.status}
              </span>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
