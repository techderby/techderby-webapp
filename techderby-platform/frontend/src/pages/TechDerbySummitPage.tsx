import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

// ── Data ─────────────────────────────────────────────────────────────────────

const agendaItems = [
  {
    time: '09:00',
    title: 'Arrival, registration and networking',
    desc: 'Coffee, welcome desk and partner conversations',
  },
  {
    time: '09:30',
    title: 'Opening remarks',
    desc: 'Welcome to Tech Derby Summit 2026',
  },
  {
    time: '09:45',
    title: 'Keynote: AI, Startups and the Next Digital Economy',
    desc: 'A practical view of the opportunity ahead',
    highlight: true,
  },
  {
    time: '10:30',
    title: 'Panel: AI for business growth and productivity',
    desc: 'How organisations are using AI responsibly',
  },
  {
    time: '11:15',
    title: 'Founder spotlight',
    desc: 'Stories from startup builders and ecosystem leaders',
  },
  {
    time: '12:00',
    title: 'Networking and partner showcase',
    desc: 'Meet founders, educators, employers and investors',
  },
];

const themes = [
  {
    title: 'AI for Practical Impact',
    desc: 'Exploring how AI can create real value across business, work and society.',
    dot: 'bg-cyan-400',
  },
  {
    title: 'Startups and Entrepreneurship',
    desc: 'Spotlighting founders, venture growth and the support needed to build well.',
    dot: 'bg-blue-400',
  },
  {
    title: 'Local Talent and Future Skills',
    desc: 'Connecting learners, emerging talent and employers to meaningful opportunities.',
    dot: 'bg-teal-400',
  },
  {
    title: 'Responsible Innovation',
    desc: 'Championing leadership, trust, governance and inclusion in digital change.',
    dot: 'bg-indigo-400',
  },
];

const attendees = [
  'Startup founders and aspiring entrepreneurs',
  'Professionals in tech, product, digital and data',
  'Students, graduates and career changers',
  'Universities, educators and training providers',
  'Employers, partners, funders and ecosystem supporters',
  'Community leaders interested in access and inclusion',
];

const outcomes = [
  'That Derby has talent and ambition.',
  'That this summit is credible, modern and worth attending.',
  'That the event is part of a wider regional movement through East Mids Tech Week.',
  'That Tech Derby is convening community, innovation and opportunity in one place.',
];

const speakers = [
  {
    initials: 'KS',
    role: 'Keynote Speaker',
    area: 'AI, innovation and business leadership',
  },
  {
    initials: 'FS',
    role: 'Founder Speaker',
    area: 'Startup growth and venture building',
  },
  {
    initials: 'EL',
    role: 'Ecosystem Leader',
    area: 'Regional collaboration and future skills',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function TechDerbySummitPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby Summit 2026 | AI, Startups and the Next Digital Economy"
        description="A bold regional gathering for founders, professionals, students, educators, employers and ecosystem leaders shaping Derby's digital future. 15 June 2026, Derby."
      />

      {/* ── PAGE WRAPPER with gradient ── */}
      <div className="bg-[#060c18]">

        {/* ── HERO ── */}
        <section id="about" className="relative overflow-hidden py-0">
          {/* Background layers */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(6,182,212,0.22),transparent_52%),radial-gradient(ellipse_at_78%_25%,rgba(37,99,235,0.28),transparent_50%),radial-gradient(ellipse_at_55%_80%,rgba(249,115,22,0.18),transparent_45%)]" />
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />
          </div>

          <Container className="relative z-10 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              {/* East Mids Tech Week badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Part of East Mids Tech Week 2026
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl md:text-7xl">
                Tech Derby Summit 2026
              </h1>

              <p className="mt-3 text-xl font-semibold text-cyan-300 md:text-2xl">
                AI, Startups and the Next Digital Economy
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                A bold regional gathering for founders, professionals, students, educators,
                employers and ecosystem leaders shaping Derby's digital future.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/events/browse">
                  <Button className="h-12 rounded-full bg-cyan-500 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 hover:bg-cyan-400">
                    Register for the Summit
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Become a Partner
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Event date', value: '15 June 2026' },
                  { label: 'Location', value: 'Derby' },
                  { label: 'Core focus', value: 'Founders / AI' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="min-w-[130px] rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-left backdrop-blur-sm"
                  >
                    <p className="text-base font-bold text-white">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── CONFERENCE THEME FEATURE ── */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(249,115,22,0.14),transparent_55%)]" />
          <Container className="relative">
            <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">

              {/* Circular image */}
              <div className="flex justify-center">
                <div className="relative h-72 w-72 overflow-hidden rounded-full border border-white/10 shadow-2xl shadow-cyan-900/30 md:h-96 md:w-96">
                  <div className="h-full w-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-center text-sm font-medium text-white/40">Event photo</p>
                  </div>
                </div>
              </div>

              {/* Info cards */}
              <div className="flex flex-col gap-4">
                {/* Theme card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Conference Theme
                  </p>
                  <h2 className="mt-2 text-xl font-black text-white md:text-2xl">
                    AI, Startups and the Next Digital Economy
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Practical conversations on innovation, local talent, responsible leadership
                    and regional growth.
                  </p>
                </div>

                {/* Featured session card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Featured session
                      </p>
                      <p className="mt-1 text-base font-bold text-white">
                        AI for Business Growth and Productivity
                      </p>
                    </div>
                    <span className="mt-0.5 shrink-0 rounded-full bg-cyan-400/15 px-3 py-1 text-[11px] font-bold text-cyan-300">
                      Live panel
                    </span>
                  </div>
                </div>

                {/* Audience / Experience */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Audience
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Founders, students, employers and ecosystem partners
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Experience
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Keynotes, panels, networking and collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── ABOUT ── */}
        <section className="relative py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                About the Summit
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
                A conference rooted in Derby, connected to the wider East Midlands
              </h2>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-white/70 md:text-base">
                  Tech Derby Summit 2026 is a meeting point for ideas, ambition and practical
                  action. It brings together those building startups, shaping talent, driving
                  digital transformation and opening doors for others. As part of East Mids Tech
                  Week, the summit places Derby within a wider regional story of innovation,
                  connectivity and future-facing growth.
                </p>
              </div>

              {/* Theme cards 2×2 */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {themes.map((theme) => (
                  <div
                    key={theme.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${theme.dot}`} />
                    <div>
                      <p className="font-bold text-white">{theme.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{theme.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── AGENDA ── */}
        <section id="agenda" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(249,115,22,0.12),transparent_55%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-5xl">
              {/* Kicker + view all in same row */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Agenda Preview
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                    A day of insight, connection and momentum
                  </h2>
                </div>
                <button className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
                  View full agenda
                </button>
              </div>

              {/* Timeline */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                {agendaItems.map((item, i) => (
                  <div
                    key={item.time}
                    className={`flex items-start gap-5 px-6 py-5 ${
                      i < agendaItems.length - 1 ? 'border-b border-white/8' : ''
                    } ${item.highlight ? 'bg-white/[3%]' : ''}`}
                  >
                    <span className="w-14 shrink-0 text-base font-black text-cyan-400">
                      {item.time}
                    </span>
                    <div>
                      <p className={`font-bold text-white ${item.highlight ? 'text-base' : 'text-sm'}`}>
                        {item.title}
                      </p>
                      <p className={`mt-0.5 text-sm ${item.highlight ? 'text-cyan-200/70' : 'text-white/50'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── WHO SHOULD ATTEND ── */}
        <section className="relative py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Who Should Attend
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-4xl">
                Built for builders, learners, partners and leaders
              </h2>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {/* Attendee list */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <ul className="space-y-3">
                    {attendees.map((a) => (
                      <li key={a} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                        <span className="text-sm text-white/80">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conference outcomes */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Conference Outcomes
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">
                    What this summit should make visitors feel
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {outcomes.map((o) => (
                      <li key={o} className="text-sm leading-relaxed text-cyan-200/70">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── SPEAKERS ── */}
        <section id="speakers" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(249,115,22,0.12),transparent_55%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Speakers
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Featured voices and future-facing conversations
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {speakers.map((s) => (
                  <div
                    key={s.initials}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                  >
                    {/* Avatar */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-black text-white shadow-lg shadow-cyan-900/40">
                      {s.initials}
                    </div>
                    <p className="mt-4 text-base font-bold text-white">{s.role}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{s.area}</p>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-400/70">
                      Photo + Bio Placeholder
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── PARTNERS & SPONSORS ── */}
        <section id="partners" className="relative py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Partners and Sponsors
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Support the summit. Shape the ecosystem.
              </h2>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="grid gap-0 md:grid-cols-2">
                  {/* Left: description + buttons */}
                  <div className="p-6 md:p-8">
                    <p className="text-sm leading-relaxed text-white/70">
                      Align your organisation with a growing regional platform focused on
                      founders, digital talent, responsible innovation and long-term ecosystem
                      building.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to="/contact">
                        <Button className="h-10 rounded-full bg-cyan-500 px-6 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                          Become a Partner
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button
                          variant="ghost"
                          className="h-10 rounded-full border border-white/30 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Sponsorship Pack
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right: logo placeholder grid */}
                  <div className="border-t border-white/8 p-6 md:border-l md:border-t-0 md:p-8">
                    <div className="grid grid-cols-2 gap-3">
                      {['Partner logo', 'Sponsor logo', 'University', 'Community'].map(
                        (label) => (
                          <div
                            key={label}
                            className="flex h-20 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                          >
                            <span className="text-xs font-medium text-white/35">{label}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Transition to teal gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060c18] via-[#062a2e] to-[#083d3f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.25),transparent_60%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Final Call to Action
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
                Join the conversation shaping Derby's next digital chapter
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
                Come to learn, connect and contribute. Be part of a summit that gathers the
                people, ideas and partnerships shaping the next digital economy.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/events/browse">
                  <Button className="h-12 rounded-full bg-cyan-500 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 hover:bg-cyan-400">
                    Register Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Partnership
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </div>
    </>
  );
}
