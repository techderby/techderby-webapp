import type { ReactNode } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const safeguardingPrinciples = [
  'Put the safety and wellbeing of people first.',
  'Take concerns seriously and act promptly.',
  'Respect dignity, privacy, and confidentiality.',
  'Escalate urgent risk to emergency services immediately.',
  'Learn and improve safeguarding practice continuously.',
];

const reportWays = [
  'Speak to an organiser at the event.',
  'Email: hello@techderby.org with subject line "Safeguarding Concern".',
  'For immediate danger, call emergency services (999 in the UK).',
];

const responseSteps = [
  'Acknowledge and document the concern.',
  'Assess immediate risk and protect affected persons.',
  'Escalate to designated safeguarding leads where required.',
  'Take proportionate action and record decisions.',
  'Follow up and communicate next steps appropriately.',
];

function SafeguardingCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </article>
  );
}

export default function SafeguardingPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Safeguarding"
        description="Tech Derby safeguarding principles, reporting channels, and response process for community safety."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(249,115,22,0.22),transparent_40%),radial-gradient(circle_at_82%_78%,rgba(56,189,248,0.22),transparent_35%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">Community Safety</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">Safeguarding</h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
              Tech Derby is committed to creating safe spaces for learning, networking, and participation. Safeguarding is a
              shared responsibility across organisers, volunteers, speakers, and attendees.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            <SafeguardingCard title="1. Safeguarding Principles">
              <ul className="list-disc space-y-1 pl-5">
                {safeguardingPrinciples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SafeguardingCard>

            <SafeguardingCard title="2. Reporting a Concern">
              <p>If something feels unsafe, uncomfortable, or inappropriate, please report it as soon as possible.</p>
              <ul className="list-disc space-y-1 pl-5">
                {reportWays.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SafeguardingCard>

            <SafeguardingCard title="3. How We Respond">
              <ul className="list-disc space-y-1 pl-5">
                {responseSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                We handle reports with care and only share details with those who need to know in order to respond and
                protect people.
              </p>
            </SafeguardingCard>

            <SafeguardingCard title="4. Scope">
              <p>
                This safeguarding approach applies to Tech Derby events, workshops, programmes, online channels, and
                community spaces where Tech Derby is hosting or co-hosting activity.
              </p>
            </SafeguardingCard>

            <SafeguardingCard title="5. Contact">
              <p>
                For safeguarding questions or non-urgent concerns, contact:{' '}
                <a href="mailto:hello@techderby.org" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  hello@techderby.org
                </a>
              </p>
            </SafeguardingCard>
          </div>
        </Container>
      </Section>
    </>
  );
}
