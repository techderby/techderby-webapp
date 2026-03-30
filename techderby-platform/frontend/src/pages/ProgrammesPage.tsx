import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const programmes = [
  {
    number: '01',
    title: 'Tech Derby Accelerator',
    audience: 'Early-stage founders at idea, MVP, or early venture stage.',
    what: 'A practical and honest programme that helps founders move from scattered activity to clearer thinking, stronger evidence, and better next steps.',
    gains: [
      'Clarity on problem, customer, and value proposition',
      'Sharper thinking around MVP and traction',
      'Accountability and founder support',
      'Stronger positioning for growth, partnerships, and investment conversations',
    ],
    cta: { label: 'Explore the Accelerator', to: '/tech-derby-accelerator' },
    accentFrom: 'from-sky-500',
    accentTo: 'to-sky-700',
  },
  {
    number: '02',
    title: 'Careers and Skills Pathways',
    audience: 'Students, graduates, aspiring professionals, and career switchers.',
    what: 'Provides exposure, confidence, direction, and access to conversations that help people understand the real landscape of digital careers.',
    gains: [
      'Career insight',
      'Community belonging',
      'Access to speakers, mentors, and peers',
      'Better understanding of roles across tech and innovation',
    ],
    cta: { label: 'Explore Career Pathways', to: '/get-involved' },
    accentFrom: 'from-orange-400',
    accentTo: 'to-orange-600',
  },
  {
    number: '03',
    title: 'Tech Star Women',
    audience: 'Women in tech and women exploring entry into digital and innovation spaces.',
    what: 'A growing strand within Tech Derby designed to increase visibility, support participation, and create more inclusive pathways into the regional ecosystem.',
    gains: [
      'Encouragement and peer connection',
      'Visibility and representation',
      'Community and support',
      'Opportunities to participate in the wider Tech Derby story',
    ],
    cta: { label: 'Explore Tech Star Women', to: '/programmes/tech-star-women' },
    accentFrom: 'from-sky-400',
    accentTo: 'to-orange-400',
  },
  {
    number: '04',
    title: 'Community and Ecosystem Programmes',
    audience: 'Partners, institutions, employers, communities, local leaders, and ecosystem builders.',
    what: 'Creates collaborative opportunities that strengthen the regional tech environment through events, partnerships, visibility, and shared action.',
    gains: [
      'Stronger local connections',
      'Better access to talent and ideas',
      'Clearer opportunities for partnership',
      "A role in shaping the region's innovation future",
    ],
    cta: { label: 'Work with Us', to: '/partners' },
    accentFrom: 'from-slate-500',
    accentTo: 'to-sky-600',
  },
];

const deliveryPillars = [
  {
    label: 'Practical',
    description: 'Focused on what helps people move forward in real life, not just what sounds impressive on paper.',
  },
  {
    label: 'Connected',
    description: 'Bringing together institutions, employers, and ideas so opportunities are easier to see and pursue.',
  },
  {
    label: 'Inclusive',
    description: 'Helping more people feel that tech belongs to them and that they have a place in the future being built.',
  },
];

const outcomes = [
  'Stronger founder readiness and startup momentum',
  'Clearer pathways into digital careers',
  'More visible local talent',
  'Deeper collaboration between education, community, and employers',
  'A more connected and confident regional tech identity',
];

export default function ProgrammesPage() {
  return (
    <>
      <PageSeo
        title="Programmes | Tech Derby"
        description="Tech Derby programmes are designed to support people at different stages of the journey — from exploring careers and building confidence to validating startup ideas and growing meaningful connections across the ecosystem."
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>
        <Container className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Tech Derby Programmes
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Practical pathways for founders,{' '}
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                talent and regional growth
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Tech Derby programmes are designed to support people at different stages of the journey, from exploring
              careers and building confidence to validating startup ideas and growing meaningful connections across the
              ecosystem.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="#programmes">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Explore Our Programmes
                </Button>
              </a>
              <Link to="/partners">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/40 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                >
                  Partner with Tech Derby
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                { value: '4', label: 'Active Programmes' },
                { value: 'Derby', label: '& East Midlands' },
                { value: 'Open', label: 'to Everyone' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-2"
                >
                  <span className="text-sm font-black text-white">{chip.value}</span>
                  <span className="text-xs text-white/55">{chip.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── INTRO ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[2fr_3fr] md:items-center md:gap-16">
            <div>
              <h2 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Programmes built for momentum, not noise
              </h2>
              <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
            </div>
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Tech Derby exists to help people move forward. Some programmes support founders who need structure,
              challenge, and clarity. Some create stronger pathways for students, graduates, and professionals. Some
              widen access, strengthen inclusion, and connect local institutions, employers, and communities more
              effectively. Together, they form part of a bigger vision: a more connected and opportunity-rich tech
              ecosystem for Derby and the East Midlands.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── PROGRAMME AREAS ── */}
      <Section id="programmes" className="bg-slate-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Programme Areas</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">What we run</h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            {programmes.map((programme) => (
              <article
                key={programme.number}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${programme.accentFrom} ${programme.accentTo}`} />
                <div className="relative flex-1 p-7">
                  <span className="pointer-events-none absolute right-4 top-1 select-none text-8xl font-black leading-none text-slate-100">
                    {programme.number}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-slate-900">{programme.title}</h3>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {programme.audience}
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{programme.what}</p>
                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What you gain</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {programme.gains.map((gain) => (
                          <span
                            key={gain}
                            className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800"
                          >
                            {gain}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-7 pb-7">
                  <Link to={programme.cta.to} className="block">
                    <Button className="h-10 w-full rounded-full px-6 text-sm shadow-sm shadow-orange-900/20">
                      {programme.cta.label}
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── HOW OUR PROGRAMMES WORK ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our Approach</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                How Tech Derby delivers value
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {deliveryPillars.map((pillar, index) => (
                <div key={pillar.label} className="relative overflow-hidden rounded-2xl bg-slate-900 p-7">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
                  <span className="text-5xl font-black leading-none text-white/10">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-lg font-black text-white">{pillar.label}</h3>
                  <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── OUTCOMES ── */}
      <Section className="bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Impact</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                What success looks like
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((outcome, index) => (
                <div key={outcome} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="bg-gradient-to-r from-sky-500 to-orange-400 bg-clip-text text-4xl font-black leading-none text-transparent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 text-sm font-medium leading-snug text-slate-700">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FOR PARTNERS ── */}
      <Section className="bg-slate-900 py-16 md:py-20">
        <Container>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-950 via-slate-900 to-slate-900 px-8 py-14 text-center md:px-14 md:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(249,115,22,0.18),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">For Partners</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                Support a programme. Shape the ecosystem.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                Tech Derby programmes are strengthened by collaboration. We welcome employers, universities, public
                bodies, investors, community organisations, and delivery partners who want to support founders,
                contribute expertise, open doors for talent, host conversations, sponsor activity, or help build a
                more connected tech future in Derby.
              </p>
              <div className="mt-8">
                <Link to="/partners">
                  <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                    Partner with Tech Derby
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
              Find the programme that fits your next step
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Whether you are building, learning, exploring, or supporting, Tech Derby programmes offer a practical
              route from interest to action.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="#programmes">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Explore Programmes
                </Button>
              </a>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                >
                  Talk to Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
