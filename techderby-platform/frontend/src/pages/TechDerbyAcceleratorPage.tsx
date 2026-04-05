import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import acceleratorHeroImage from '../assets/images/acc1.jpg';
import acceleratorImage2 from '../assets/images/acc2.jpg';
import acceleratorImage3 from '../assets/images/acc3.jpg';
import acceleratorImage5 from '../assets/images/acc5.jpg';
import facilitatorImage from '../assets/images/facilitator.jpeg';
import partnerMcAnderson from '../assets/images/partners/partner1.png';
import partnerBBB from '../assets/images/partners/partner2.svg';
import partnerPitchHub from '../assets/images/partners/partner3.avif';
import partnerCanopy from '../assets/images/partners/partner4.png';
import partnerDerby from '../assets/images/partners/university-of-derby.svg';
import './tech-derby-accelerator.css';

const supportPartners = [
  { name: 'University of Derby', logo: partnerDerby, url: 'https://www.derby.ac.uk' },
  { name: 'British Business Bank', logo: partnerBBB, url: 'https://www.british-business-bank.co.uk' },
  { name: 'PitchHub', logo: partnerPitchHub, url: 'https://www.pitchhub.co.uk' },
  { name: 'Canopy', logo: partnerCanopy, url: 'https://www.canopy.rent' },
  { name: 'McAnderson', logo: partnerMcAnderson, url: 'https://mcanderson.co.uk' },
];

const programmeSignals = [
  {
    label: 'Next Cohort',
    value: 'April 10 – May 29',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: 'Cohort Size',
    value: 'Small by design',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Location',
    value: 'Game Changers Lab, Derby',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Delivery',
    value: 'In-person, mentor-led',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </svg>
    ),
  },
];

const acceleratorProof = [
  {
    stat: '8',
    unit: 'weeks',
    description: 'of structured, mentor-driven progress toward funding readiness',
  },
  {
    stat: '1:1',
    unit: 'mentoring',
    description: 'with experienced founders and investors each week',
  },
  {
    stat: '100%',
    unit: 'evidence-led',
    description: 'portfolio built and refined for demo day',
  },
  {
    stat: '£0',
    unit: 'equity taken',
    description: 'selection based on clarity, commitment, and coachability',
  },
];

const journeyIcons: Record<string, React.ReactNode> = {
  search: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  coins: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M12 12h.01" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

const journey = [
  {
    week: 'Week 1',
    title: 'Problem Clarity',
    detail: 'Define the customer pain in specific, testable language and remove vanity assumptions.',
    icon: 'search',
  },
  {
    week: 'Week 2',
    title: 'Customer Discovery',
    detail: 'Run focused interviews, collect signal, and sharpen the hypothesis behind your solution.',
    icon: 'target',
  },
  {
    week: 'Week 3',
    title: 'Value Proposition',
    detail: 'Translate insights into a clear value proposition that users can repeat back to you.',
    icon: 'diamond',
  },
  {
    week: 'Week 4',
    title: 'MVP Scope',
    detail: 'Cut feature noise and prioritize the smallest version that can produce meaningful learning.',
    icon: 'build',
  },
  {
    week: 'Week 5',
    title: 'Traction Design',
    detail: 'Choose realistic channels, set measurable experiments, and build an early growth rhythm.',
    icon: 'chart',
  },
  {
    week: 'Week 6',
    title: 'Business Model',
    detail: 'Stress-test pricing, margins, and delivery assumptions with practical founder math.',
    icon: 'coins',
  },
  {
    week: 'Week 7',
    title: 'Investment Readiness',
    detail: 'Build your data room baseline and craft a narrative investors can trust and evaluate quickly.',
    icon: 'briefcase',
  },
  {
    week: 'Week 8',
    title: 'Demo Day Readiness',
    detail: 'Refine your story, evidence, and ask so your pitch is confident, concise, and credible.',
    icon: 'mic',
  },
  {
    week: 'Week 9',
    title: 'Demo Day',
    detail: 'Present your validated idea, traction evidence, and investment ask to a live audience of investors, mentors, and community leaders.',
    icon: 'rocket',
  },
];

const faqItems = [
  {
    question: 'How much time does it require each week?',
    answer: 'Plan for one in-person session plus independent founder work. Most teams commit 6 to 10 hours weekly.',
  },
  {
    question: 'Do I need a live product to apply?',
    answer: 'No. Idea-stage teams are welcome if they can show commitment to customer discovery and execution.',
  },
  {
    question: 'Is this only for founders based in Derby?',
    answer: 'Derby founders are prioritized, but applications are open to nearby founders who can attend physically.',
  },
  {
    question: 'Do you take equity?',
    answer: 'No equity is taken for participation in this cohort. Selection is based on clarity, commitment, and coachability.',
  },
  {
    question: 'What happens after the programme?',
    answer: 'Alumni join our founder network, receive ongoing mentorship access, and get priority invitations to investor events and follow-on programmes.',
  },
];

export default function TechDerbyAcceleratorPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageSeo
        title="Tech Derby | Pre-Seed Accelerator"
        description="An 8-week, clarity-led accelerator helping early-stage founders move from activity to traction and funding readiness."
      />

      {/* ── HERO ── */}
      <Section className="accelerator-hero relative overflow-hidden py-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${acceleratorImage2})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-slate-900/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(249,115,22,0.14),transparent_50%)]" />
        </div>

        <Container className="relative z-10 flex min-h-[640px] items-center py-20 md:min-h-[720px] md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="accelerator-fade-up">
              <span className="accelerator-kicker border-white/20 text-white/90">
                Tech Derby Pre-Seed Accelerator
              </span>
            </div>

            <h1 className="accelerator-fade-up accelerator-delay-1 mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-7xl">
              Build with evidence.
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                Pitch with confidence.
              </span>
            </h1>

            <p className="accelerator-fade-up accelerator-delay-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              An 8-week, clarity-led accelerator that takes early-stage founders from busy activity
              to validated learning, traction, and funding readiness.
            </p>

            <div className="accelerator-fade-up accelerator-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/programmes/pre-seed-accelerator/apply">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Apply For The Cohort
                </Button>
              </Link>
              <a
                href="#journey"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
              >
                Explore The Journey
                <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </Container>

        {/* Signal cards strip */}
        <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <Container>
            <div className="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
              {programmeSignals.map((item) => (
                <div key={item.label} className="flex items-center gap-3 px-4 py-5 md:px-6 md:py-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{item.label}</p>
                    <p className="mt-0.5 text-sm font-bold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </Section>

      {/* ── PROOF / STATS ── */}
      <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {acceleratorProof.map((item) => (
                <article key={item.stat} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {item.stat}
                  </p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-sky-700">{item.unit}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SUPPORTED BY ── */}
      <Section className="border-b border-slate-200 bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Supporting Partners
            </p>
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
          </div>
        </Container>
      </Section>

      {/* ── WHY FOUNDERS JOIN + IMAGE ── */}
      <Section className="bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Why Founders Choose Us</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Not a lecture series.
                <br />
                <span className="text-sky-700">A working room.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                This programme exists for founders who want real traction, sharper decisions,
                and a better investor story. Every session is built around execution, not theory.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { title: 'Structured weekly milestones', desc: 'One founder question resolved each week, building toward demo day.' },
                  { title: 'Evidence-first approach', desc: 'Build a portfolio of validated learning that investors trust.' },
                  { title: 'Mentor-matched guidance', desc: 'Work directly with experienced operators who have built and scaled.' },
                  { title: 'Pitch narrative refinement', desc: 'Craft your story with feedback from investors and founders.' },
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/10">
                <img
                  src={acceleratorImage3}
                  alt="Tech Derby accelerator founders collaborating"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg md:-bottom-6 md:-left-6">
                <p className="text-2xl font-black text-slate-900">8 weeks</p>
                <p className="text-sm text-slate-600">from idea to investor-ready</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FACILITATORS ── */}
      <Section className="border-y border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Meet The Facilitators</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Experienced leaders guiding every session
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                Our facilitators are founders, investors, and industry operators who have built companies,
                raised capital, and navigated the challenges you're facing right now. They bring lived
                experience — not just frameworks.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Combined years of experience', value: '30+' },
                { label: 'Startups mentored', value: '50+' },
                { label: 'Capital raised by alumni', value: '£2M+' },
                { label: 'Industries covered', value: '12+' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
              <img
                src={facilitatorImage}
                alt="Tech Derby accelerator facilitators"
                className="w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FULL-WIDTH IMAGE BREAK ── */}
      <div className="relative h-64 overflow-hidden md:h-80 lg:h-96">
        <img
          src={acceleratorHeroImage}
          alt="Tech Derby accelerator session in action"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        <Container className="relative z-10 flex h-full items-center">
          <div className="max-w-lg">
            <p className="text-lg font-black text-white md:text-2xl">
              "The best accelerators don't just teach — they build the environment where founders find clarity."
            </p>
            <p className="mt-3 text-sm font-semibold text-white/70">Tech Derby Accelerator Philosophy</p>
          </div>
        </Container>
      </div>

      {/* ── 8-WEEK JOURNEY ── */}
      <Section className="bg-white py-16 md:py-24">
        <Container>
          <div id="journey" className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="accelerator-kicker text-slate-700">The 8-Week Journey</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                Structured progress, every single week
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                Each week focuses on a single founder question. No information overload — just
                executable clarity.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:gap-5">
              {journey.map((item, index) => (
                <article
                  key={item.week}
                  className="accelerator-journey-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${100 + index * 60}ms` }}
                >
                  <div className="absolute right-4 top-4 h-8 w-8 text-slate-300 opacity-20 transition-opacity group-hover:opacity-40" aria-hidden="true">
                    {journeyIcons[item.icon]}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-700">{item.week}</p>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── BEST FIT / NOT IDEAL ── */}
      <Section className="border-y border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Is this programme right for you?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
                We designed this accelerator for a specific founder profile. Here is how to know if it is a match.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-white">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Best fit for</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {[
                    'Early-stage founders at idea, MVP, or first traction stage',
                    'Teams ready to test assumptions with real customers',
                    'Builders who want practical accountability and evidence-backed decisions',
                    'Founders who can commit to 8 consecutive weeks of focused work',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700 md:text-base">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Not ideal for</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {[
                    'Founders looking for passive content without execution',
                    'Teams unable to attend in-person sessions in Derby',
                    'Startups unwilling to validate ideas with customer evidence',
                    'Those seeking a co-working space or networking-only programme',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700 md:text-base">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── CTA ── */}
      <Section className="bg-white py-4 pb-16 md:pb-24">
        <Container>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.15),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.12),transparent_50%)]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-8 md:p-12 lg:p-16">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Ready for the next cohort?</p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                  Turn momentum into measurable progress.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
                  Applications are reviewed on clarity, commitment, and execution potential. If selected,
                  you will receive the full programme schedule and onboarding details.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/programmes/pre-seed-accelerator/apply">
                    <Button variant="secondary" className="h-12 rounded-full px-8 shadow-lg shadow-orange-600/20">
                      Start Application
                    </Button>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Talk To The Team
                  </Link>
                </div>
              </div>

              <div className="hidden h-full lg:block">
                <img
                  src={acceleratorImage5}
                  alt="Founders at Tech Derby accelerator"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="accelerator-kicker text-slate-700">Got Questions?</span>
              <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">Frequently asked questions</h2>
            </div>

            <div className="mt-10 space-y-3">
              {faqItems.map((item, index) => (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span className="pr-4 text-sm font-bold text-slate-900 md:text-base">{item.question}</span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5' : 'max-h-0'}`}
                  >
                    <p className="px-6 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
