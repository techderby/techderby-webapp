import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Users, Target, Heart, Zap } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'Everything we do is driven by and for our community members.',
    },
    {
      icon: Target,
      title: 'Inclusive & Accessible',
      description: 'We create welcoming spaces for everyone, regardless of background or experience.',
    },
    {
      icon: Heart,
      title: 'Supportive Culture',
      description: 'We believe in lifting each other up and celebrating collective success.',
    },
    {
      icon: Zap,
      title: 'Innovation Focused',
      description: 'We champion new ideas and support those building the future.',
    },
  ];

  const team = [
    { name: 'Team Member', role: 'Executive Director' },
    { name: 'Team Member', role: 'Community Manager' },
    { name: 'Team Member', role: 'Programmes Lead' },
    { name: 'Team Member', role: 'Partnerships Director' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Tech Derby
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're building the East Midlands' most vibrant tech ecosystem, 
              connecting talent, fostering innovation, and driving digital growth across Derby and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To create an inclusive, thriving tech community that empowers individuals, 
                supports businesses, and positions Derby as a leading tech hub in the UK.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We achieve this through regular events, structured programmes, 
                meaningful partnerships, and a commitment to diversity and accessibility.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                A future where Derby is recognized nationally as a center of tech excellence, 
                innovation, and opportunity.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Where every tech professional, regardless of background, 
                can build a fulfilling career and contribute to groundbreaking work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Tech Derby began in 2016 as a small meetup group bringing together 
                tech enthusiasts in Derby. What started with a handful of developers 
                meeting monthly has grown into a thriving ecosystem of over 2,500 members.
              </p>
              <p>
                Over the years, we've evolved from simple meetups to running multiple 
                programmes serving different segments of our community – from students 
                and career switchers to experienced professionals and founders.
              </p>
              <p>
                Today, Tech Derby is recognized as a key pillar of the East Midlands tech scene, 
                partnering with major employers, educational institutions, and government bodies 
                to drive digital growth in the region.
              </p>
              <p>
                But at our core, we remain what we've always been: a community-led organization 
                focused on helping people connect, learn, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to growing Derby's tech community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Want to Get Involved?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're looking to join as a member, become a partner, 
            or volunteer with us, there are many ways to contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved">
              <Button size="lg">
                Get Involved
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
