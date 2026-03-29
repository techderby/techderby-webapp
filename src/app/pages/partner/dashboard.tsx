import { Link } from 'react-router';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function PartnerDashboardPage() {
  const stats = [
    { label: 'Active Job Postings', value: '3', icon: Briefcase },
    { label: 'Talent Requests', value: '5', icon: Users },
    { label: 'Events Sponsored', value: '8', icon: Calendar },
    { label: 'Member Reach', value: '2.5k', icon: TrendingUp },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Partner Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your partnership activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6">
              <Icon className="w-5 h-5 text-gray-400 mb-3" />
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
            <Link to="/partner/talent-request" className="block">
              <Button className="w-full justify-start">
                <Users className="w-4 h-4 mr-3" />
                Submit Talent Request
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <Briefcase className="w-4 h-4 mr-3" />
              Post a Job
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-3" />
              Sponsor an Event
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Talent request submitted', date: '2 days ago' },
              { action: 'Sponsored Tech Derby Meetup', date: '1 week ago' },
              { action: 'Job posting published', date: '2 weeks ago' },
            ].map((activity, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
