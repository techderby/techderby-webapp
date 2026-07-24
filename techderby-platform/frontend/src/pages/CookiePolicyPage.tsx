import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const strictCookies = ['Security-related cookies', 'Session management cookies', 'Form submission protection'];

const analyticsUses = ['Understand how visitors use our website', 'Improve content and structure', 'Monitor performance'];

const analyticsData = [
  'Pages visited and approximate engagement time',
  'Successful website actions such as membership registration or mailing-list sign-up',
  'Device, browser and operating-system type',
  'Referring website and approved campaign parameters',
  'Approximate region derived by Google from the connection IP address',
  'A pseudonymous browser identifier',
];

const functionalCookies = ['Remembering preferences', 'Embedded video playback (e.g., YouTube)', 'Event registration integrations'];

const thirdPartyCookies = [
  'Google Analytics 4',
  'Event registration integrations (e.g., Eventbrite)',
  'Email marketing tools like Mailchimp',
  'Embedded social media platforms',
];

const cookieRows = [
  {
    name: 'td_consent_v1',
    provider: 'Tech Derby',
    purpose: 'Remembers whether you accepted or rejected analytics.',
    duration: '6 months',
    category: 'Necessary',
  },
  {
    name: '_ga',
    provider: 'Google Analytics',
    purpose: 'Distinguishes one browser from another for aggregate website measurement.',
    duration: 'Up to 6 months',
    category: 'Analytics',
  },
  {
    name: '_ga_<measurement-id>',
    provider: 'Google Analytics',
    purpose: 'Maintains the state needed to measure a website session.',
    duration: 'Up to 6 months',
    category: 'Analytics',
  },
];

function CookieCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </article>
  );
}

export default function CookiePolicyPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Cookie Policy"
        description="Learn how TechDerby uses cookies and similar technologies, and how to manage your cookie preferences."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_86%_80%,rgba(249,115,22,0.2),transparent_35%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Website Cookies</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">TechDerby Cookie Policy</h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
              Effective Date: <span className="font-semibold text-white">2026-07-24</span>
            </p>
            <p className="mt-2 text-sm text-white/80">
              This policy should be read alongside our{' '}
              <Link to="/privacy-policy" className="font-semibold underline decoration-white/40 underline-offset-2 hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            <CookieCard title="1. Introduction">
              <p>This Cookie Policy explains how TechDerby uses cookies and similar technologies on the public website at techderby.org.</p>
              <p>
                TechDerby is a community dedicated to connecting and supporting people working in and aspiring to work in
                technology across Derby and the wider region.
              </p>
            </CookieCard>

            <CookieCard title="2. What Are Cookies?">
              <p>
                Cookies are small text files placed on your device when you visit a website. They help websites function
                properly, improve user experience, and provide analytics information.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Session cookies (deleted when you close your browser)</li>
                <li>Persistent cookies (remain for a set period)</li>
              </ul>
            </CookieCard>

            <CookieCard title="3. Types of Cookies We Use">
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">A. Strictly Necessary Cookies</p>
                  <p className="mt-2">These cookies are essential for the website to function. These may include:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {strictCookies.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-medium text-slate-900">These cookies do not require consent.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">B. Analytics Cookies</p>
                  <p className="mt-2">With your permission, we use Google Analytics 4 to:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {analyticsUses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2">Analytics uses pseudonymous identifiers. These are not names or email addresses, but may still constitute personal data. Information includes:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {analyticsData.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-medium text-slate-900">Analytics cookies are only activated after user consent.</p>
                  <p className="mt-2">We disable Google Signals, advertising storage, ads personalisation and user-provided data collection in the website tag.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">C. Functional Cookies</p>
                  <p className="mt-2">These may include:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {functionalCookies.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-medium text-slate-900">These require user consent where applicable.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">D. Third-Party Cookies</p>
                  <p className="mt-2">We may use third-party services such as:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {thirdPartyCookies.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2">These providers may place cookies when you interact with their services through our website.</p>
                  <p className="font-medium text-slate-900">We do not control third-party cookies directly.</p>
                </div>
              </div>
            </CookieCard>

            <CookieCard title="4. Cookies Used on techderby.org">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      {['Name', 'Provider', 'Purpose', 'Duration', 'Category'].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {cookieRows.map((cookie) => (
                      <tr key={cookie.name}>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">{cookie.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{cookie.provider}</td>
                        <td className="min-w-64 px-4 py-3 text-sm text-slate-700">{cookie.purpose}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{cookie.duration}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{cookie.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Google Analytics is not loaded on the Tech Derby CMS administration interface. Password-reset and mailing-list unsubscribe query values are not sent to Analytics.
              </p>
            </CookieCard>

            <CookieCard title="5. How You Control Cookies">
              <p>When you first visit our website, you will be presented with a cookie banner allowing you to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Manage preferences</li>
              </ul>
              <p>You can reopen the preference panel at any time using the <strong>Cookie settings</strong> button in the website footer. Withdrawing analytics consent stops future measurement and removes accessible Google Analytics cookies.</p>
              <p>You may also manage cookies through your browser settings.</p>
              <p className="font-medium text-slate-900">Please note: disabling certain cookies may affect website functionality.</p>
            </CookieCard>

            <CookieCard title="6. Updates to This Policy">
              <p>We may update this Cookie Policy from time to time to reflect changes in law or our services.</p>
            </CookieCard>

            <CookieCard title="7. Contact Us">
              <p>If you have questions about this Cookie Policy, please contact:</p>
              <p>
                Email:{' '}
                <a href="mailto:privacy@techderby.co.uk" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  privacy@techderby.co.uk
                </a>
              </p>
            </CookieCard>
          </div>
        </Container>
      </Section>
    </>
  );
}
