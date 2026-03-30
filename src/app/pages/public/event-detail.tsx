import { Link } from 'react-router';
import { Calendar, MapPin, Users, Clock, Share2, Heart } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function EventDetailPage() {
  const event = {
    title: 'Tech Derby Meetup: AI in Practice',
    date: 'March 15, 2026',
    time: '6:00 PM - 9:00 PM',
    location: 'Derby QUAD',
    address: 'Market Place, Derby, DE1 3AS',
    attendees: 85,
    capacity: 100,
    spotsLeft: 15,
    category: 'Meetup',
    description: `Join us for an inspiring evening exploring practical applications of AI in industry. 
    We'll hear from two speakers working on cutting-edge AI projects at local companies, 
    followed by networking and discussion.`,
  };

  const agenda = [
    { time: '6:00 PM', activity: 'Doors Open', description: 'Registration and networking' },
    { time: '6:30 PM', activity: 'Welcome', description: 'Community updates' },
    { time: '6:40 PM', activity: 'First Speaker', description: 'AI in Manufacturing - Case study from Rolls-Royce' },
    { time: '7:10 PM', activity: 'Break', description: 'Food, drinks, and networking' },
    { time: '7:30 PM', activity: 'Second Speaker', description: 'Building AI Products - Lessons from a Derby Startup' },
    { time: '8:00 PM', activity: 'Q&A', description: 'Panel discussion and questions' },
    { time: '8:20 PM', activity: 'Networking', description: 'Open networking until close' },
  ];

  const speakers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Senior AI Engineer, Rolls-Royce',
      bio: 'Leading machine learning initiatives in aerospace manufacturing',
    },
    {
      name: 'Alex Chen',
      role: 'CTO, Derby AI Startup',
      bio: 'Building AI-powered tools for small businesses',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <Link
                to="/events"
                className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
              >
                ← Back to events
              </Link>
              <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {event.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {event.title}
              </h1>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">{event.time}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1" />
                  <div>
                    <p className="text-lg">{event.location}</p>
                    <p className="text-sm">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="text-lg">
                    {event.attendees} / {event.capacity} registered
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <div className="mb-6">
                  {event.spotsLeft < 20 ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-red-800">
                        Only {event.spotsLeft} spots left!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-green-800">
                        Spaces available
                      </p>
                    </div>
                  )}
                </div>

                <Button size="lg" className="w-full mb-3">
                  Register for Event
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Free for Tech Derby members
                  </p>
                  <Link to="/signup" className="text-sm text-blue-600 hover:underline">
                    Not a member? Join now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {event.description}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Agenda</h2>
            <div className="space-y-4">
              {agenda.map((item, i) => (
                <div key={i} className="flex gap-6 border-l-2 border-gray-200 pl-6 pb-6 last:pb-0">
                  <div className="w-24 text-sm font-medium text-gray-900 flex-shrink-0">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.activity}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Speakers</h2>
            <div className="space-y-6">
              {speakers.map((speaker, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-gray-900">{speaker.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{speaker.role}</p>
                    <p className="text-gray-600">{speaker.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Location</h2>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{event.location}</h3>
              <p className="text-gray-600 mb-4">{event.address}</p>
              <p className="text-sm text-gray-600">
                The venue is wheelchair accessible. If you have any accessibility requirements, 
                please contact us in advance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="bg-gray-200 h-32 rounded-lg mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Event Title</h3>
                <p className="text-sm text-gray-600 mb-4">March 22, 2026</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
