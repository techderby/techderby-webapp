import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';
import { useAuth } from '../contexts/AuthContext';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

type NavChild = { to: string; label: string; desc: string };
type NavItem = { to: string; label: string; children?: NavChild[] };

const links: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/community', label: 'Community' },
  {
    to: '/programmes',
    label: 'Programmes',
    children: [
      {
        to: '/programmes/pre-seed-accelerator',
        label: 'Pre-Seed Accelerator',
        desc: 'An 8-week clarity-led accelerator for early-stage founders',
      },
      {
        to: '/summit-2026',
        label: 'Tech Derby Summit 2026',
        desc: 'AI, Startups and the Next Digital Economy — 15 June 2026',
      },
    ],
  },
  { to: '/events', label: 'Events' },
  { to: '/wire', label: 'The Wire' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const personaMenuRef = useRef<HTMLDivElement | null>(null);
  const personaMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const userDisplayName = user?.firstName?.trim() || user?.username || 'Member';

  useEffect(() => {
    if (!personaMenuOpen) return;

    const closeWhenClickingOutside = (event: PointerEvent) => {
      if (!personaMenuRef.current?.contains(event.target as Node)) {
        setPersonaMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setPersonaMenuOpen(false);
      personaMenuButtonRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeWhenClickingOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeWhenClickingOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [personaMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="Tech Derby home" className="flex items-center text-2xl font-bold tracking-tight text-white">
          <img src={brandLogo} alt="Tech Derby" className="h-10 w-auto object-contain" />
        </Link>

        {/* ── Desktop nav ── */}
        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {links.map((link) =>
            link.children ? (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.to)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.to}
                  className="flex items-center gap-1 text-[15px] font-medium text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                  {/* Chevron */}
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${openDropdown === link.to ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Link>

                {/* Dropdown panel — outer wrapper with pt-3 bridges the visual gap so onMouseLeave doesn't fire */}
                {openDropdown === link.to && (
                  <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
                  <div className="rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl shadow-black/40">
                    {/* Arrow */}
                    <div className="absolute top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm border-l border-t border-white/10 bg-slate-800" />
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block rounded-lg px-4 py-3 transition-colors hover:bg-white/8"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <p className="text-sm font-semibold text-white">{child.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-white/55">{child.desc}</p>
                      </Link>
                    ))}
                    {/* Link to all programmes */}
                    <div className="mt-1 border-t border-white/8 pt-1">
                      <Link
                        to={link.to}
                        className="block rounded-lg px-4 py-2 text-xs font-semibold text-white/50 transition-colors hover:text-white/80"
                        onClick={() => setOpenDropdown(null)}
                      >
                        View all programmes →
                      </Link>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            ) : (
              <div key={link.to}>
                <Link to={link.to} className="text-[15px] font-medium text-white/90 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </div>
            ),
          )}
          <a
            href="https://lms.techderby.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-medium text-white/90 transition-colors hover:text-white"
          >
            Learning Hub
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div ref={personaMenuRef} className="relative">
              <button
                ref={personaMenuButtonRef}
                type="button"
                onClick={() => setPersonaMenuOpen((value) => !value)}
                aria-expanded={personaMenuOpen}
                aria-haspopup="menu"
                aria-controls="member-account-menu"
                className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 pr-3 text-sm text-white/85 transition hover:border-white/30 hover:bg-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-orange-500 text-xs font-black text-white">
                  {userDisplayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate">{userDisplayName}</span>
                <svg className={`h-3.5 w-3.5 transition-transform ${personaMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {personaMenuOpen ? (
                <div id="member-account-menu" role="menu" className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl shadow-black/40">
                  <p className="px-3 py-2 text-xs text-white/45">Signed in as {userDisplayName}</p>
                  <Link role="menuitem" to="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10" onClick={() => setPersonaMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setPersonaMenuOpen(false);
                      logout();
                    }}
                    className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="h-9 px-4 text-sm text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="h-9 rounded-full px-5 text-sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-1 text-sm text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </Container>

      {/* ── Mobile nav ── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900 md:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-1">
              {links.map((link) =>
                link.children ? (
                  <div key={link.to}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                      onClick={() =>
                        setMobileExpanded((prev) => (prev === link.to ? null : link.to))
                      }
                    >
                      {link.label}
                      <svg
                        className={`h-3.5 w-3.5 transition-transform ${mobileExpanded === link.to ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {mobileExpanded === link.to && (
                      <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                        <Link
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-md px-2 py-1.5 text-xs font-semibold text-white/50 hover:text-white/80"
                        >
                          All Programmes
                        </Link>
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
              >
                Contact
              </Link>
              <a
                href="https://lms.techderby.org"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-2 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
              >
                Learning Hub
              </a>
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full h-9 text-sm text-white hover:bg-white/10">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full h-9 text-sm text-white hover:bg-white/10"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full h-9 text-sm text-white hover:bg-white/10">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full h-9 text-sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
