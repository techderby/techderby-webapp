import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/community', label: 'Community' },
  { to: '/programmes', label: 'Programmes' },
  { to: '/events', label: 'Events' },
  { to: '/wire', label: 'The Wire' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="Tech Derby home" className="flex items-center text-2xl font-bold tracking-tight text-white">
          <img src={brandLogo} alt="Tech Derby" className="h-8 w-auto object-contain" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <div key={link.to}>
              <Link to={link.to} className="text-[15px] font-medium text-white/90 transition-colors hover:text-white">
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        <Link to="/membership" className="hidden md:inline-flex">
          <Button className="h-9 rounded-full px-5 text-sm">Become a Member</Button>
        </Link>

        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-1 text-sm text-white md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-slate-900 md:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-2">
              {[...links, { to: '/contact', label: 'Contact' }, { to: '/membership', label: 'Membership' }].map((link) => (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
