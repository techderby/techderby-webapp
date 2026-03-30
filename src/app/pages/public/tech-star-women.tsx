import { Link } from 'react-router';
import { Heart, Users, Sparkles, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function TechStarWomenPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
              Women in Tech Programme
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tech Star Women
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed mb-8">
              A safe, empowering space for women in tech to connect, learn, 
              and thrive together. Building confidence, community, and careers.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary">
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Tech Star Women?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide dedicated spaces and programmes designed specifically for women in tech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Shield, title: 'Safe Space', description: 'Women-only events where you can speak freely and be yourself' },
              { icon: Users, title: 'Peer Support', description: 'Connect with women who understand your experiences' },
              { icon: Sparkles, title: 'Mentorship', description: 'Access to experienced women leaders in tech' },
              { icon: Heart, title: 'Career Growth', description: 'Resources and support for advancing your career' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
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
              Our Programmes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Monthly Meetups', description: 'Relaxed networking and speaker sessions in safe environments' },
              { title: 'Mentorship Programme', description: '1-on-1 mentorship with experienced women in tech' },
              { title: 'Skills Workshops', description: 'Technical and leadership development sessions' },
            ].map((programme) => (
              <div key={programme.title} className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{programme.title}</h3>
                <p className="text-gray-600">{programme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Tech Star Women
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of a supportive community of women building successful careers in tech.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Become a Member
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
