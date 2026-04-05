import { MemberCard } from '../components/MemberCard';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const sampleMembers = [
  {
    id: 1,
    name: 'Aisha Walker',
    role: 'Frontend Engineer',
    bio: 'Building accessible web products and mentoring early-career developers.',
    skills: ['React', 'TypeScript', 'Accessibility'],
    interests: ['Community', 'Open Source'],
    linkedin: 'https://www.linkedin.com/in/aisha-walker',
  },
  {
    id: 2,
    name: 'Harvey Singh',
    role: 'Data Analyst',
    bio: 'Working on civic data insights and workshop facilitation.',
    skills: ['Python', 'SQL', 'Data Viz'],
    interests: ['Education', 'Civic Tech'],
    linkedin: 'https://www.linkedin.com/in/harvey-singh',
  },
];

export default function MemberDirectoryPage() {
  return (
    <>
      <PageSeo title="Tech Derby | Directory" description="Browse members in the Tech Derby community directory." />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Community Network
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Member
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                directory.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Browse members in the Tech Derby community. Connect with developers, designers, founders, and tech
              professionals across the East Midlands.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── DIRECTORY ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our People</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Community members</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sampleMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-6 text-center md:p-8">
              <p className="text-sm leading-relaxed text-slate-700">
                <span className="font-bold text-sky-800">Directory is growing:</span> More member profiles will be added as
                the membership platform launches. Join Tech Derby to be listed here.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
