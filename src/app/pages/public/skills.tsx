import { Link } from 'react-router';
import { GraduationCap, Code, Users, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function SkillsPage() {
  const tracks = [
    {
      title: 'Fundamentals Track',
      description: 'Perfect for beginners and career switchers',
      duration: '12 weeks',
      sessions: '24 sessions',
    },
    {
      title: 'Advanced Development',
      description: 'For experienced developers looking to level up',
      duration: '8 weeks',
      sessions: '16 sessions',
    },
    {
      title: 'Career Development',
      description: 'Interview prep, CV workshops, and job search support',
      duration: 'Ongoing',
      sessions: 'Monthly',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
              Educational Programme
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Skills & Career Sessions
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Structured learning programmes and career development opportunities 
              helping you start or advance your tech career in Derby.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Learn. Build. Grow.
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our Skills & Career Sessions provide hands-on learning, mentorship, 
                and job placement support through structured programmes designed 
                for different skill levels.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're just starting out in tech or looking to advance your career, 
                our expert-led sessions and supportive community will help you reach your goals.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { icon: GraduationCap, title: 'Expert Instructors', description: 'Learn from experienced professionals working in industry' },
                { icon: Code, title: 'Hands-On Learning', description: 'Build real projects and gain practical experience' },
                { icon: Users, title: 'Peer Support', description: 'Learn alongside a cohort of motivated individuals' },
                { icon: TrendingUp, title: 'Career Support', description: 'Get help with job search, interviews, and career progression' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Programme Tracks */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Programme Tracks
            </h2>
            <p className="text-lg text-gray-600">
              Choose the track that matches your experience level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tracks.map((track) => (
              <div key={track.title} className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {track.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {track.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p><span className="font-medium text-gray-900">Duration:</span> {track.duration}</p>
                  <p><span className="font-medium text-gray-900">Sessions:</span> {track.sessions}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Skills</h3>
              <ul className="space-y-3">
                {[
                  'Modern web development (HTML, CSS, JavaScript)',
                  'React and frontend frameworks',
                  'Backend development with Node.js',
                  'Database fundamentals',
                  'Git and version control',
                  'Testing and debugging',
                ].map((skill) => (
                  <li key={skill} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Career Skills</h3>
              <ul className="space-y-3">
                {[
                  'CV and portfolio building',
                  'Interview preparation',
                  'Salary negotiation',
                  'Professional networking',
                  'Job search strategies',
                  'Career progression planning',
                ].map((skill) => (
                  <li key={skill} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Alumni who've launched successful tech careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <p className="text-gray-700 italic mb-6">
                  "The Skills programme gave me the confidence and technical knowledge 
                  to make the career switch I'd been dreaming about. Six months later, 
                  I'm now a junior developer at a great company in Derby."
                </p>
                <div>
                  <p className="font-medium text-gray-900">Graduate Name</p>
                  <p className="text-sm text-gray-600">Junior Developer at Company</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Tech Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Applications for our next cohort open soon. Join the waitlist to be notified.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Join Waitlist
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
