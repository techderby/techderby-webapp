import { Outlet, Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'About', href: '/about' },
    { 
      name: 'Programmes', 
      href: '/programmes',
      children: [
        { name: 'Meetups', href: '/programmes/meetups' },
        { name: 'Skills & Careers', href: '/programmes/skills' },
        { name: 'Innovation Circles', href: '/programmes/innovation' },
        { name: 'Tech Star Women', href: '/programmes/tech-star-women' },
        { name: 'Express!', href: '/programmes/express' },
      ]
    },
    { name: 'Events', href: '/events' },
    { name: 'Community', href: '/community' },
    { name: 'Partners', href: '/partners' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Tech Derby Style */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">TechDerby</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white text-foreground border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className="block text-white/90 hover:text-white font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-2 flex flex-col gap-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block text-sm text-white/70 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer - High Fidelity Version */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <span className="text-xl font-bold mb-4 block">TechDerby</span>
              <p className="text-sm text-white/70">
                Building Derby's digital future
              </p>
            </div>

            {/* Programmes */}
            <div>
              <h3 className="font-medium mb-4">Programmes</h3>
              <ul className="space-y-2">
                <li><Link to="/programmes/meetups" className="text-sm text-white/70 hover:text-white transition-colors">Meetups</Link></li>
                <li><Link to="/programmes/skills" className="text-sm text-white/70 hover:text-white transition-colors">Skills & Careers</Link></li>
                <li><Link to="/programmes/innovation" className="text-sm text-white/70 hover:text-white transition-colors">Innovation Circles</Link></li>
                <li><Link to="/programmes/tech-star-women" className="text-sm text-white/70 hover:text-white transition-colors">Tech Star Women</Link></li>
                <li><Link to="/programmes/express" className="text-sm text-white/70 hover:text-white transition-colors">Express!</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-medium mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link to="/events" className="text-sm text-white/70 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/community" className="text-sm text-white/70 hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/partners" className="text-sm text-white/70 hover:text-white transition-colors">Partners</Link></li>
                <li><Link to="/get-involved" className="text-sm text-white/70 hover:text-white transition-colors">Get Involved</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/code-of-conduct" className="text-sm text-white/70 hover:text-white transition-colors">Code of Conduct</Link></li>
                <li><Link to="/accessibility" className="text-sm text-white/70 hover:text-white transition-colors">Accessibility</Link></li>
                <li><Link to="/safeguarding" className="text-sm text-white/70 hover:text-white transition-colors">Safeguarding</Link></li>
                <li><Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/70">
            <p>&copy; 2026 Tech Derby. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}