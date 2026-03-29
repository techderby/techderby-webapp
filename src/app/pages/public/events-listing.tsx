import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export function EventsListingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'meetups', name: 'Meetups' },
    { id: 'skills', name: 'Skills Sessions' },
    { id: 'tsw', name: 'Tech Star Women' },
    { id: 'innovation', name: 'Innovation' },
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Derby Meetup: AI in Practice',
      category: 'meetups',
      date: 'March 15, 2026',
      time: '6:00 PM',
      location: 'Derby QUAD',
      attendees: 85,
      spotsLeft: 15,
      description: 'Join us for an evening exploring practical AI applications with speakers from local companies.',
    },
    {
      id: 2,
      title: 'React Fundamentals Workshop',
      category: 'skills',
      date: 'March 22, 2026',
      time: '2:00 PM',
      location: 'University of Derby',
      attendees: 42,
      spotsLeft: 8,
      description: 'Hands-on workshop covering React basics, hooks, and component architecture.',
    },
    {
      id: 3,
      title: 'Tech Star Women: Leadership Panel',
      category: 'tsw',
      date: 'March 28, 2026',
      time: '6:30 PM',
      location: 'Rolls-Royce Learning Centre',
      attendees: 67,
      spotsLeft: 23,
      description: 'Panel discussion with women tech leaders sharing their career journeys and advice.',
    },
    {
      id: 4,
      title: 'Startup Pitch Practice',
      category: 'innovation',
      date: 'April 3, 2026',
      time: '6:00 PM',
      location: 'QUAD Innovation Hub',
      attendees: 18,
      spotsLeft: 12,
      description: 'Practice your pitch and get feedback from experienced founders and investors.',
    },
    {
      id: 5,
      title: 'Tech Derby Meetup: Cloud Architecture',
      category: 'meetups',
      date: 'April 12, 2026',
      time: '6:00 PM',
      location: 'Derby QUAD',
      attendees: 0,
      spotsLeft: 100,
      description: 'Deep dive into modern cloud architecture patterns and best practices.',
    },
    {
      id: 6,
      title: 'Career Development: CV Workshop',
      category: 'skills',
      date: 'April 18, 2026',
      time: '6:30 PM',
      location: 'Online',
      attendees: 34,
      spotsLeft: 16,
      description: 'Learn how to write a compelling tech CV that gets noticed by recruiters.',
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Events
            </h1>
            <p className="text-xl text-gray-600">
              Discover and join upcoming Tech Derby events across all our programmes
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {categories.find((c) => c.id === event.category)?.name}
                    </span>
                    {event.spotsLeft < 20 && (
                      <span className="text-xs font-medium text-red-600">
                        {event.spotsLeft} spots left
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.attendees > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} registered</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No events found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
