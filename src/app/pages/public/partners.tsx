import { Link } from 'react-router';
import { Briefcase, Users, TrendingUp, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function PartnersPage() {
  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partner With Us
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect with Derby's tech talent, support the community, 
              and help shape the future of technology in the East Midlands.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Talent Access', description: 'Connect with skilled tech professionals' },
              { icon: Briefcase, title: 'Brand Visibility', description: 'Showcase your company to the community' },
              { icon: TrendingUp, title: 'Recruitment', description: 'Find your next great hire' },
              { icon: Award, title: 'Community Impact', description: 'Support Derby\'s tech ecosystem' },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-gray-600">Companies supporting Tech Derby</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Partner Logo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Become a Partner
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join 80+ companies supporting Derby's tech community
          </p>
          <Link to="/contact">
            <Button size="lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
