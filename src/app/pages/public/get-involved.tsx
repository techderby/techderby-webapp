import { Link } from 'react-router';
import { UserPlus, Briefcase, Heart, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function GetInvolvedPage() {
  const ways = [
    {
      icon: UserPlus,
      title: 'Join as a Member',
      description: 'Free membership gives you access to all events, the member directory, and community resources.',
      cta: 'Create Account',
      href: '/signup',
    },
    {
      icon: Briefcase,
      title: 'Become a Partner',
      description: 'Partner with us to access talent, support the community, and build your brand in Derby.',
      cta: 'Learn More',
      href: '/partners',
    },
    {
      icon: Heart,
      title: 'Volunteer',
      description: 'Help organize events, mentor members, or contribute your skills to community initiatives.',
      cta: 'Get in Touch',
      href: '/contact',
    },
    {
      icon: MessageSquare,
      title: 'Speak at an Event',
      description: 'Share your expertise and experiences with the community at one of our events.',
      cta: 'Submit Proposal',
      href: '/contact',
    },
  ];

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Involved
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              There are many ways to join and contribute to Tech Derby's mission 
              of building a thriving tech community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ways.map((way) => {
              const Icon = way.icon;
              return (
                <div key={way.title} className="bg-white border border-gray-200 rounded-lg p-8">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {way.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {way.description}
                  </p>
                  <Link to={way.href}>
                    <Button>
                      {way.cta}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We'd love to hear from you. Get in touch to learn more about getting involved.
          </p>
          <Link to="/contact">
            <Button size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
