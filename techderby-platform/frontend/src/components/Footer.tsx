import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from './ui/Container';
import { useAuth } from '../contexts/AuthContext';
import { useConsent } from '../contexts/ConsentContext';
import { trackAnalyticsEvent } from '../lib/analytics';
import { createMailingListSubscription } from '../services/content-service';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

const footerLinks = {
  explore: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Community', to: '/community' },
    { label: 'Programmes', to: '/programmes' },
    { label: 'Events', to: '/events' },
    { label: 'The Wire', to: '/wire' },
    { label: 'Get Involved', to: '/get-involved' },
  ],
  programmes: [
    { label: 'All Programmes', to: '/programmes' },
    { label: 'Tech Derby Accelerator', to: '/tech-derby-accelerator' },
    { label: 'Careers & Skills Pathways', to: '/get-involved' },
    { label: 'Tech Star Women', to: '/programmes/tech-star-women' },
  ],
  tools: [
    { label: 'Poster Generation', to: '/create-poster' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Cookie Policy', to: '/cookie-policy' },
    { label: 'Code of Conduct', to: '/code-of-conduct' },
    { label: 'Accessibility', to: '/accessibility' },
    { label: 'Safeguarding', to: '/safeguarding' },
    { label: 'Data Policy', to: '/data-policy' },
    { label: 'Contact', to: '/contact' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, logout } = useAuth();
  const { openPreferences } = useConsent();
  const [mailingEmail, setMailingEmail] = useState('');
  const [mailingError, setMailingError] = useState<string | null>(null);
  const [mailingMessage, setMailingMessage] = useState<string | null>(null);
  const [isSubmittingMailingList, setIsSubmittingMailingList] = useState(false);

  async function handleMailingListSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = mailingEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setMailingError('Please enter your email address.');
      setMailingMessage(null);
      return;
    }

    setIsSubmittingMailingList(true);
    setMailingError(null);
    setMailingMessage(null);

    try {
      await createMailingListSubscription(normalizedEmail);
      trackAnalyticsEvent('newsletter_signup', { signup_location: 'footer' });
      setMailingMessage('You are on the list. We will share updates soon.');
      setMailingEmail('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const apiMessage = String((err.response?.data as { error?: { message?: string } } | undefined)?.error?.message ?? '').toLowerCase();

        if (status === 403) {
          setMailingError('Mailing list sign-up is currently unavailable. Please try again shortly.');
        } else if (status === 400 && (apiMessage.includes('unique') || apiMessage.includes('already') || apiMessage.includes('email'))) {
          setMailingError('This email is already on the mailing list.');
        } else {
          setMailingError('Could not join the mailing list right now. Please try again.');
        }
      } else {
        setMailingError('Could not join the mailing list right now. Please try again.');
      }
    } finally {
      setIsSubmittingMailingList(false);
    }
  }

  return (
    <footer className="relative bg-slate-900 text-white">
      {/* Gradient accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-sky-500 via-sky-400 to-orange-400" />

      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <Container className="relative z-10 py-14 md:py-16">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:gap-8">

          {/* Brand column */}
          <div>
            <img src={brandLogo} alt="Tech Derby" className="h-10 w-auto object-contain" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Building a stronger tech community in Derby — connecting businesses, professionals and talent
              to opportunities that matter.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@techderby.org"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@techderby.org
              </a>
              <a
                href="https://www.linkedin.com/company/techderby/"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a
                href="https://lms.techderby.org"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
                Learning Hub
              </a>
            </div>

            <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Mailing List</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Get event announcements and community updates by email.
              </p>

              <form onSubmit={handleMailingListSubmit} className="mt-3 flex flex-col gap-2">
                <input
                  type="email"
                  value={mailingEmail}
                  onChange={(e) => {
                    setMailingEmail(e.target.value);
                    setMailingError(null);
                    setMailingMessage(null);
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-10 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="submit"
                  disabled={isSubmittingMailingList}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
                >
                  {isSubmittingMailingList ? 'Joining...' : 'Join mailing list'}
                </button>
              </form>

              {mailingMessage ? <p className="mt-2 text-xs text-emerald-300">{mailingMessage}</p> : null}
              {mailingError ? <p className="mt-2 text-xs text-red-300">{mailingError}</p> : null}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Programmes</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.programmes.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Tools</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.tools.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Legal</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-xs text-white/40">
              &copy; {currentYear} Tech Derby. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Community Interest Company &middot; No. 16998866
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={openPreferences} className="text-sm font-medium text-white/60 transition-colors hover:text-white">
              Cookie settings
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-9 items-center rounded-full bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center rounded-full bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
