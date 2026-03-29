import { Link } from 'react-router';
import { Users, Briefcase, Lightbulb, Sparkles, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function ProgrammesPage() {
  const programmes = [
    {
      title: 'Tech Derby Meetups',
      description: 'Our flagship monthly events bringing the entire tech community together for talks, networking, and inspiration.',
      icon: Users,
      href: '/programmes/meetups',
      features: [
        'Monthly flagship events',
        'Industry speakers',
        'Networking opportunities',
        'Open to all skill levels',
      ],
    },
    {
      title: 'Skills & Career Sessions',
      description: 'Structured learning programmes and career development opportunities for those starting or advancing in tech.',
      icon: Briefcase,
      href: '/programmes/skills',
      features: [
        'Hands-on workshops',
        'Career mentorship',
        'Skills assessments',
        'Job placement support',
      ],
    },
    {
      title: 'Innovation & Startup Circles',
      description: 'Supporting founders, innovators, and entrepreneurial minds building tomorrow\'s tech companies.',
      icon: Lightbulb,
      href: '/programmes/innovation',
      features: [
        'Founder meetups',
        'Pitch practice sessions',
        'Investor connections',
        'Startup resources',
      ],
    },
    {
      title: 'Tech Star Women',
      description: 'Creating safe, empowering spaces for women in tech to connect, learn, and thrive together.',
      icon: Sparkles,
      href: '/programmes/tech-star-women',
      features: [
        'Women-only events',
        'Mentorship programs',
        'Leadership development',
        'Safe community space',
      ],
    },
    {
      title: 'Express!',
      description: 'Stories, insights, and deep dives from Derby\'s tech community through our editorial platform.',
      icon: FileText,
      href: '/programmes/express',
      features: [
        'Community stories',
        'Technical deep-dives',
        'Career journeys',
        'Industry insights',
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Programmes
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Five distinct pillars supporting every stage of your tech journey, 
              from learning and networking to building and leading.
            </p>
          </div>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {programmes.map((programme, index) => {
              const Icon = programme.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={programme.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    !isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {programme.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {programme.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {programme.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={programme.href}>
                      <Button>
                        Learn More
                      </Button>
                    </Link>
                  </div>
                  <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">[Programme Image]</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting involved is simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Join the Community
              </h3>
              <p className="text-gray-600">
                Create your free account and tell us about your interests and goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Explore & Attend
              </h3>
              <p className="text-gray-600">
                Browse events across our programmes and register for sessions that interest you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Connect & Grow
              </h3>
              <p className="text-gray-600">
                Meet fellow community members, learn new skills, and advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of tech professionals in Derby's most active tech community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
