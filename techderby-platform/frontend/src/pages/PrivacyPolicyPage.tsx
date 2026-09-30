import type { ReactNode } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const legalFrameworks = ['UK GDPR', 'Data Protection Act 2018', 'Privacy and Electronic Communications Regulations (PECR)'];

const memberData = ['Full Name', 'Email Address', 'Phone Number', 'Job Title', 'Mailing preferences and unsubscribe feedback'];
const partnerData = ['Company Name', 'Contact Person Name', 'Contact Email Address', 'Contact Phone Number'];
const analyticsData = [
  'Pseudonymous browser identifier',
  'Pages viewed and aggregate engagement information',
  'Device, browser and operating-system information',
  'Referring website and approved campaign parameters',
  'Approximate region derived from the connection IP address',
];

const reasonsForCollection = [
  'Register members for events',
  'Communicate about events, updates and opportunities',
  'Facilitate networking within the community',
  'Coordinate partnerships and sponsorships',
  'Share educational resources and community news',
  'Manage event logistics and follow-up communication',
  'Respond to enquiries',
  'Record and respect mailing-list unsubscribe preferences and improve our communications',
  'Measure aggregate use of our public website and improve its content, navigation, events and programmes',
];

const rights = [
  'Access your personal data',
  'Rectify inaccurate data',
  'Request the deletion of your data',
  'Restrict processing',
  'Object to processing',
  'Data portability (where applicable)',
  'Withdraw consent at any time',
];

const securityMeasures = [
  'Restricted access to data',
  'Secure password protection',
  'Use of reputable cloud-based services',
  'Regular review of access permissions',
];

const retentionRows = [
  { dataType: 'Event attendance records', period: '2 years' },
  { dataType: 'Members contact details', period: '2 years after the last engagement' },
  { dataType: 'Volunteer data', period: '6 years after leaving' },
  { dataType: 'Partner data', period: '6 years after the last engagement' },
  { dataType: 'Sponsorship contracts', period: '6 years' },
  { dataType: 'Active mailing-list subscribers', period: 'While subscribed or until 24 months of inactivity' },
  { dataType: 'Unsubscribe suppression records and feedback', period: 'Only as long as needed to respect the opt-out, demonstrate compliance, and analyse communications; reviewed periodically' },
  { dataType: 'Google Analytics user-level and event data', period: '2 months; aggregate standard reports may remain available for longer' },
  { dataType: 'Financial transaction records', period: '6 years' },
];

const thirdPartyProcessors = ['Google Analytics measurement services', 'Event registration and ticketing (e.g., Eventbrite)', 'Transactional email delivery providers', 'Website hosting providers'];

function PolicyCard({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </article>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Privacy Policy"
        description="Read Tech Derby's Privacy Policy and learn how we collect, process, retain, and protect personal data."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(14,165,233,0.28),transparent_40%),radial-gradient(circle_at_86%_76%,rgba(249,115,22,0.24),transparent_35%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Legal and Compliance</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">TechDerby Privacy Policy</h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
              Effective Date: <span className="font-semibold text-white">2026-07-24</span>
            </p>
            <p className="mt-1 text-sm text-white/75 md:text-base">
              ICO Registration Number: ZA000000 (placeholder - to be updated upon registration)
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            <PolicyCard id="who-we-are" title="1. Who We Are">
              <p>
                Tech Derby is building a connected tech community for Derby and beyond — bringing together developers,
                designers, data professionals, founders, students, career changers, and employers who want to learn,
                connect, and grow.
              </p>
              <p>
                Tech Derby is building a connected local tech community where careers grow, ideas are shared, and
                innovation can thrive. We make that happen through regular meetups, community programmes, and
                partnerships that open real doors for real people.
              </p>
              <p>
                We are proud to be a movement rooted in Derby, with a simple belief: that access to opportunity,
                knowledge, and community should be open to everyone — regardless of background, experience, or
                where you are starting from.
              </p>
              <p className="font-semibold text-slate-900">Derby's home for: Tech | Careers | Innovation</p>
              <p>
                Whether you are a developer looking to grow, someone taking their first steps into tech, a founder
                building something new, or an employer looking to engage the region's brightest talent — Tech Derby
                is where Derby's tech future is being shaped, together.
              </p>
              <p>For the purposes of UK data protection law, TechDerby is the Data Controller of the personal data described in this policy.</p>
            </PolicyCard>

            <PolicyCard id="commitment" title="2. Our Data Protection Commitment">
              <p>TechDerby is registered with the Information Commissioner's Office (ICO) under registration number ZA000000.</p>
              <p>We are committed to handling personal data lawfully, fairly, and transparently in accordance with:</p>
              <ul className="list-disc space-y-1 pl-5">
                {legalFrameworks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </PolicyCard>

            <PolicyCard id="what-we-collect" title="3. What Personal Data We Collect">
              <p>We collect only the data necessary to operate our community and events effectively.</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">A. Member Data</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {memberData.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">C. Website Analytics Data</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {analyticsData.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">B. Partner Data</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {partnerData.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </PolicyCard>

            <PolicyCard id="why-we-collect" title="4. Why We Collect Your Data">
              <ul className="list-disc space-y-1 pl-5">
                {reasonsForCollection.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="font-semibold text-slate-900">We do not sell or trade personal data.</p>
            </PolicyCard>

            <PolicyCard id="lawful-basis" title="5. Lawful Basis for Processing">
              <p>Under UK GDPR, we rely on the following lawful bases:</p>
              <p>
                <span className="font-semibold text-slate-900">Contract:</span> When you register for an event or programme,
                we process your data to fulfil that registration.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Consent:</span> When you opt in to receive newsletters or
                marketing communications. You may withdraw consent at any time by contacting us or using the unsubscribe link
                in communications.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Analytics consent:</span> When you actively allow Google Analytics on
                our public website. Analytics remains disabled until you consent, and you can withdraw this choice at any time
                through the Cookie settings control.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Legitimate Interests:</span> For maintaining professional
                relationships with partners and promoting the activities of TechDerby, provided such interests do not override
                your rights and freedoms.
              </p>
            </PolicyCard>

            <PolicyCard id="retention" title="6. How Long We Keep Your Data">
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
            </PolicyCard>

            <PolicyCard id="processors" title="7. Third-Party Processors">
              <p>
                We use trusted third-party service providers to operate our community. These providers process data on our
                behalf and are contractually required to protect it.
              </p>
              <p>These may include:</p>
              <ul className="list-disc space-y-1 pl-5">
                {thirdPartyProcessors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                These providers may store data outside the UK. Where this occurs, appropriate safeguards are in place in
                accordance with UK GDPR.
              </p>
            </PolicyCard>

            <PolicyCard id="rights" title="8. Your Data Protection Rights">
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc space-y-1 pl-5">
                {rights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                To exercise your rights, please contact us at{' '}
                <a href="mailto:privacy@techderby.co.uk" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  privacy@techderby.co.uk
                </a>
                .
              </p>
            </PolicyCard>

            <PolicyCard id="security" title="9. Data Security">
              <p>We implement appropriate technical and organisational measures to protect personal data, including:</p>
              <ul className="list-disc space-y-1 pl-5">
                {securityMeasures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </PolicyCard>

            <PolicyCard id="media" title="10. Photography and Media">
              <p>
                Photography and video may take place at TechDerby events. Where practical, we will provide notice at events.
                If you do not wish to appear in media content, please notify an organiser.
              </p>
            </PolicyCard>

            <PolicyCard id="complaints" title="11. How to Complain">
              <p>
                If you have concerns about how we handle your personal data, please contact us first at{' '}
                <a href="mailto:privacy@techderby.co.uk" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  privacy@techderby.co.uk
                </a>
                .
              </p>
              <p>
                If you remain dissatisfied, you have the right to lodge a complaint with the Information Commissioner's
                Office (ICO):
              </p>
              <p>
                Website:{' '}
                <a href="https://ico.org.uk" target="_blank" rel="noreferrer noopener" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  https://ico.org.uk
                </a>
              </p>
              <p>Telephone: 0303 123 1113</p>
            </PolicyCard>

            <PolicyCard id="contact" title="12. Contact Us">
              <p>For any data protection queries or concerns, please contact:</p>
              <p className="font-semibold text-slate-900">Data Protection Officer</p>
              <p>TechDerby</p>
              <p>
                Email:{' '}
                <a href="mailto:privacy@techderby.co.uk" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  privacy@techderby.co.uk
                </a>
              </p>
            </PolicyCard>
          </div>
        </Container>
      </Section>
    </>
  );
}
