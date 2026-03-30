import type { ReactNode } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const positiveBehaviours = [
  'Be respectful, inclusive, and constructive in all interactions.',
  'Listen actively, especially when someone shares a different perspective.',
  'Give and receive feedback with empathy and professionalism.',
  'Support newcomers and help create a welcoming learning environment.',
  'Ask for consent before taking close-up photos, recordings, or direct quotes.',
];

const unacceptableBehaviours = [
  'Harassment, intimidation, discrimination, or hateful language.',
  'Unwanted sexual attention, inappropriate comments, or persistent unwelcome contact.',
  'Deliberate disruption of talks, workshops, networking, or online discussions.',
  'Doxxing, stalking, threats, or sharing private information without consent.',
  'Retaliation against anyone who reports a concern in good faith.',
];

const reportingChannels = [
  'Speak to a Tech Derby organiser at the event.',
  'Email: hello@techderby.org with subject line "Code of Conduct Report".',
  'If immediate safety is at risk, call emergency services (999 in the UK).',
];

const enforcementOutcomes = [
  'Verbal warning and clarification of expected behaviour.',
  'Removal from a session or event without refund (where applicable).',
  'Temporary or permanent suspension from Tech Derby channels and events.',
  'Escalation to venue partners, employers, or authorities when required by risk.',
];

function ConductCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </article>
  );
}

export default function CodeOfConductPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Code of Conduct"
        description="Our shared standards for creating a safe, inclusive, and respectful tech community at Tech Derby."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(14,165,233,0.28),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(249,115,22,0.2),transparent_35%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Community Standards</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">Tech Derby Code of Conduct</h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
              Tech Derby is committed to a safe, inclusive, and respectful environment for everyone across events,
              programmes, online spaces, and community channels.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            <ConductCard title="1. Purpose and Scope">
              <p>
                This Code of Conduct applies to all participants, including attendees, speakers, volunteers, sponsors,
                organisers, staff, and partners.
              </p>
              <p>
                It covers in-person events, workshops, social activities, online discussions, direct messages, and any
                Tech Derby-branded communication spaces.
              </p>
            </ConductCard>

            <ConductCard title="2. Expected Behaviour">
              <ul className="list-disc space-y-1 pl-5">
                {positiveBehaviours.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ConductCard>

            <ConductCard title="3. Unacceptable Behaviour">
              <ul className="list-disc space-y-1 pl-5">
                {unacceptableBehaviours.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ConductCard>

            <ConductCard title="4. Reporting a Concern">
              <p>We encourage prompt reporting so we can act quickly and appropriately.</p>
              <ul className="list-disc space-y-1 pl-5">
                {reportingChannels.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                We will handle reports confidentially where possible and share details only with those who need to know in
                order to assess and respond.
              </p>
            </ConductCard>

            <ConductCard title="5. Response and Enforcement">
              <p>Organisers may take any action they deem appropriate to maintain safety and trust, including:</p>
              <ul className="list-disc space-y-1 pl-5">
                {enforcementOutcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Decisions are based on context, impact, prior behaviour, and risk to individuals or the wider community.
              </p>
            </ConductCard>

            <ConductCard title="6. Accessibility and Inclusion">
              <p>
                We strive to make events accessible and welcoming. If you need adjustments to participate, contact us ahead
                of time at{' '}
                <a href="mailto:hello@techderby.org" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  hello@techderby.org
                </a>
                .
              </p>
              <p>
                We ask participants to use inclusive language, avoid assumptions about others, and help us reduce barriers
                for first-time attendees.
              </p>
            </ConductCard>

            <ConductCard title="7. Good Faith and Non-Retaliation">
              <p>
                Tech Derby will not tolerate retaliation against anyone who reports concerns or participates in an
                investigation in good faith.
              </p>
              <p>
                Malicious or knowingly false reports may be addressed through this same Code of Conduct process.
              </p>
            </ConductCard>

            <ConductCard title="8. Policy Updates">
              <p>
                This Code of Conduct may be updated periodically to reflect community learning, legal obligations, and best
                practice for tech community platforms.
              </p>
            </ConductCard>
          </div>
        </Container>
      </Section>
    </>
  );
}
