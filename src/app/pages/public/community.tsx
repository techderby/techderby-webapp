import { Link } from 'react-router';
import { Users, MessageSquare, Calendar, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function CommunityPage() {
  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Community
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              2,500+ tech professionals, students, founders, and enthusiasts 
              making up Derby's most vibrant tech network.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '2,500+', label: 'Active Members' },
              { icon: Calendar, value: '150+', label: 'Events/Year' },
              { icon: MessageSquare, value: '50+', label: 'Companies' },
              { icon: Award, value: '10', label: 'Years Active' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
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
              Community Stories
            </h2>
            <p className="text-lg text-gray-600">Hear from our members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <p className="text-gray-700 italic mb-4">
                  "Tech Derby helped me transition into a tech career. 
                  The community support has been invaluable."
                </p>
                <div>
                  <p className="font-medium text-gray-900">Member Name</p>
                  <p className="text-sm text-gray-600">Software Developer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with Derby's tech community and grow your career
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
