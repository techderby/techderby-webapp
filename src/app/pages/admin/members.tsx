import { Check, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AdminMembersPage() {
  const pendingMembers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', date: '2 days ago', type: 'Member' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', date: '3 days ago', type: 'Member' },
    { id: 3, name: 'Acme Corp', email: 'contact@acme.com', date: '5 days ago', type: 'Partner' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Member Approvals
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Review and approve new member applications
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {/* Mobile cards */}
        <div className="divide-y divide-gray-200 md:hidden">
          {pendingMembers.map((member) => (
            <article key={member.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{member.name}</h2>
                  <p className="mt-0.5 text-xs text-gray-600">{member.email}</p>
                </div>
                <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                  {member.type}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">Submitted: {member.date}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="w-full text-green-600 border-green-600 hover:bg-green-50">
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Tablet/Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {member.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
