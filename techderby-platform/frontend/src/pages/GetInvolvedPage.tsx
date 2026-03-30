import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

const speakerFormats = ['Keynote (15 min)', 'Panel', 'Workshop', 'Lightning talk (5 min)'];
const speakerTopics = ['Career Pathways', 'Software', 'Data', 'AI', 'Founders', 'Design', 'Community', 'Inclusion', 'Leadership'];
const volunteerRoles = ['Registration', 'Room set-up', 'Timekeeping', 'Photography', 'Welcoming first-timers'];
const volunteerPerks = ['References', 'Skills-building', 'Becoming known in the local community'];
const partnerBenefits = ['Visibility', 'Talent pipeline', 'Local goodwill', 'Meaningful introductions'];
const partnerSupport = ['Skills', 'Careers', 'Local innovation in Derby'];

const SPEAKER_FORM_LINK = 'https://forms.gle/tech-derby-speaker-form';

export default function GetInvolvedPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby | Get Involved"
        description="Get involved with Tech Derby by attending, speaking, volunteering, or sponsoring community events."
      />

      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Community Participation
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Get involved with
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                Tech Derby.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Tech Derby works because people show up, share, and support each other. Whether you are a student, employer,
              founder, or community partner, there is a simple way to get involved.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/events">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Attend an Event
                </Button>
              </Link>
              <Link
                to="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
              >
                Contact the Team
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Ways To Participate</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Choose your path</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                Option 1
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900">Attend</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
                Come to a meetup, meet people, learn something practical, and leave with new momentum.
              </p>
              <div className="mt-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
                Meetups are designed to be useful, welcoming, and practical for people at every stage of their journey.
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                Option 2
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900">Speak</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
                We welcome talks that are practical and kind. If you can help the community learn, we want to hear from you.
              </p>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Formats</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {speakerFormats.map((format) => (
                      <span key={format} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Topics</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {speakerTopics.map((topic) => (
                      <span key={topic} className="rounded-full border border-slate-300 bg-white px-3 py-1">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <p>
                  <span className="font-semibold text-slate-900">Apply:</span>{' '}
                  <a href={SPEAKER_FORM_LINK} target="_blank" rel="noreferrer noopener" className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 hover:text-orange-800">
                    Speaker form
                  </a>{' '}
                  <span className="text-slate-600">or email</span>{' '}
                  <a href="mailto:hello@techderby.com" className="font-semibold text-slate-900 hover:text-orange-700">hello@techderby.com</a>
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                Option 3
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900">Volunteer</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">Volunteers help make events smooth and welcoming.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">Roles</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {volunteerRoles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">Perks</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {volunteerPerks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-orange-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Option 4
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900">Partner or sponsor</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
                Partnerships help Tech Derby stay affordable and consistent. Sponsors can support venues, refreshments, student
                tickets, or community projects.
              </p>
              <div className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white/90 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">What you get</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {partnerBenefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">What you support</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {partnerSupport.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Contact:</span>{' '}
                  <a href="mailto:hello@techderby.com" className="font-semibold text-slate-900 hover:text-orange-700">
                    hello@techderby.com
                  </a>
                </p>
              </div>
            </article>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}