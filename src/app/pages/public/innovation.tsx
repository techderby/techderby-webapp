import { Link } from 'react-router';
import { Rocket, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function InnovationPage() {
  return (
    <div>
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
              Founder Programme
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Innovation & Startup Circles
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Supporting founders, innovators, and entrepreneurial minds building 
              tomorrow's tech companies in Derby and the East Midlands.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary">
                Join the Circle
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Rocket, title: 'Pitch Practice', description: 'Regular sessions to refine your pitch' },
              { icon: Lightbulb, title: 'Founder Meetups', description: 'Connect with fellow entrepreneurs' },
              { icon: TrendingUp, title: 'Investor Access', description: 'Meet potential investors and funders' },
              { icon: Users, title: 'Mentorship', description: 'Guidance from experienced founders' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who Should Join
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Innovation Circles are designed for founders at all stages
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'Pre-Idea', description: 'Exploring entrepreneurship and looking for co-founders' },
                { title: 'Early Stage', description: 'Building MVP and validating product-market fit' },
                { title: 'Growth Stage', description: 'Scaling operations and raising capital' },
              ].map((stage) => (
                <div key={stage.title} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{stage.title}</h3>
                  <p className="text-gray-600">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Build Your Startup in Derby
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Derby's growing startup ecosystem and get the support you need to succeed.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
