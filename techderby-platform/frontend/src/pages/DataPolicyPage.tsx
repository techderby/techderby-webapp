import type { ReactNode } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const retentionRows = [
  { dataType: 'Event attendance records', period: '2 years' },
  { dataType: 'Members contact details', period: '2 years after last engagement' },
  { dataType: 'Volunteer data', period: '6 years after leaving' },
  { dataType: 'Partner data', period: '6 years after last engagement' },
  { dataType: 'Sponsorship contracts', period: '6 years' },
  { dataType: 'Active mailing-list subscribers', period: 'While subscribed or until 24 months inactivity' },
  { dataType: 'Unsubscribe suppression records and feedback', period: 'Only as long as needed to respect the opt-out, demonstrate compliance, and analyse communications; reviewed periodically' },
  { dataType: 'Financial transaction records', period: '6 years' },
];

const secureDisposal = [
  'Deleted from cloud platforms',
  'Removed from mailing systems',
  'Permanently erased from shared drives',
  'Paper copies shredded (if any)',
];

const breachExamples = [
  'Loss or theft of devices containing personal data',
  'Unauthorised access to mailing lists',
  'Accidental email disclosure',
  'Hacking incidents',
  'Data sent to the wrong recipient',
];

const immediateActions = [
  'Inform the Data Protection Officer (DPO) immediately.',
  'Contain the breach (e.g., revoke access, change passwords).',
  'Document what happened, what data was involved, number of individuals affected, and potential risks.',
];

const riskAssessment = ['Nature of data involved', 'Sensitivity', 'Likelihood of harm', "Risk to individuals' rights and freedoms"];

const breachRegister = ['Date', 'Description', 'Impact', 'Actions taken', 'Outcome'];

const recommendations = [
  'MFA on all admin accounts',
  'Access control reviews every 3 months',
  'Password manager use',
  'No shared generic login accounts',
  'Secure cloud storage permissions',
  'Backup procedures',
];

function DataCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </article>
  );
}

export default function DataPolicyPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Data Policy"
        description="TechDerby Data Retention and Data Breach Policy covering retention periods, disposal, and incident response."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.24),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(249,115,22,0.2),transparent_36%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Internal Governance</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">Data Retention and Data Breach Policy</h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">TechDerby - Internal Governance Document</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            <DataCard title="Part A: Data Retention Policy">
              <h3 className="text-base font-semibold text-slate-900 md:text-lg">1. Purpose</h3>
              <p>
                This policy outlines how long TechDerby retains personal data and how it is securely disposed of in
                accordance with UK GDPR.
              </p>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">2. Data Categories and Retention Period</h3>
              <p>
                TechDerby retains personal data only for as long as necessary to fulfil the purposes for which it was
                collected, including legal, accounting, and reporting requirements.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Data Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {retentionRows.map((row) => (
                      <tr key={row.dataType}>
                        <td className="px-4 py-3 text-sm text-slate-700">{row.dataType}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{row.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>Where personal data is no longer required, it will be securely deleted or anonymised.</p>
              <p>We may retain data for longer where required by law or to defend legal claims.</p>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">3. Secure Disposal</h3>
              <p>Data will be:</p>
              <ul className="list-disc space-y-1 pl-5">
                {secureDisposal.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>Access permissions will be reviewed quarterly.</p>
            </DataCard>

            <DataCard title="Part B: Data Breach Policy">
              <h3 className="text-base font-semibold text-slate-900 md:text-lg">1. What Is a Data Breach?</h3>
              <p>A data breach includes:</p>
              <ul className="list-disc space-y-1 pl-5">
                {breachExamples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">2. Immediate Actions (Within 24 Hours)</h3>
              <p>Upon discovering a potential breach:</p>
              <ol className="list-decimal space-y-1 pl-5">
                {immediateActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">3. Risk Assessment</h3>
              <p>The DPO will assess:</p>
              <ul className="list-disc space-y-1 pl-5">
                {riskAssessment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">4. ICO Notification (Within 72 Hours)</h3>
              <p>
                If the breach poses a risk to individuals, TechDerby will notify the Information Commissioner's Office via{' '}
                <a href="https://ico.org.uk" target="_blank" rel="noreferrer noopener" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  https://ico.org.uk
                </a>
                . Notification must occur within 72 hours of awareness.
              </p>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">5. Communication to Individuals</h3>
              <p>If the breach poses a high risk, affected individuals will be informed promptly and transparently.</p>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">6. Breach Register</h3>
              <p>All breaches (even minor ones) will be recorded in an internal breach log including:</p>
              <ul className="list-disc space-y-1 pl-5">
                {breachRegister.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="text-base font-semibold text-slate-900 md:text-lg">7. Responsibilities</h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>DPO: Leads investigation and reporting</li>
                <li>Executive Director: Informed of significant incidents</li>
                <li>Board Chair: Notified in serious cases</li>
              </ul>
            </DataCard>

            <DataCard title="Personal Recommendation as Tech and Platform Lead">
              <p>I need to ensure:</p>
              <ul className="list-disc space-y-1 pl-5">
                {recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DataCard>
          </div>
        </Container>
      </Section>
    </>
  );
}
