import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const values = [
  {
    title: 'Practical over performative',
    description: 'We focus on useful skills, projects, honest conversations, and outcomes people can apply immediately.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M7 12.5 10.2 16 17 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Open doors',
    description: 'We welcome new voices and underrepresented talents — students, founders, career changers, employers, and anyone curious about tech.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Local pride',
    description: "We build on Derby's strengths and invest back into the city. Everything we do is rooted in Derby and designed to strengthen the East Midlands tech ecosystem.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 21s-6.5-4.6-6.5-10a4.5 4.5 0 0 1 8.6-1.9A4.5 4.5 0 0 1 18.5 11c0 5.4-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Respect and safety',
    description: 'We run inclusive events with clear standards of conduct and create spaces where people can share ideas confidently and feel supported.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.4 3 8.5 7 10 4-1.5 7-5.6 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const whatWeDo = [
  {
    title: 'Monthly meetups',
    detail: 'Speakers, panels, and lightning talks that turn ideas into practical learning.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4 7h16M7 3v4m10-4v4M6 11h12M6 15h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Partnership-building',
    detail: 'Connecting industry, academia, and community to create stronger local outcomes.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M8.5 14 5 10.5l3.5-3.5M15.5 7 19 10.5 15.5 14M13 6l-2 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Pathways into tech',
    detail: 'Internships, trainings, projects, mentoring, and introductions that reduce barriers.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Showcasing local talent',
    detail: "Amplifying founders, students, and employers who are shaping Derby's digital future.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 3 14.7 8.5 21 9.3l-4.6 4.3 1.2 6.1L12 16.9 6.4 19.7l1.2-6.1L3 9.3l6.3-.8L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <PageSeo
        title="About Tech Derby | Community-Led Tech Network in Derby"
        description="Tech Derby is a community-led network strengthening Derby's tech skills, careers, and innovation through practical events and partnerships."
        keywords="tech meetup derby, coding community derby, east midlands tech community"
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              About Our Community
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Building Derby's tech
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                future, together.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Tech Derby is a community-led network that brings people and organisations together to strengthen the city's
              tech skills, careers, and innovation. We run friendly, practical meetups where students, professionals,
              founders, employers, and educators can learn from each other and build real connections.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── MISSION & VISION ── */}
      <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2">
              <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-sky-700 group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our Mission</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Purpose-driven growth</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  To grow a practical, people-centred tech ecosystem in Derby where talent is nurtured, opportunity is
                  shared, and innovation serves the city.
                </p>
              </article>

              <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-sky-700 group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our Vision</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">National recognition</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  A future where Derby is recognised nationally as a centre of tech excellence, innovation, and opportunity.
                </p>
              </article>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── VALUES ── */}
      <Section className="border-b border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">What We Stand For</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Our Values</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">The principles that guide everything we do.</p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <article key={value.title} className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-sky-700 group-hover:text-white">
                    {value.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHAT WE DO ── */}
      <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our Programmes</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">What we do</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Community programmes designed to help people learn, connect, and access real opportunities in tech.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {whatWeDo.map((item, index) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-sky-700 group-hover:text-white">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">0{index + 1}</p>
                      <h3 className="mt-1 text-xl font-black text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-center md:p-8">
              <p className="text-base leading-relaxed text-white/90 md:text-lg">
                We build a bridge between community energy and career opportunity —
                <span className="font-bold text-sky-400"> so local talent can thrive in Derby.</span>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── CTA ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Be Part Of It</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Want to get involved?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80">
              Tech Derby works because people show up, share, and support each other. Whether you are joining as a member,
              volunteering, speaking, or partnering — there is a place for you here.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/get-involved">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Get Involved
                </Button>
              </Link>
              <Link
                to="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
              >
                Contact Us
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
