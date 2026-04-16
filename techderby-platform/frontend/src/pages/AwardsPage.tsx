import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

// ─────────────────────── data ─────────────────────────────────────────────────

const CATEGORIES = [
  {
    number: '01',
    title: 'Startup of the Year',
    icon: '🚀',
    summary: 'Recognising an early-stage startup showing strong promise, traction, innovation or growth potential.',
    criteria: [
      'Strength of the problem being solved',
      'Originality of the solution',
      'Evidence of demand, traction or customer interest',
      'Progress made within available resources',
      'Future potential and clarity of direction',
    ],
  },
  {
    number: '02',
    title: 'Founder of the Year',
    icon: '🏗️',
    summary: 'Celebrating a founder whose leadership, vision and resilience stand out.',
    criteria: [
      'Quality of leadership',
      'Strength of vision and execution',
      'Resilience and consistency',
      'Ability to attract support, trust or traction',
      'Contribution to the wider ecosystem, not just personal success',
    ],
  },
  {
    number: '03',
    title: 'Emerging Talent Award',
    icon: '⭐',
    summary: 'Honouring a student, graduate, apprentice or early-career professional showing exceptional promise.',
    criteria: [
      'Quality of work, projects or initiative shown',
      'Commitment to learning and growth',
      'Creativity, problem-solving or leadership potential',
      'Contribution to peers, teams or community',
      'Evidence that this person is one to watch',
    ],
  },
  {
    number: '04',
    title: 'Digital Innovation Award',
    icon: '⚡',
    summary: 'Recognising an organisation or team using digital technology to create practical and meaningful change.',
    criteria: [
      'Clarity of the challenge addressed',
      'Usefulness and originality of the digital solution',
      'Measurable improvement or impact',
      'Adoption, implementation or engagement',
      'Sustainability and scalability of the innovation',
    ],
  },
  {
    number: '05',
    title: 'Community Impact in Tech Award',
    icon: '🤝',
    summary: 'Recognising an individual, programme or organisation using tech to widen opportunity, improve inclusion or strengthen communities.',
    criteria: [
      'Impact on underrepresented or underserved groups',
      'Contribution to access, confidence or participation',
      'Evidence of inclusion and community benefit',
      'Partnerships or grassroots reach',
      'Long-term value beyond a one-off activity',
    ],
  },
  {
    number: '06',
    title: 'Tech for Good Award',
    icon: '🌱',
    summary: 'Celebrating a product, service, programme or initiative using technology to improve lives.',
    criteria: [
      'Social value created',
      'Clarity of the need being addressed',
      'Evidence of positive outcomes',
      'Thoughtful and appropriate use of technology',
      'Potential for broader adoption or lasting benefit',
    ],
  },
  {
    number: '07',
    title: 'Ecosystem Partner Award',
    icon: '🔗',
    summary: "Recognising the organisations, institutions, partners or enablers helping Derby's digital landscape grow stronger.",
    criteria: [
      'Visible support for talent, founders or innovation',
      'Collaboration and partnership-building',
      'Consistency of contribution over time',
      'Strategic value added to the local ecosystem',
      'Commitment to shared success, not just organisational profile',
    ],
  },
  {
    number: '08',
    title: 'Responsible AI & Digital Leadership',
    icon: '🛡️',
    summary: 'Recognising an individual or organisation demonstrating thoughtful, responsible and trustworthy leadership in digital transformation or AI.',
    criteria: [
      'Ethical and responsible use of digital tools or AI',
      'Leadership in policy, governance or implementation',
      'Efforts to build trust and reduce harm',
      'Clear communication and accountability',
      'Balancing innovation with responsibility',
    ],
  },
  {
    number: '09',
    title: 'Women in Tech Leadership Award',
    icon: '💜',
    summary: 'Celebrating a woman who is building, leading, mentoring or making a notable contribution in technology or digital innovation.',
    criteria: [
      'Leadership and influence',
      'Quality of contribution to tech or innovation',
      'Mentorship, advocacy or representation',
      'Barriers overcome',
      'Role-model value for others coming behind',
    ],
  },
  {
    number: '10',
    title: 'Outstanding Contribution to Tech Derby',
    icon: '🏆',
    summary: 'Special recognition for an individual or organisation whose contribution has played a meaningful role in strengthening the Tech Derby journey.',
    criteria: [
      'Depth and consistency of contribution',
      'Influence on the community or ecosystem',
      'Generosity, leadership or service',
      'Role in opening doors for others',
      "Lasting impact on Derby's digital story",
    ],
  },
];

const JUDGE_BENEFITS = [
  { icon: '🏅', text: 'Recognise outstanding innovation and impact' },
  { icon: '🤝', text: 'Connect with founders, professionals and ecosystem leaders' },
  { icon: '💡', text: 'Share your expertise and influence the next generation of talent' },
  { icon: '📣', text: 'Gain visibility as a thought leader within the TechDerby community' },
  { icon: '🎤', text: 'Be featured across TechDerby platforms and at the awards event' },
];

const JUDGE_WHO = [
  'Technology and digital innovation',
  'Startups and entrepreneurship',
  'Artificial Intelligence, Cyber Security, or emerging technologies',
  'Business leadership, investment, or product development',
  'Community building and ecosystem development',
];

const FAQS = [
  {
    q: 'Can I nominate myself?',
    a: 'Yes. Self-nominations are welcome. If you are doing meaningful work, do not be shy about putting your name forward.',
  },
  {
    q: 'Can I nominate more than one person or organisation?',
    a: 'Yes. You may submit multiple nominations, provided each one is relevant and complete.',
  },
  {
    q: 'Can one nominee be entered into more than one category?',
    a: 'Yes, where appropriate. However, please make sure the nomination clearly explains why the nominee fits each category.',
  },
  {
    q: 'Do nominees need to be based in Derby?',
    a: 'Not necessarily, but they should have a clear connection to Derby or be contributing meaningfully to the wider East Midlands tech and innovation ecosystem.',
  },
  {
    q: 'What kind of evidence should I provide?',
    a: 'Anything that helps the judges understand the work and its impact — outcomes, metrics, links, testimonials, project summaries, media mentions or examples of delivery.',
  },
  {
    q: 'Are these awards only for traditional tech companies?',
    a: 'No. We welcome nominations from startups, schools, community organisations, public sector teams, universities, nonprofits and businesses using technology in meaningful ways.',
  },
  {
    q: 'When will winners be announced?',
    a: 'Winners will be announced at the Tech Derby Conference Awards segment. Important dates will be published here once confirmed.',
  },
];

const IMPORTANT_DATES = [
  { label: 'Nominations Open', value: '17th April 2026' },
  { label: 'Nomination Deadline', value: '16th May 2026' },
  { label: 'Shortlist Announced', value: '31st May 2026' },
  { label: 'Awards Ceremony', value: '15th June 2026' },
  { label: 'Venue', value: 'TBC' },
];

// ─────────────────────── small components ────────────────────────────────────

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/15">
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m2 6 3 3 5-5" />
        </svg>
      </span>
      <span className="text-slate-600 leading-snug">{children}</span>
    </li>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-600 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 mx-auto max-w-2xl text-base text-slate-500 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

// ─────────────────────── main page ───────────────────────────────────────────

export default function AwardsPage() {
  return (
    <>
      <PageSeo
        title="TechDerby Digital Excellence Awards 2026"
        description="Celebrating the founders, professionals, students, educators and community leaders helping shape Derby and the wider East Midlands through technology, innovation and inclusive growth."
      />

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(249,115,22,0.22),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_60%_80%,rgba(14,165,233,0.12),transparent_50%)]" />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,1) 40px,rgba(255,255,255,1) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,1) 40px,rgba(255,255,255,1) 41px)' }} />
        </div>
        <Container className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 backdrop-blur-sm mb-6">
              🏆 TechDerby Digital Excellence Awards 2026
            </span>
            <h1 className="text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl">
              Celebrating the people building{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Derby's digital future
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base text-white/70 leading-relaxed md:text-lg">
              At Tech Derby, we believe strong tech ecosystems are not built by accident. They are built by people — people who create, teach, mentor, experiment, launch, support, invest, open doors and keep showing up.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/awards/nominate"
                className="inline-flex h-13 items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600 hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Nominate Now
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/awards/judge"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/25 bg-white/8 px-8 py-3.5 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Apply to Judge
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </Link>
            </div>

            {/* ── Key dates bar ── */}
            <div className="mt-14 mx-auto max-w-4xl grid grid-cols-2 gap-px rounded-2xl bg-white/[0.08] overflow-hidden sm:grid-cols-3 md:grid-cols-5">
              {IMPORTANT_DATES.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1 bg-white/[0.04] px-4 py-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
                  <span className="text-sm font-bold text-white/90 leading-tight">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          WHY THE AWARDS MATTER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-24">
        <Container className="max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-600 mb-4">
                Why it matters
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight mb-5">
                Why the Tech Derby Awards matter
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Derby has always been a city of engineers, makers and practical problem-solvers. Tech Derby carries that spirit into the digital age. The awards reflect that same spirit: practical innovation, local pride, collaboration and visible recognition for those making a real contribution.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Too often, meaningful work in tech happens quietly. A founder builds without applause. A tech facilitator inspires future innovators behind the scenes. A student goes beyond what was expected. The Tech Derby Awards are here to make those stories visible.
              </p>
              <p className="text-sm font-semibold text-slate-700">
                We want to celebrate achievement — but also courage, consistency, contribution and community-minded leadership.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: '🏙️', text: 'A founder builds without applause.' },
                { icon: '🎓', text: 'A tech facilitator inspires future innovators behind the scenes.' },
                { icon: '🙋', text: 'A student goes beyond what was expected.' },
                { icon: '🤝', text: 'A company invests in people, not just platforms.' },
                { icon: '🚪', text: 'A community programme opens a path that did not exist before.' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4">
                  <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{icon}</span>
                  <p className="text-sm text-slate-700 leading-snug font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          NOMINATIONS OPEN
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 md:py-24">
        <Container className="max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-400 mb-4">
              Nominations open
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight mb-4">
              Who can you nominate?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
              Nominations are open to individuals and organisations with a clear connection to Derby or the wider East Midlands tech and innovation landscape.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {[
              { icon: '🚀', label: 'Startups and founders' },
              { icon: '💻', label: 'Developers, designers and digital professionals' },
              { icon: '🏢', label: 'Innovation teams within larger organisations' },
              { icon: '🌍', label: 'Community organisations and non-profits' },
              { icon: '🧭', label: 'Mentors, sponsors and ecosystem enablers' },
              { icon: '🏛️', label: 'Public, private and voluntary sector organisations' },
              { icon: '🙋', label: "Yourself — if you're doing meaningful work" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <span className="text-sm text-white/80 font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/awards/nominate"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Submit a nomination
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHAT JUDGES LOOK FOR
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 md:py-24">
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="Judging criteria"
            title="What the judges will be looking for"
            subtitle="Strong nominations usually include a clear story, real evidence and a sense of why the work matters."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: '💡', text: 'Innovation and originality' },
              { icon: '📊', text: 'Measurable impact or promising early traction' },
              { icon: '🌱', text: 'Contribution to local talent, opportunity or economic growth' },
              { icon: '💪', text: 'Leadership and resilience' },
              { icon: '🚪', text: 'Inclusion, accessibility and community value' },
              { icon: '🔧', text: 'Practical use of technology to solve real problems' },
              { icon: '🛡️', text: 'Responsible, ethical and forward-looking digital leadership' },
              { icon: '🔗', text: 'Evidence of collaboration and ecosystem-building' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <span className="text-sm font-medium text-slate-700">{text}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500 italic">
            We are not only looking for polished success stories. We are also looking for substance — real contribution, clear intent and meaningful progress.
          </p>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          AWARD CATEGORIES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <Container className="max-w-6xl">
          <SectionHeading
            eyebrow="Award Categories"
            title="10 categories. One community."
            subtitle="Each category recognises a different dimension of excellence in Derby's tech ecosystem."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.number}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg border border-orange-100">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-orange-400">{cat.number}</span>
                </div>
                <h3 className="mb-2 text-base font-extrabold text-slate-900 leading-snug">{cat.title}</h3>
                <p className="mb-4 text-sm text-slate-500 leading-relaxed flex-1">{cat.summary}</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Judges will consider</p>
                  <ul className="space-y-1.5">
                    {cat.criteria?.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                        <span className="text-xs text-slate-500 leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW TO NOMINATE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 md:py-24">
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="How to nominate"
            title="What makes a strong nomination"
            subtitle="Submitting a nomination should be simple, thoughtful and evidence-based."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                step: '1',
                title: 'Basic details',
                items: ['Nominee name', 'Organisation name, where relevant', 'Award category', 'Contact details for the nominee or nominator'],
              },
              {
                step: '2',
                title: 'Nomination summary',
                items: ['A short introduction to the nominee', 'Why they deserve recognition', 'Their connection to Derby or the East Midlands'],
              },
              {
                step: '3',
                title: 'Supporting statement',
                items: ['What the nominee did', 'Why it matters', 'What changed as a result', 'Why they stand out in this category'],
              },
              {
                step: '4',
                title: 'Evidence or examples',
                items: ['Outcomes, numbers or milestones', 'Testimonials or endorsements', 'Links to websites, reports or media', 'Examples of products, programmes or delivery'],
              },
            ].map(({ step, title, items }) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-sm font-black text-white shadow-md shadow-orange-500/20">
                    {step}
                  </div>
                  <h3 className="font-extrabold text-slate-900">{title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => <Bullet key={item}>{item}</Bullet>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <p className="text-sm font-bold text-orange-800 mb-2">Nomination guidance</p>
            <p className="text-sm text-orange-700 leading-relaxed">
              A strong nomination does not need to be long for the sake of length — it needs to be clear. Use simple, direct language. Tell a real story. Include evidence where possible. Show why the work matters now. <strong className="text-orange-900">Do not assume the judges already know the nominee. Write as though you are introducing someone remarkable for the first time.</strong>
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/awards/nominate"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Submit a nomination
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          JUDGING PROCESS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-24">
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="Judging process"
            title="How nominations are assessed"
            subtitle="All eligible nominations will be reviewed by an independent judging panel made up of leaders from across technology, business, education, innovation and community development."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {[
              'Relevance to the chosen category',
              'Quality and clarity of the nomination',
              'Evidence of impact, progress or contribution',
              'Alignment with the values of Tech Derby',
              'Significance of the work in Derby and the wider East Midlands',
              "The judges' decision will be final",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m2 6 3 3 5-5" />
                  </svg>
                </span>
                <span className="text-sm text-slate-600 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BECOME A JUDGE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 md:py-28">
        <Container className="max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-300 mb-4">
              ⚖️ Apply to be a judge
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight mb-4">
              Become a TechDerby Awards Judge
            </h2>
            <p className="mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
              Are you passionate about innovation, entrepreneurship, and supporting the growth of the tech ecosystem? TechDerby is inviting experienced professionals, industry leaders, and ecosystem builders to join our Judging Panel.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            {/* Why become a judge */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
              <h3 className="text-base font-extrabold text-white mb-5">Why become a judge?</h3>
              <ul className="space-y-3">
                {JUDGE_BENEFITS.map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <span className="text-sm text-white/70 leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who should apply */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
              <h3 className="text-base font-extrabold text-white mb-5">Who should apply?</h3>
              <p className="text-sm text-white/60 mb-4">We are looking for individuals with experience in:</p>
              <ul className="space-y-2.5 mb-5">
                {JUDGE_WHO.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" aria-hidden="true" />
                    <span className="text-sm text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-indigo-300 leading-relaxed">
                We especially encourage applications from individuals passionate about supporting diversity and inclusion in tech, particularly women and underrepresented groups.
              </p>
            </div>
          </div>

          {/* Role & commitment */}
          <div className="grid gap-6 sm:grid-cols-3 mb-12">
            {[
              {
                title: 'Role of a Judge',
                items: ['Review and assess nominations within assigned categories', 'Score entries based on defined criteria', 'Participate in shortlisting discussions if required', 'Maintain confidentiality and fairness throughout'],
              },
              {
                title: 'Time Commitment',
                items: ['Review period: approx. 2–3 weeks', 'Estimated time: 3–5 hours total', 'Optional participation in the awards event', 'Fully remote-friendly process'],
              },
              {
                title: 'What you gain',
                items: ['Recognition as a TechDerby judge', 'Featured on TechDerby platforms', 'Connect with the regional tech ecosystem', 'Shape who gets recognised in the community'],
              },
            ].map(({ title, items }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-sm font-extrabold text-white mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                      <span className="text-xs text-white/60 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/awards/judge"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Apply to become a judge
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 md:py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
          />
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group px-6 py-5">
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-sm font-bold text-slate-900 marker:hidden list-none">
                  <span>{q}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-slate-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.18),transparent_60%)]" />
        <Container className="relative z-10 max-w-3xl text-center">
          <p className="text-3xl font-black text-white sm:text-4xl leading-tight mb-5">
            Know someone making a difference in tech, innovation or digital impact?
          </p>
          <p className="mx-auto max-w-xl text-base text-white/60 leading-relaxed mb-4">
            Now is the time to recognise them. Whether they are building a startup, shaping talent, transforming an organisation, creating opportunities for others or strengthening the wider ecosystem, the Tech Derby Awards are here to honour their contribution.
          </p>
          <p className="text-sm font-semibold text-orange-400 mb-10">
            Submit a nomination today and help us celebrate the people shaping Derby's next digital chapter.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/awards/nominate"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Nominate Now
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/awards/judge"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/8 px-8 py-3.5 text-sm font-bold text-white/90 transition hover:border-white/40 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Apply to Judge
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
