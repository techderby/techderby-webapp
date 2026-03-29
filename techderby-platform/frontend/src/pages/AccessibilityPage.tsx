import type { ReactNode } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const commitments = [
  'Clear structure with headings, labels, and consistent navigation.',
  'Keyboard-friendly interaction for core website journeys.',
  'Colour contrast choices to improve readability.',
  'Alternative text for meaningful visual content where available.',
  'Responsive layouts that work across mobile and desktop.',
];

const supportOptions = [
  'Request information in an alternative format.',
  'Report an accessibility issue or barrier.',
  'Share feedback on event accessibility needs (venue, mobility, sensory, communication).',
];

const ongoingWork = [
  'Periodic checks of page structure and keyboard navigation.',
  'Review of new content and forms before publication.',
  'Continuous improvements based on member feedback.',
];

function AccessibilityCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </article>
  );
}

export default function AccessibilityPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Accessibility"
        description="Accessibility statement for Tech Derby website and events, including support options and contact channels."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.24),transparent_40%),radial-gradient(circle_at_84%_78%,rgba(14,165,233,0.2),transparent_35%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Inclusive Access</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">Accessibility Statement</h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
              Tech Derby is committed to making our digital and event experiences inclusive, practical, and easy to use for
              as many people as possible.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            <AccessibilityCard title="1. Our Accessibility Commitment">
              <ul className="list-disc space-y-1 pl-5">
                {commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AccessibilityCard>

            <AccessibilityCard title="2. Event Accessibility">
              <p>
                We aim to work with venues and partners that support inclusive participation. If you need adjustments for a
                meetup, workshop, or programme, please contact us in advance so we can help.
              </p>
              <p>
                We encourage early requests for access support, including mobility, seating, communication preferences, and
                other practical arrangements.
              </p>
            </AccessibilityCard>

            <AccessibilityCard title="3. Need Support or Want to Report an Issue?">
              <ul className="list-disc space-y-1 pl-5">
                {supportOptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Contact:{' '}
                <a href="mailto:hello@techderby.org" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  hello@techderby.org
                </a>
              </p>
            </AccessibilityCard>

            <AccessibilityCard title="4. Continuous Improvement">
              <ul className="list-disc space-y-1 pl-5">
                {ongoingWork.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                This statement is reviewed and updated as Tech Derby evolves and new accessibility priorities are identified.
              </p>
            </AccessibilityCard>
          </div>
        </Container>
      </Section>
    </>
  );
}
