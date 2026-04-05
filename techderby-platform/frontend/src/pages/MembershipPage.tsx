import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendWhatsAppNotification } from '../lib/whatsapp';
import { apiClient } from '../lib/api';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';
import { Section } from '../components/ui/Section';

const memberBenefits = [
  {
    title: 'Priority event access',
    description: 'Early tickets and reserved seats for monthly meetups and special events.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    title: 'Community directory',
    description: 'Connect with other members, find collaborators, and grow your local network.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Skills & opportunities',
    description: 'Access to workshops, mentoring, job board, and partnership introductions.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      </svg>
    ),
  },
  {
    title: 'Shape the community',
    description: 'Vote on direction, suggest topics, and contribute to how Tech Derby grows.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
];

export default function MembershipPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    const text = `[Membership Interest]\nName: ${name || '-'}\nEmail: ${email || '-'}\nTech Interest: ${interest || '-'}`;
    sendWhatsAppNotification(text);
    try {
      await apiClient.notify('[Membership Interest] New registration', text, 'Membership Form');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <PageSeo title="Tech Derby | Membership" description="Join Tech Derby and access local tech events, learning, and peer networks." />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Join The Community
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Become a
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                member.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Join Tech Derby to access local tech events, learning opportunities, and a peer network of students,
              founders, employers, and professionals across the East Midlands.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── BENEFITS ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">What You Get</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Member benefits</h2>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {memberBenefits.map((benefit) => (
                <article key={benefit.title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-sky-700 group-hover:text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SIGNUP ── */}
      <Section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Register Interest</p>
                <h2 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">Express your interest</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Membership is launching soon. Register your interest and we will notify you when it goes live.
                </p>
              </div>

              <form className="mt-8 space-y-4" aria-label="Membership interest form" onSubmit={handleSubmit}>
                {status === 'success' ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center" role="alert">
                    <p className="text-sm font-bold text-emerald-800">You're on the list!</p>
                    <p className="mt-1 text-sm text-emerald-700">Thanks {name}, we'll be in touch when membership goes live.</p>
                  </div>
                ) : (<>
                <div>
                  <label htmlFor="membership-name" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                  <Input id="membership-name" aria-label="Full name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="membership-email" className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
                  <Input id="membership-email" aria-label="Email address" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="membership-interest" className="mb-1 block text-sm font-medium text-slate-700">Primary tech interest</label>
                  <Input id="membership-interest" aria-label="Primary tech interest" placeholder="e.g. Software, Data, AI, Design" value={interest} onChange={(e) => setInterest(e.target.value)} />
                </div>
                <Button type="submit" disabled={status === 'sending'} className="mt-2 h-12 w-full rounded-full text-sm shadow-lg shadow-orange-900/30">
                  {status === 'sending' ? 'Sending…' : 'Register Interest'}
                </Button>
                {status === 'error' && <p className="text-center text-sm text-red-600">Something went wrong. Please try again.</p>}
                </>)}
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already a member?{' '}
                <Link to="/contact" className="font-semibold text-sky-700 hover:text-sky-800">
                  Contact us for support &rarr;
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
