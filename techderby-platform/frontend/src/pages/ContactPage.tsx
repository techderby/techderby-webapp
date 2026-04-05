import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendWhatsAppNotification } from '../lib/whatsapp';
import { apiClient } from '../lib/api';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';
import { Section } from '../components/ui/Section';

const quickLinks = [
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Upcoming Events', to: '/events' },
  { label: 'Code of Conduct', to: '/code-of-conduct' },
  { label: 'Accessibility', to: '/accessibility' },
  { label: 'Safeguarding', to: '/safeguarding' },
];

const subjectOptions = ['General enquiry', 'Partnership', 'Speaking', 'Accessibility support', 'Safeguarding concern'];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const text = `[Contact Form]\nName: ${name || '-'}\nEmail: ${email || '-'}\nSubject: ${subject || '-'}\nMessage: ${message || '-'}`;
    sendWhatsAppNotification(text);
    try {
      await apiClient.notify(`[Website Contact] ${subject}`, text, 'Contact Form');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageSeo
        title="Tech Derby | Contact"
        description="Contact Tech Derby for event enquiries, partnerships, speaking opportunities, and community support."
      />

      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Community Support
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Contact
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                Tech Derby.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Whether you want to partner, speak, attend, or ask for support, we are here to help you plug into Derby's
              tech community.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-7">
                <h2 className="text-xl font-black text-slate-900 md:text-2xl">Send us a message</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                  Fill in the form and we'll get back to you as soon as possible.
                </p>

                {status === 'success' ? (
                  <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center" role="alert">
                    <p className="text-sm font-bold text-emerald-800">Message sent!</p>
                    <p className="mt-1 text-sm text-emerald-700">Thanks {name}, we'll be in touch soon.</p>
                    <button type="button" onClick={() => { setStatus('idle'); setName(''); setEmail(''); setMessage(''); }} className="mt-3 text-xs font-semibold text-emerald-700 underline hover:text-emerald-900">Send another message</button>
                  </div>
                ) : (
                <form className="mt-5 space-y-4" aria-label="Contact form" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                      <Input
                        id="contact-name"
                        aria-label="Full name"
                        placeholder="Your full name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
                      <Input
                        id="contact-email"
                        aria-label="Email address"
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
                    <select
                      id="contact-subject"
                      aria-label="Subject"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                    >
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      id="contact-message"
                      aria-label="Message"
                      placeholder="Tell us what you need and include relevant context."
                      className="min-h-[140px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button type="submit" disabled={status === 'sending'} className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                    </Button>
                    {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
                  </div>
                </form>
                )}
              </article>

            </div>

            <aside className="space-y-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-7">
                <h2 className="text-lg font-black text-slate-900 md:text-xl">Safety and support</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  For safeguarding, accessibility support, or Code of Conduct concerns, use the channels below and we will
                  prioritise your message.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  <li>Safeguarding concerns: hello@techderby.org</li>
                  <li>Accessibility requests: hello@techderby.org</li>
                  <li>Immediate danger: call 999</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-7">
                <h2 className="text-lg font-black text-slate-900 md:text-xl">Quick links</h2>
                <div className="mt-4 grid gap-2 text-sm">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-sm md:p-7">
                <h2 className="text-lg font-black md:text-xl">Community office hours</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  Our team monitors enquiries Monday to Friday. We aim to respond quickly and route your request to the right
                  person first time.
                </p>
                <p className="mt-4 text-sm font-semibold text-white">hello@techderby.org</p>
              </article>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
