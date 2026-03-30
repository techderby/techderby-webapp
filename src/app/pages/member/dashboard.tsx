import { Link } from 'react-router';
import { Calendar, Users, TrendingUp, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function MemberDashboardPage() {
  const upcomingEvents = [
    {
      title: 'Tech Derby Meetup: AI in Practice',
      date: 'March 15, 2026',
      time: '6:00 PM',
      registered: true,
    },
    {
      title: 'React Fundamentals Workshop',
      date: 'March 22, 2026',
      time: '2:00 PM',
      registered: false,
    },
  ];

  const stats = [
    { label: 'Events Attended', value: '12', icon: Calendar },
    { label: 'Connections Made', value: '45', icon: Users },
    { label: 'Member Since', value: 'Jan 2025', icon: TrendingUp },
    { label: 'Programme', value: 'Meetups', icon: Award },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back, Member!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your Tech Derby community
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="border-l-4 border-gray-900 pl-4 py-2">
                <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {event.date} • {event.time}
                </p>
                {event.registered ? (
                  <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ✓ Registered
                  </span>
                ) : (
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

          <div className="space-y-3">
            <Link to="/events" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-3" />
                Browse Events
              </Button>
            </Link>
            <Link to="/member/directory" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-3" />
                View Member Directory
              </Button>
            </Link>
            <Link to="/member/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-3" />
                Edit My Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Community Updates */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Community Updates</h2>
        <div className="space-y-4">
          {[
            { title: 'New Skills Programme Launching', date: '2 days ago' },
            { title: 'Tech Star Women Panel Event Announced', date: '5 days ago' },
            { title: 'Welcome to 50 New Members!', date: '1 week ago' },
          ].map((update) => (
            <div key={update.title} className="border-b border-gray-200 pb-4 last:border-0">
              <h3 className="font-medium text-gray-900 mb-1">{update.title}</h3>
              <p className="text-sm text-gray-600">{update.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
