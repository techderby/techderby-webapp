import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CTASection } from '../components/CTASection';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useEvents } from '../hooks/use-content-query';
import heroBackgroundImage from '../assets/images/background.webp';
import partnerMcAnderson from '../assets/images/partners/partner1.png';
import partnerBBB from '../assets/images/partners/partner2.svg';
import partnerPitchHub from '../assets/images/partners/partner3.avif';
import partnerCanopy from '../assets/images/partners/partner4.png';
import partnerDerby from '../assets/images/partners/university-of-derby.svg';
import './tech-derby-accelerator.css';

/* ─────────────────────── static data ─────────────────────── */

const stats = [
  { value: '1,400+', label: 'Community members' },
  { value: '40+', label: 'Industry speakers' },
  { value: '15+', label: 'Partner organisations' },
  { value: '4 yrs', label: 'Building Derby tech' },
];

const trustTags = [
  { emoji: '🎓', label: 'Student-welcoming' },
  { emoji: '💼', label: 'Employer-backed' },
  { emoji: '🆓', label: 'Often free to attend' },
  { emoji: '📍', label: 'Derby-first' },
];

const valueProps = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6.5-3 9H8c0-2.5-3-5-3-9a7 7 0 0 1 7-7Z" />
        <path d="M9 21h6" />
      </svg>
    ),
    title: 'Real Knowledge',
    description: 'Every session delivers practical, career-relevant insight from people who have actually done it.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    ),
    title: 'Genuine Connections',
    description: 'Meet the people who will hire you, advise you, and build alongside you in Derby.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Live Opportunities',
    description: 'Jobs, internships, collaborations, and funding calls — shared with the community first.',
  },
];

const testimonials = [
  {
    quote: "Tech Derby gave me the confidence to make my career change. Within three months of attending I had two job interviews and one offer.",
    name: "Amara D.",
    role: "Junior Developer · Joined 2024",
    initials: "AD",
  },
  {
    quote: "This is the most genuine tech community I've found outside London. Real conversations, no fluff, and everyone actually wants to help.",
    name: "James K.",
    role: "Founder · Derby Start-up Scene",
    initials: "JK",
  },
  {
    quote: "As an employer, Tech Derby has been our best talent pipeline. We've hired directly from community connections three times now.",
    name: "Priya M.",
    role: "Head of Engineering · East Midlands",
    initials: "PM",
  },
];

const programmes = [
  {
    tag: 'Diversity & Inclusion',
    name: 'Tech Star Women',
    description: 'A career accelerator for women and non-binary people in Derby — building confidence, visibility, and skills in tech.',
    highlights: ['Mentorship from senior technologists', 'Public speaking & portfolio building', 'Community of 200+ women in tech'],
    to: '/programmes/tech-star-women',
    cta: 'Learn about Tech Star Women',
    gradientClass: 'from-sky-600/25 to-sky-900/60',
    tagClass: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  },
  {
    tag: 'Founders Programme',
    name: 'Pre-Seed Accelerator',
    description: 'An 8-week clarity-led programme for early-stage founders — from busy activity to validated learning, traction, and funding readiness.',
    highlights: ['Weekly structured milestones', 'Investor-ready pitch narrative', 'Cohort of Derby founders'],
    to: '/tech-derby-accelerator',
    cta: 'Explore the Accelerator',
    gradientClass: 'from-orange-500/25 to-orange-900/60',
    tagClass: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
  },
];

const supportPartners = [
  { name: 'University of Derby', logo: partnerDerby, url: 'https://www.derby.ac.uk' },
  { name: 'British Business Bank', logo: partnerBBB, url: 'https://www.british-business-bank.co.uk' },
  { name: 'PitchHub', logo: partnerPitchHub, url: 'https://www.pitchhub.co.uk' },
  { name: 'Canopy', logo: partnerCanopy, url: 'https://www.canopy.rent' },
  { name: 'McAnderson', logo: partnerMcAnderson, url: 'https://mcanderson.co.uk' },
];

const audienceGroups = [
  {
    title: 'Students & Graduates',
    description: 'Build practical skills, confidence, and a network that gets you hired.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
      </svg>
    ),
  },
  {
    title: 'Career Changers',
    description: 'Find a realistic pathway into tech through structured learning, peer support, and real opportunities.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    title: 'Founders & Makers',
    description: "Test ideas, connect with talent, and grow with feedback from Derby's start-up ecosystem.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      </svg>
    ),
  },
  {
    title: 'Employers',
    description: "Engage Derby's next generation of professionals and build a visible talent pipeline.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    title: 'Educators & Researchers',
    description: 'Bridge learning and industry by connecting your classroom to real-world practice.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Tech Enthusiasts',
    description: "Stay sharp, meet curious people, and stay connected to Derby's growing digital scene.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const meetupFlow = [
  { title: 'Keynote or Panel', description: 'A practical session focused on lessons, tools, and real experiences.', duration: '15–20 min' },
  { title: 'Team Bonding', description: 'Small-group conversations to share ideas and build meaningful local connections.', duration: '10–15 min' },
  { title: 'Tech Games & Puzzles', description: 'Interactive challenges to spark thinking and keep sessions energetic.', duration: '10 min' },
  { title: 'Lightning Talks', description: 'Fast 5-minute slots for fresh perspectives, demos, and new voices.', duration: '20–25 min' },
  { title: 'Community Announcements', description: 'Jobs, internships, events, and opportunities shared with the community.', duration: '10 min' },
  { title: 'Structured Networking', description: 'Guided networking so attendees leave with useful contacts and next steps.', duration: '20–30 min' },
];

const faqItems = [
  { question: 'Is Tech Derby free to attend?', answer: 'Many events are free or low cost, depending on venue and sponsors. Each event page shows ticket details.' },
  { question: 'Do I need to be technical to attend?', answer: 'No. Curiosity is the only requirement. We welcome beginners, students, and non-technical founders — everyone learns together.' },
  { question: 'Can my organisation sponsor or speak?', answer: 'Yes. Contact us at hello@techderby.org or via the contact form. We work with employers, universities, and community organisations.' },
  { question: 'Do you have opportunities for students?', answer: 'Yes. We promote internships, graduate roles, projects, and direct introductions through our partner network at every meetup.' },
  { question: 'How often do meetups run?', answer: 'We run monthly events across Derby, with additional programme cohorts and special events throughout the year.' },
];

/* ─────────────────────── component ─────────────────────── */

export default function HomePage() {
  const { data: events = [] } = useEvents();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = [...events]
    .filter((event) => {
      const eventDate = new Date(event.date);
      return !Number.isNaN(eventDate.getTime()) && eventDate.getTime() >= today.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const nextEvent = upcomingEvents[0] ?? null;

  return (
    <>
      <PageSeo
        title="Tech Derby - Tech Meetup and Community in Derby"
        description="Monthly tech meetups in Derby connecting students, founders, and employers. Join 1,400+ community members building Derby's digital future."
        keywords="tech meetup derby, tech events derby, tech community derby"
      />

      {/* ── HERO ── */}
      <Section className="relative min-h-[700px] py-0 md:min-h-[800px]">
        <div className="min-h-[700px] md:min-h-[800px]">
          <div
            className="absolute inset-0 bg-slate-900 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBackgroundImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/75 to-slate-900/75" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.28),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.22),transparent_50%)]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
          </div>

          <Container className="relative z-10 flex min-h-[700px] items-center py-24 text-center md:min-h-[800px] md:py-32">
            <div className="mx-auto max-w-4xl">
              {/* Live event badge */}
              {nextEvent ? (
                <a
                  href={nextEvent.registrationLink ?? '/events'}
                  target={nextEvent.registrationLink ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  aria-label={`Next event — ${new Date(nextEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}${nextEvent.registrationLink ? ' (opens in a new tab)' : ''}`}
                  className="group mb-5 inline-flex items-center gap-2.5 rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-orange-300 backdrop-blur-sm transition hover:border-orange-400/60 hover:bg-orange-400/15"
                >
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
                  </span>
                  <span aria-hidden="true">Next event — {new Date(nextEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</span>
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                  The Network Powering Derby's Digital Economy
                </span>
              )}

              <h1 className="text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl md:text-[5.25rem]">
                Where Derby's tech
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
                  community meets.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                Students, founders, employers, and curious minds — united by one goal: making Derby one of the UK's most exciting places to build a career in tech.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={nextEvent?.registrationLink ?? '/events'}
                  target={nextEvent?.registrationLink ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  aria-label={`Attend The Next Meetup${nextEvent?.registrationLink ? ' (opens in a new tab)' : ''}`}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-orange-500 px-9 text-sm font-semibold text-white shadow-xl shadow-orange-900/40 transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  Attend The Next Meetup
                </a>
                <Link
                  to="/about"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/45 hover:bg-white/10"
                >
                  Our story
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Trust tags */}
              <ul className="mt-12 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Community qualities">
                {trustTags.map((tag) => (
                  <li key={tag.label} className="flex items-center gap-1.5 text-[12px] font-medium text-white/70">
                    <span aria-hidden="true">{tag.emoji}</span>
                    {tag.label}
                  </li>
                ))}
              </ul>
            </div>
          </Container>

          {/* Stats strip */}
          <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md">
            <Container>
              <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-4 py-6 text-center md:px-6 md:py-7">
                    <p className="text-2xl font-black text-white md:text-4xl">{stat.value}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </Section>

      {/* ── VALUE PROPS ── */}
      <Section className="bg-slate-900 py-0">
        <Container>
          <div className="mx-auto grid max-w-6xl divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {valueProps.map((vp) => (
              <div key={vp.title} className="flex items-start gap-5 px-6 py-8 md:px-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                  {vp.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide text-white">{vp.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50">{vp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── UPCOMING EVENTS ── */}
      <Section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">What's Coming Up</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Upcoming meetups</h2>
                <p className="mt-2 max-w-lg text-sm text-slate-500">In-person in Derby. All levels welcome — from first-timers to regulars.</p>
              </div>
              <Link to="/events" className="group flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-800">
                View all events
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <article key={event.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-orange-500" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                          {event.theme ?? 'Meetup'}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          {new Date(event.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-black leading-tight text-slate-900">{event.title}</h3>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
                        {event.shortLine ?? event.description}
                      </p>
                      <div className="mt-6">
                        <a href={event.eventRegistrationLink ?? event.registrationLink ?? '#'} target="_blank" rel="noreferrer noopener">
                          <Button variant="secondary" className="w-full rounded-xl">Reserve Your Seat</Button>
                        </a>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                  <p className="text-sm text-slate-600">Upcoming meetup details will appear here once events are published.</p>
                  <Link to="/events" className="mt-3 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
                    Browse past events &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── BOLD IMPACT ── */}
      <Section className="relative overflow-hidden bg-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(ellipse_at_100%_50%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Why It Matters</p>
              <h2 className="mt-4 text-3xl font-black leading-[1.1] text-white md:text-5xl">
                Derby is building something.
                <br />
                <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                  Are you part of it?
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                The East Midlands has the talent, the ambition, and the infrastructure. What it needs is more people like you showing up, connecting, and building together.
              </p>
              <div className="mt-8 space-y-5">
                {[
                  { icon: '🎯', text: 'Every meetup puts you in a room with employers, founders, and peers — ready to connect.' },
                  { icon: '📈', text: 'Members report faster career growth, stronger networks, and more confidence in their direction.' },
                  { icon: '🤝', text: 'We share real jobs, real talks, and real feedback — not curated highlight reels.' },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-4">
                    <span className="text-xl leading-tight">{item.icon}</span>
                    <p className="text-sm leading-relaxed text-white/65 md:text-base">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/get-involved">
                  <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">Join The Community</Button>
                </Link>
                <Link to="/about" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-8 text-sm font-semibold text-white/75 transition hover:border-white/40 hover:text-white">
                  About Tech Derby
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:mt-0">
              {[
                { value: '78%', label: 'of members report new opportunities within 6 months of joining' },
                { value: '#1', label: 'tech community in Derbyshire by attendance and engagement' },
                { value: '3×', label: 'more likely to get hired when you know someone in the community' },
                { value: '100%', label: 'locally driven — every decision made in Derby\'s interest' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHO IT'S FOR ── */}
      <Section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Built For Everyone</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Who Tech Derby is for</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
                A community for people building careers, companies, and capability across the East Midlands.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {audienceGroups.map((group) => (
                <Link
                  key={group.title}
                  to="/get-involved"
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition-colors duration-300 group-hover:bg-sky-700 group-hover:text-white">
                    {group.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{group.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{group.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-700 opacity-0 transition-opacity group-hover:opacity-100">
                    Get involved
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white p-5 text-center text-sm text-slate-700">
              <span className="font-bold text-sky-800">You belong here</span> — If you're curious about technology and community impact, there's a place for you at Tech Derby.
            </div>
          </div>
        </Container>
      </Section>

      {/* ── PROGRAMMES SPOTLIGHT ── */}
      <Section className="relative overflow-hidden bg-slate-900 py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Structured Pathways</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Beyond the meetup</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/55">
                Two focused programmes designed to accelerate your career or venture with structured support.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {programmes.map((prog) => (
                <div
                  key={prog.name}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${prog.gradientClass} p-8 md:p-10`}
                >
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${prog.tagClass}`}>
                    {prog.tag}
                  </span>
                  <h3 className="mt-4 text-2xl font-black text-white md:text-3xl">{prog.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{prog.description}</p>
                  <ul className="mt-6 space-y-3">
                    {prog.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-white/75">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to={prog.to}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90"
                      >
                        {prog.cta}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="bg-slate-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Community Voices</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">What members say</h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex gap-0.5 text-orange-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── MEETUP FORMAT ── */}
      <Section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Session Flow</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">What happens at a meetup</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
                A purposeful format designed to help you learn quickly and build meaningful connections.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-start">
              <div className="space-y-4">
                {meetupFlow.map((item, index) => (
                  <article key={item.title} className="group relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white transition-colors group-hover:bg-sky-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {index < meetupFlow.length - 1 && (
                        <span aria-hidden="true" className="mt-1 h-full w-px bg-slate-200" />
                      )}
                    </div>
                    <div className="mb-4 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all group-hover:border-sky-200 group-hover:bg-sky-50/40">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700">{item.duration}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white md:p-8 lg:sticky lg:top-24">
                <h3 className="text-xl font-black">Why this format works</h3>
                <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/80">
                  {[
                    'Balanced mix of learning, interaction, and opportunity sharing.',
                    'Designed for both first-time attendees and regular members.',
                    'Actionable outcomes: contacts, ideas, and clear next steps.',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                  <span className="font-bold">Typical window:</span>
                  <p className="mt-1 text-white/65">17:00–19:00 or 12:00–14:00, with flexible pacing based on session theme.</p>
                </div>
                <Link to="/events" className="mt-6 block">
                  <Button className="w-full rounded-xl text-sm">Browse Upcoming Events</Button>
                </Link>
              </aside>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── PARTNERS ── */}
      <Section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Supporting Partners</p>
            <div className="partner-carousel mt-8 overflow-hidden">
              <div className="partner-carousel-track">
                {[...supportPartners, ...supportPartners].map((partner, i) => (
                  <a
                    key={`${partner.name}-${i}`}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`partner-logo-link group flex w-[200px] shrink-0 items-center justify-center ${partner.name === 'PitchHub' ? 'rounded-lg bg-purple-700 px-4 py-2' : ''}`}
                    title={partner.name}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className={`object-contain transition-all duration-300 hover:scale-105 ${partner.name === 'Canopy' ? 'h-12 max-w-[180px] md:h-14 md:max-w-[200px]' : 'h-8 max-w-[140px] md:h-10 md:max-w-[160px]'}`}
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-10">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Become A Partner</p>
                <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">Want to partner with us?</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  Sponsor a meetup, offer a speaker, or open opportunities for the community. Every partnership builds Derby's tech future.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Link to="/contact">
                    <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">Contact Us</Button>
                  </Link>
                  <a
                    href="mailto:hello@techderby.org"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
                  >
                    hello@techderby.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section className="border-t border-slate-200 bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Got Questions?</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Frequently asked questions</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">Everything you need to know before attending your first event.</p>
            </div>

            <div className="mt-10 space-y-2.5">
              {faqItems.map((item, index) => (
                <div
                  key={item.question}
                  className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                    openFaq === index ? 'border-sky-200 bg-sky-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span className="pr-4 text-sm font-bold text-slate-900 md:text-base">{item.question}</span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${openFaq === index ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                    <p className="px-6 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Still have questions?{' '}
              <Link to="/contact" className="font-semibold text-sky-700 hover:text-sky-800">Contact us directly</Link>.
            </p>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

