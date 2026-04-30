import { Link } from 'react-router';
import { ArrowRight, Users, Briefcase, Lightbulb, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function HomePage() {
  const stats = [
    { label: 'Active Members', value: '2,500+' },
    { label: 'Events Per Year', value: '150+' },
    { label: 'Partner Companies', value: '80+' },
    { label: 'Years Active', value: '10+' },
  ];

  const programmes = [
    {
      title: 'Tech Derby Meetups',
      description: 'Monthly flagship events bringing Derby\'s tech community together',
      icon: Users,
      href: '/programmes/meetups',
    },
    {
      title: 'Skills & Career Sessions',
      description: 'Structured learning and career development opportunities',
      icon: Briefcase,
      href: '/programmes/skills',
    },
    {
      title: 'Innovation & Startup Circles',
      description: 'Supporting founders and innovators building the future',
      icon: Lightbulb,
      href: '/programmes/innovation',
    },
    {
      title: 'Tech Star Women',
      description: 'Empowering women in technology through community and support',
      icon: Users,
      href: '/programmes/tech-star-women',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Tech Derby Meetup: AI in Practice',
      date: 'March 15, 2026',
      time: '6:00 PM',
      location: 'Derby QUAD',
      attendees: 85,
    },
    {
      title: 'Skills Session: React Fundamentals',
      date: 'March 22, 2026',
      time: '2:00 PM',
      location: 'University of Derby',
      attendees: 42,
    },
    {
      title: 'Tech Star Women: Leadership Panel',
      date: 'March 28, 2026',
      time: '6:30 PM',
      location: 'Rolls-Royce Learning Centre',
      attendees: 67,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Placeholder for hero image - in production, this would be the community photo */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-700">
            [Hero Background Image]
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base text-white/90 uppercase tracking-wider mb-4">
              The Network Powering Derby's Digital Economy
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Tech Derby: Derby's Thriving Tech Community
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Empowering developers, designers, data experts, founders, and future talent across Derby and the Midlands. We connect people, open doors, and help great ideas grow — together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-involved">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                  Join the community
                </Button>
              </Link>
              <Link to="/partners">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/90 text-white hover:bg-white hover:text-foreground bg-transparent">
                  Partner with us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Programmes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four distinct pillars supporting Derby's tech ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programmes.map((programme) => {
              const Icon = programme.icon;
              return (
                <Link
                  key={programme.title}
                  to={programme.href}
                  className="bg-card border border-border p-8 rounded-lg hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/90 transition-all">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {programme.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {programme.description}
                  </p>
                  <span className="text-sm font-medium text-primary flex items-center">
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Derby Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Derby?
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Strategic Location
                  </h3>
                  <p className="text-muted-foreground">
                    At the heart of the UK, with excellent transport links to major cities 
                    and a thriving regional economy.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Rich Heritage
                  </h3>
                  <p className="text-muted-foreground">
                    From Rolls-Royce to innovative startups, Derby has a proud history 
                    of engineering excellence and innovation.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Growing Ecosystem
                  </h3>
                  <p className="text-muted-foreground">
                    A vibrant community of tech talent, forward-thinking companies, 
                    and world-class educational institutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center border border-border">
              <span className="text-muted-foreground">[Derby Image Placeholder]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Upcoming Events
              </h2>
              <p className="text-lg text-muted-foreground">
                Join us at our next community gathering
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="hover:border-primary hover:text-primary">
                View All Events
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>{event.date} • {event.time}</p>
                    <p>{event.location}</p>
                    <p className="text-primary font-medium">{event.attendees} attending</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-white hover:border-primary">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Voices Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Community Voices
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from members of the Tech Derby community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4"></div>
                  <p className="text-foreground/80 italic mb-4">
                    "Tech Derby has been instrumental in my career growth. 
                    The connections and learning opportunities are invaluable."
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Member Name</p>
                  <p className="text-sm text-muted-foreground">Software Developer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Supporting Derby's tech ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-muted/50 border border-border rounded-lg h-24 flex items-center justify-center hover:border-primary/30 transition-colors"
              >
                <span className="text-muted-foreground text-sm">Partner Logo</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/partners">
              <Button variant="outline" className="hover:border-primary hover:text-primary">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Derby's Tech Community?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Connect with thousands of tech professionals, attend events, 
            and help shape the future of technology in the East Midlands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/70 text-white hover:bg-white hover:text-foreground">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}