import { Link } from 'react-router';
import { Users, Calendar, UserCheck, FileText, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AdminDashboardPage() {
  const stats = [
    { label: 'Total Members', value: '2,543', change: '+12%', icon: Users },
    { label: 'Pending Approvals', value: '15', icon: UserCheck },
    { label: 'Upcoming Events', value: '8', icon: Calendar },
    { label: 'Active Programmes', value: '5', icon: FileText },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of Tech Derby platform activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-gray-400" />
                {stat.change && (
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/events/new" className="block">
              <Button className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-3" />
                Create New Event
              </Button>
            </Link>
            <Link to="/admin/members" className="block">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="w-4 h-4 mr-3" />
                Approve Members (15)
              </Button>
            </Link>
            <Link to="/admin/content" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                Manage Content
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: '12 new member signups', date: 'Today' },
              { action: 'AI Meetup published', date: 'Yesterday' },
              { action: '45 event registrations', date: '2 days ago' },
              { action: 'Skills programme updated', date: '3 days ago' },
            ].map((activity, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Member Growth</h2>
        <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-12 h-12 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
