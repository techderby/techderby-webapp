import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const whatWeDo = [
  'Bring together students, professionals, founders, creatives and employers.',
  'Support skills and careers in software, data, AI, product, cloud, cyber and digital transformation.',
  'Create opportunities for collaboration, networking and peer learning.',
  'Help early-stage founders move from ideas to evidence and momentum.',
  'Champion inclusion, so the region\'s tech future reflects the people who live here.',
];

const audience = [
  {
    title: 'Founders',
    description:
      'Turn ideas into something real. Meet other builders, gain practical insight, and explore support through the Tech Derby Accelerator.',
    icon: '🚀',
    cta: { label: 'Explore the Accelerator', to: '/tech-derby-accelerator' },
  },
  {
    title: 'Students',
    description:
      'Discover pathways into tech, hear from people already in the industry, and build confidence for your next step.',
    icon: '🎓',
    cta: { label: 'Get Involved', to: '/get-involved' },
  },
  {
    title: 'Professionals',
    description:
      'Grow your network, stay close to emerging trends, and connect with others across software, data, cyber, AI and digital delivery.',
    icon: '💼',
    cta: { label: 'Join the Community', to: '/get-involved' },
  },
  {
    title: 'Employers and Partners',
    description:
      'Support local talent, connect with the regional ecosystem, and help shape a stronger innovation future for Derby.',
    icon: '🤝',
    cta: { label: 'Partner with Us', to: '/partners' },
  },
  {
    title: 'Career Switchers',
    description:
      'Find encouragement, community and practical direction as you move into the tech world.',
    icon: '🔄',
    cta: { label: 'Explore Pathways', to: '/programmes' },
  },
  {
    title: 'Women in Tech and Underrepresented Talent',
    description:
      'Be part of a more inclusive community that creates visibility, support and opportunity.',
    icon: '⭐',
    cta: { label: 'Explore Tech Star Women', to: '/programmes/tech-star-women' },
  },
];

const engagements = [
  {
    title: 'Community Events',
    description:
      'Regular gatherings that bring together local talent, industry voices, founders and emerging professionals.',
    cta: { label: 'See Upcoming Events', to: '/events' },
    accent: 'from-sky-500 to-sky-700',
  },
  {
    title: 'Tech Derby Accelerator',
    description:
      'A practical founder journey for early-stage startups looking to gain clarity, challenge assumptions and build meaningful momentum.',
    cta: { label: 'Explore the Accelerator', to: '/tech-derby-accelerator' },
    accent: 'from-orange-400 to-orange-600',
  },
  {
    title: 'Skills and Career Pathways',
    description:
      'Opportunities for students, graduates, career switchers and aspiring professionals to explore the world of tech with clearer direction.',
    cta: { label: 'View Programmes', to: '/programmes' },
    accent: 'from-sky-400 to-orange-400',
  },
];

export default function CommunityPage() {
  return (
    <>
      <PageSeo
        title="Community | Tech Derby"
        description="Tech Derby brings together founders, students, professionals, employers and the tech-curious to connect, learn and grow. Derby's connected home for tech, talent and innovation."
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
              Derby's connected home for tech, talent and innovation
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              A thriving tech community for{' '}
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                Derby and the East Midlands
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Tech Derby brings together founders, students, professionals, employers and the tech-curious to
              connect, learn and grow. From community events and career pathways to startup support and regional
              partnerships, we are building a stronger future for tech in Derby.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/get-involved">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Join the Community
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/40 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                >
                  See Upcoming Events
                </Button>
              </Link>
              <Link to="/partners" className="hidden sm:inline-flex">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/20 bg-transparent px-8 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Partner with Tech Derby
                </Button>
              </Link>
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
                Building a stronger tech community, together
              </h2>
              <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
            </div>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                Derby has always been a city of makers, engineers and problem-solvers. Tech Derby carries that spirit
                into the digital age by creating a space where people can belong, share ideas, build careers and grow
                bold new ventures.
              </p>
              <p>
                We are here to connect people across the region, open doors to opportunity, and help local talent and
                innovation flourish.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHAT TECH DERBY EXISTS TO DO ── */}
      <Section className="bg-slate-900 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-start md:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Our Purpose</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                  What Tech Derby exists to do
                </h2>
                <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
                <p className="mt-5 text-sm leading-relaxed text-white/65">
                  We are building a warm, practical and forward-looking tech ecosystem for Derby and the wider East
                  Midlands.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-1">
                {whatWeDo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-xl bg-white/5 px-5 py-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-[11px] font-black text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed text-white/85">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHO THIS COMMUNITY IS FOR ── */}
      <Section className="bg-slate-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Who We Serve</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              Who this community is for
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audience.map((person) => (
              <div
                key={person.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg">
                      {person.icon}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{person.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{person.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <Link to={person.cta.to}>
                    <Button
                      variant="ghost"
                      className="h-9 w-full rounded-full border border-slate-200 bg-transparent text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                    >
                      {person.cta.label}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── COMMUNITY PROOF ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 px-8 py-14 md:px-14 md:py-16">
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-500/10" />
              <div className="absolute -bottom-8 -left-4 h-32 w-32 rounded-full bg-sky-500/10" />
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Community Proof</p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-white md:text-3xl">
                  More than events. A community with momentum.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                  Tech Derby is growing as a space where conversations become collaborations, curiosity becomes
                  confidence, and local ambition finds a place to breathe.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Through events, partnerships, founder support and shared learning, we are helping shape a more
                  connected and visible tech ecosystem for Derby and the East Midlands.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link to="/get-involved">
                    <Button className="h-11 rounded-full px-7 text-sm shadow-lg shadow-orange-900/30">
                      Join the Community
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button
                      variant="ghost"
                      className="h-11 rounded-full border border-white/30 bg-transparent px-7 text-sm text-white hover:bg-white/10"
                    >
                      See Events
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── PROGRAMMES AND EXPERIENCES ── */}
      <Section className="bg-slate-50 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Programmes and Experiences</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              How people engage with Tech Derby
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {engagements.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.accent}`} />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                  <div className="mt-6">
                    <Link to={item.cta.to}>
                      <Button className="h-10 w-full rounded-full px-5 text-sm shadow-sm shadow-orange-900/20">
                        {item.cta.label}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── PARTNER SECTION ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">For Partners</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                  Built through collaboration
                </h2>
                <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-orange-500" />
              </div>
              <div className="space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Tech Derby believes strong ecosystems are built together. We work with partners across education,
                  business, community and innovation to support talent, spark ideas and widen access to opportunity.
                </p>
                <p>
                  Whether you want to support founders, connect with emerging talent, host conversations or shape the
                  future of regional tech, there is a place for you in this story.
                </p>
                <div className="pt-2">
                  <Link to="/partners">
                    <Button className="h-11 rounded-full px-7 text-sm shadow-lg shadow-orange-900/30">
                      Partner with Tech Derby
                    </Button>
                  </Link>
                </div>
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
              Join the people shaping Derby's next tech chapter
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Whether you are building a startup, exploring a career in tech, growing your network or looking to
              support the ecosystem, Tech Derby gives you a place to connect and move forward.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/get-involved">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Join the Community
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm text-white hover:bg-white/10"
                >
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
