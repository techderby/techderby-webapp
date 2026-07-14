import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const focusAreas = [
  { label: 'Career confidence and progression in tech roles' },
  { label: 'Practical skills-building through talks, workshops, and peer learning' },
  { label: 'Mentoring, visibility, and stronger professional networks' },
  { label: 'Connection to opportunities across Derby and the wider region' },
];

const audienceGroups = [
  {
    title: 'Women in Tech',
    description: 'Women working in technology who want to grow, gain visibility and connect with peers across the region.',
    icon: '💻',
  },
  {
    title: 'Early-Career and Career Changers',
    description: 'Early-career professionals and career changers entering tech who need direction, confidence and community.',
    icon: '🔄',
  },
  {
    title: 'Students and Graduates',
    description: 'Students and recent graduates exploring pathways into digital careers looking for real-world insight.',
    icon: '🎓',
  },
  {
    title: 'Leaders and Allies',
    description: 'Leaders and allies who actively support inclusive growth in tech and want to contribute to a stronger ecosystem.',
    icon: '🤝',
  },
];

const programmeFormat = [
  {
    number: '01',
    title: 'Community Sessions',
    description: 'Regular gatherings with practical, career-focused themes designed to build skills and confidence.',
  },
  {
    number: '02',
    title: 'Speaker Spotlights',
    description: 'Lived-experience learning from women in tech across different roles, industries and career stages.',
  },
  {
    number: '03',
    title: 'Peer Networking',
    description: 'Structured peer networking designed for meaningful introductions, not small talk.',
  },
  {
    number: '04',
    title: 'Pathways and Opportunities',
    description: 'Clear routes into mentoring, events, employer connections and local career opportunities.',
  },
];

const whatYouGain = [
  'Stronger confidence and professional visibility',
  'Practical, applicable career insights',
  'A peer network that understands your journey',
  'Access to mentors, employers and opportunities',
  "Community and belonging in Derby's tech scene",
  'A growing story of real inclusion',
];

export default function TechStarWomenPage() {
  return (
    <>
      <PageSeo
        title="Tech Star Women | Tech Derby"
        description="Tech Star Women is a growing strand within Tech Derby designed to increase visibility, support participation, and create more inclusive pathways into the regional ecosystem."
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_40%,rgba(14,165,233,0.25),transparent_50%),radial-gradient(ellipse_at_85%_60%,rgba(249,115,22,0.18),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>
        <Container className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Tech Derby Programme
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Tech Star{' '}
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                Women
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              A growing strand within Tech Derby designed to increase visibility, support participation, and create
              more inclusive pathways into the regional tech ecosystem.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/get-involved">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Join the Programme
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/40 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                >
                  Partner or Sponsor
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHY THIS PROGRAMME EXISTS ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[2fr_3fr] md:items-center md:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our Why</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Why this programme exists
              </h2>
              <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
            </div>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                Tech Derby's broader mission is to build a local tech community where businesses and careers thrive.
                Tech Star Women strengthens that mission by increasing representation, confidence, and access to
                opportunities for women in the ecosystem.
              </p>
              <p>
                We combine practical learning with real community connection so participants leave with useful skills,
                stronger professional visibility, and a clearer sense of next steps.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHO IT'S FOR ── */}
      <Section className="bg-slate-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Who It's For</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              Who this programme is for
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
            {audienceGroups.map((group) => (
              <div
                key={group.title}
                className="group flex items-start gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xl">
                  {group.icon}
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{group.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{group.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FOCUS AREAS ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Focus Areas</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                What the programme focuses on
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {focusAreas.map((area, index) => (
                <div key={area.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-black text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm font-medium leading-snug text-slate-700">{area.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── PROGRAMME FORMAT ── */}
      <Section className="bg-slate-900 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">How It Works</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                Programme format
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {programmeFormat.map((item) => (
                <div key={item.number} className="relative overflow-hidden rounded-2xl bg-white/5 p-7">
                  <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/5" />
                  <span className="text-5xl font-black leading-none text-white/10">{item.number}</span>
                  <h3 className="mt-3 text-base font-black text-white">{item.title}</h3>
                  <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHAT YOU GAIN ── */}
      <Section className="bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Outcomes</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                What participants gain
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whatYouGain.map((gain, index) => (
                <div key={gain} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="bg-gradient-to-r from-sky-500 to-orange-400 bg-clip-text text-4xl font-black leading-none text-transparent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 text-sm font-medium leading-snug text-slate-700">{gain}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── GET INVOLVED ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-950 via-slate-900 to-slate-900 px-8 py-14 text-center md:px-14 md:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(249,115,22,0.18),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Get Involved</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                Ready to be part of something?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                Whether you want to participate, mentor, speak, or sponsor, Tech Star Women is open to people and
                organisations committed to building a stronger and more inclusive tech community in Derby.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/get-involved">
                  <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                    Join the Programme
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                  >
                    Contact Us
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full border border-white/20 bg-transparent px-8 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Contact the Team
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
              Explore all Tech Derby programmes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Tech Star Women is part of a wider set of programmes designed to help people grow, build and belong
              in Derby's tech community.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/programmes">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  View All Programmes
                </Button>
              </Link>
              <Link to="/community">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                >
                  Explore the Community
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
