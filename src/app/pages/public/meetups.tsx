import { Link } from 'react-router';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function MeetupsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
              Flagship Programme
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tech Derby Meetups
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Our monthly flagship events bringing Derby's entire tech community together 
              for inspiring talks, valuable networking, and shared experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button size="lg" variant="secondary">
                  Upcoming Meetups
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who It's For
            </h2>
            <p className="text-lg text-gray-600">
              Tech Derby Meetups are open to everyone, regardless of experience level or background
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Developers & Engineers',
                description: 'Connect with peers, learn new technologies, and stay current with industry trends.',
              },
              {
                title: 'Career Switchers',
                description: 'Meet people who can guide your transition into tech and learn from their journeys.',
              },
              {
                title: 'Tech Leaders',
                description: 'Network with fellow leaders, share insights, and discover emerging talent.',
              },
            ].map((audience) => (
              <div key={audience.title} className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {audience.title}
                </h3>
                <p className="text-gray-600">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What to Expect
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Inspiring Talks</h3>
                    <p className="text-gray-600">
                      2-3 speakers per event covering technical topics, career insights, 
                      and real-world experiences from local and national tech leaders.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Structured Networking</h3>
                    <p className="text-gray-600">
                      Dedicated time to connect with fellow attendees, share experiences, 
                      and build lasting professional relationships.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Premium Venues</h3>
                    <p className="text-gray-600">
                      We host meetups at Derby's best venues with excellent facilities, 
                      free food & drinks, and accessible locations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">[Meetup Photo]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Format */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Typical Event Format
            </h2>
            <p className="text-lg text-gray-600">
              Every meetup follows a welcoming, structured format
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { time: '6:00 PM', activity: 'Doors Open', description: 'Arrival, registration, and informal networking' },
              { time: '6:30 PM', activity: 'Welcome & Announcements', description: 'Community updates and housekeeping' },
              { time: '6:40 PM', activity: 'First Speaker', description: '20-25 minute talk + Q&A' },
              { time: '7:10 PM', activity: 'Break', description: 'Networking, food & drinks' },
              { time: '7:30 PM', activity: 'Second Speaker', description: '20-25 minute talk + Q&A' },
              { time: '8:00 PM', activity: 'Networking', description: 'Open networking until close' },
            ].map((slot) => (
              <div key={slot.time} className="flex items-start gap-6 bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 text-gray-900 font-medium min-w-24">
                  <Clock className="w-4 h-4" />
                  {slot.time}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{slot.activity}</h3>
                  <p className="text-gray-600">{slot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Topics */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Past Topics
            </h2>
            <p className="text-lg text-gray-600">
              A sample of recent meetup themes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Building Scalable Systems at Rolls-Royce',
              'From Bootcamp to Senior Developer',
              'Machine Learning in Practice',
              'Modern DevOps Workflows',
              'Building Inclusive Tech Teams',
              'Cybersecurity Fundamentals',
              'Career Transitions into Tech',
              'Cloud Architecture Patterns',
              'The Future of Web Development',
            ].map((topic) => (
              <div key={topic} className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="font-medium text-gray-900">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Us at the Next Meetup
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Meetups happen monthly. Create an account to get notified about upcoming events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg">
                View Upcoming Meetups
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
