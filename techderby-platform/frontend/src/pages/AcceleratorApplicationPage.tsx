import { useState, type FormEvent } from 'react';
import { sendWhatsAppNotification } from '../lib/whatsapp';
import { apiClient } from '../lib/api';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';
import { Section } from '../components/ui/Section';

const countryOptions = ['United Kingdom', 'Nigeria', 'Ghana', 'Kenya', 'India', 'United States', 'Canada', 'Germany', 'Other'];
const stageOptions = ['Select', 'Idea stage', 'MVP', 'Early traction', 'Revenue generating', 'Preparing for pre-seed'];
const discoveryOptions = ['Select', 'LinkedIn', 'Friend or colleague', 'University or school', 'Community event', 'Partner referral', 'Other'];
const acceleratorHistoryOptions = ['Select', 'Yes', 'No'];

type Step = 1 | 2 | 3;

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  linkedinUrl: string;
  startupName: string;
  startupWebsite: string;
  missionDescription: string;
  industry: string;
  startupStage: string;
  teamInfo: string;
  discoverySource: string;
  priorAcceleratorExperience: string;
  expectedGain: string;
  keyChallenges: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialFormValues: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  linkedinUrl: '',
  startupName: '',
  startupWebsite: '',
  missionDescription: '',
  industry: '',
  startupStage: 'Select',
  teamInfo: '',
  discoverySource: 'Select',
  priorAcceleratorExperience: 'Select',
  expectedGain: '',
  keyChallenges: '',
};

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AcceleratorApplicationPage() {
  const [step, setStep] = useState<Step>(1);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      return { ...current, [field]: undefined };
    });
  }

  function validateCurrentStep(targetStep: Step) {
    const nextErrors: FormErrors = {};

    if (targetStep === 1) {
      if (!formValues.fullName.trim()) nextErrors.fullName = 'This field is required.';
      if (!formValues.email.trim()) {
        nextErrors.email = 'This field is required.';
      } else if (!isValidEmail(formValues.email.trim())) {
        nextErrors.email = 'Please enter a valid email address.';
      }
      if (!formValues.country.trim()) nextErrors.country = 'Please select a country.';
      if (!formValues.linkedinUrl.trim()) {
        nextErrors.linkedinUrl = 'This field is required. Please input a valid URL.';
      } else if (!isValidUrl(formValues.linkedinUrl.trim()) || !formValues.linkedinUrl.toLowerCase().includes('linkedin.com')) {
        nextErrors.linkedinUrl = 'This field is required. Please input a valid URL.';
      }
    }

    if (targetStep === 2) {
      if (!formValues.startupName.trim()) nextErrors.startupName = 'This field is required.';
      if (!formValues.startupWebsite.trim()) {
        nextErrors.startupWebsite = 'This field is required.';
      } else if (!isValidUrl(formValues.startupWebsite.trim())) {
        nextErrors.startupWebsite = 'Please input a valid URL.';
      }

      const missionWordCount = countWords(formValues.missionDescription);
      if (!formValues.missionDescription.trim()) {
        nextErrors.missionDescription = 'This field is required.';
      } else if (missionWordCount < 200) {
        nextErrors.missionDescription = `Please enter at least 200 words (current: ${missionWordCount}).`;
      }

      if (!formValues.teamInfo.trim()) nextErrors.teamInfo = 'This field is required.';
    }

    if (targetStep === 3) {
      const gainWordCount = countWords(formValues.expectedGain);
      const challengeWordCount = countWords(formValues.keyChallenges);

      if (!formValues.expectedGain.trim()) {
        nextErrors.expectedGain = 'This field is required.';
      } else if (gainWordCount < 100) {
        nextErrors.expectedGain = `Please enter at least 100 words (current: ${gainWordCount}).`;
      }

      if (!formValues.keyChallenges.trim()) {
        nextErrors.keyChallenges = 'This field is required.';
      } else if (challengeWordCount < 100) {
        nextErrors.keyChallenges = `Please enter at least 100 words (current: ${challengeWordCount}).`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateCurrentStep(3)) return;
    setStatus('sending');
    const subject = `Pre-Seed Accelerator Application - ${formValues.startupName || 'New Applicant'}`;
    const text =
      `[Accelerator Application]\nName: ${formValues.fullName || '-'}\nEmail: ${formValues.email || '-'}\nPhone: ${formValues.phone || '-'}\nCountry: ${formValues.country || '-'}\nLinkedIn: ${formValues.linkedinUrl || '-'}\nStartup: ${formValues.startupName || '-'}\nWebsite: ${formValues.startupWebsite || '-'}\nIndustry: ${formValues.industry || '-'}\nStage: ${formValues.startupStage || '-'}\nDiscovery: ${formValues.discoverySource || '-'}\nPrior Accelerator: ${formValues.priorAcceleratorExperience || '-'}\nMission: ${formValues.missionDescription || '-'}\nTeam: ${formValues.teamInfo || '-'}\nExpected Gain: ${formValues.expectedGain || '-'}\nKey Challenges: ${formValues.keyChallenges || '-'}`;
    sendWhatsAppNotification(text);
    try {
      await apiClient.notify(subject, text, 'Accelerator Application Form');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function handleNext() {
    if (!validateCurrentStep(step)) return;
    setStep((current) => (current === 3 ? current : ((current + 1) as Step)));
  }

  function handlePrevious() {
    setErrors({});
    setStep((current) => (current === 1 ? current : ((current - 1) as Step)));
  }

  const missionWords = countWords(formValues.missionDescription);
  const gainWords = countWords(formValues.expectedGain);
  const challengeWords = countWords(formValues.keyChallenges);

  return (
    <>
      <PageSeo
        title="Tech Derby | Pre-Seed Accelerator Application"
        description="Apply to the Tech Derby Pre-Seed Accelerator. Build with evidence and pitch with confidence."
      />

      <Section className="relative overflow-hidden bg-slate-950 py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.28),transparent_42%),radial-gradient(circle_at_84%_78%,rgba(37,99,235,0.26),transparent_36%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-5xl text-center text-white">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">TECH DERBY PRE-SEED ACCELERATOR</h1>
            <p className="mt-4 text-2xl font-semibold text-white/95">Build with evidence. Pitch with confidence.</p>
            <div className="mx-auto mt-6 max-w-4xl border-t border-white/30 pt-5 text-base text-white/85 md:text-lg">
              An 8-week, clarity-led accelerator that takes early-stage founders from busy activity to validated learning,
              traction, and funding readiness.
            </div>
            <div className="mt-6 grid gap-3 text-left text-sm md:grid-cols-3 md:text-base">
              <p className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <span className="font-semibold text-white">Next cohort:</span> April 10 to May 29
              </p>
              <p className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <span className="font-semibold text-white">Cohort size:</span> Small by design
              </p>
              <p className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <span className="font-semibold text-white">Mode:</span> In-person at University of Derby
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-4xl font-bold text-[#0f2d78]">Application Form</h2>
            <p className="mt-3 text-xl text-slate-700">Please fill in the required fields below to complete the startup registration process.</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Step {step} of 3</p>

            <form className="mt-8 space-y-6" aria-label="Accelerator application form" onSubmit={handleSubmit}>
              {status === 'success' ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center" role="alert">
                  <p className="text-xl font-bold text-emerald-800">Application submitted!</p>
                  <p className="mt-2 text-base text-emerald-700">Thanks {formValues.fullName}, we've received your application for the Tech Derby Pre-Seed Accelerator and will be in touch shortly.</p>
                </div>
              ) : (<>
              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="app-full-name" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="app-full-name"
                      value={formValues.fullName}
                      onChange={(event) => setField('fullName', event.target.value)}
                      className="h-12"
                    />
                    {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName}</p> : null}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="app-email" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="app-email"
                        type="email"
                        value={formValues.email}
                        onChange={(event) => setField('email', event.target.value)}
                        className="h-12"
                      />
                      {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
                    </div>

                    <div>
                      <label htmlFor="app-phone" className="mb-1 block text-lg font-semibold text-[#0f2d78]">Phone Number</label>
                      <Input
                        id="app-phone"
                        value={formValues.phone}
                        onChange={(event) => setField('phone', event.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="app-country" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="app-country"
                        value={formValues.country}
                        onChange={(event) => setField('country', event.target.value)}
                        className="h-12 w-full rounded-md border border-slate-300 px-3 text-lg focus:border-secondary focus:outline-none"
                      >
                        <option value="">Select country</option>
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {errors.country ? <p className="mt-1 text-sm text-red-600">{errors.country}</p> : null}
                    </div>

                    <div>
                      <label htmlFor="app-linkedin" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                        LinkedIn Profile URL <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="app-linkedin"
                        value={formValues.linkedinUrl}
                        onChange={(event) => setField('linkedinUrl', event.target.value)}
                        className="h-12"
                        placeholder="https://www.linkedin.com/in/..."
                      />
                      {errors.linkedinUrl ? <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p> : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="app-startup-name" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                        Startup Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="app-startup-name"
                        value={formValues.startupName}
                        onChange={(event) => setField('startupName', event.target.value)}
                        className="h-12"
                      />
                      {errors.startupName ? <p className="mt-1 text-sm text-red-600">{errors.startupName}</p> : null}
                    </div>

                    <div>
                      <label htmlFor="app-startup-website" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                        Startup Website <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="app-startup-website"
                        value={formValues.startupWebsite}
                        onChange={(event) => setField('startupWebsite', event.target.value)}
                        className="h-12"
                        placeholder="https://"
                      />
                      {errors.startupWebsite ? <p className="mt-1 text-sm text-red-600">{errors.startupWebsite}</p> : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="app-mission" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                      Briefly describe your startup and its mission. <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="app-mission"
                      className="min-h-[180px] w-full rounded-md border border-slate-300 px-3 py-2 text-lg focus:border-secondary focus:outline-none"
                      value={formValues.missionDescription}
                      onChange={(event) => setField('missionDescription', event.target.value)}
                      placeholder="200 words minimum"
                    />
                    <p className="mt-1 text-xs text-slate-500">Word count: {missionWords}</p>
                    {errors.missionDescription ? <p className="mt-1 text-sm text-red-600">{errors.missionDescription}</p> : null}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="app-industry" className="mb-1 block text-lg font-semibold text-[#0f2d78]">Which industry does your startup operate in?</label>
                      <Input
                        id="app-industry"
                        value={formValues.industry}
                        onChange={(event) => setField('industry', event.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label htmlFor="app-stage" className="mb-1 block text-lg font-semibold text-[#0f2d78]">What stage is your startup currently at?</label>
                      <select
                        id="app-stage"
                        value={formValues.startupStage}
                        onChange={(event) => setField('startupStage', event.target.value)}
                        className="h-12 w-full rounded-md border border-slate-300 px-3 text-lg focus:border-secondary focus:outline-none"
                      >
                        {stageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="app-team" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                      How many team members do you have, and what are their primary roles? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="app-team"
                      className="min-h-[150px] w-full rounded-md border border-slate-300 px-3 py-2 text-lg focus:border-secondary focus:outline-none"
                      value={formValues.teamInfo}
                      onChange={(event) => setField('teamInfo', event.target.value)}
                      placeholder="Provide your answer"
                    />
                    {errors.teamInfo ? <p className="mt-1 text-sm text-red-600">{errors.teamInfo}</p> : null}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="app-discovery" className="mb-1 block text-lg font-semibold text-[#0f2d78]">How did you hear about Tech Derby?</label>
                      <select
                        id="app-discovery"
                        value={formValues.discoverySource}
                        onChange={(event) => setField('discoverySource', event.target.value)}
                        className="h-12 w-full rounded-md border border-slate-300 px-3 text-lg focus:border-secondary focus:outline-none"
                      >
                        {discoveryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="app-accelerator-history" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                        Have you participated in other accelerator or incubator programs?
                      </label>
                      <select
                        id="app-accelerator-history"
                        value={formValues.priorAcceleratorExperience}
                        onChange={(event) => setField('priorAcceleratorExperience', event.target.value)}
                        className="h-12 w-full rounded-md border border-slate-300 px-3 text-lg focus:border-secondary focus:outline-none"
                      >
                        {acceleratorHistoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="app-gain" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                      What do you hope to gain from participating in the Tech Derby accelerator cohort? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="app-gain"
                      className="min-h-[170px] w-full rounded-md border border-slate-300 px-3 py-2 text-lg focus:border-secondary focus:outline-none"
                      value={formValues.expectedGain}
                      onChange={(event) => setField('expectedGain', event.target.value)}
                      placeholder="100 words minimum"
                    />
                    <p className="mt-1 text-xs text-slate-500">Word count: {gainWords}</p>
                    {errors.expectedGain ? <p className="mt-1 text-sm text-red-600">{errors.expectedGain}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="app-challenges" className="mb-1 block text-lg font-semibold text-[#0f2d78]">
                      What are the main challenges your startup is currently facing? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="app-challenges"
                      className="min-h-[170px] w-full rounded-md border border-slate-300 px-3 py-2 text-lg focus:border-secondary focus:outline-none"
                      value={formValues.keyChallenges}
                      onChange={(event) => setField('keyChallenges', event.target.value)}
                      placeholder="100 words minimum"
                    />
                    <p className="mt-1 text-xs text-slate-500">Word count: {challengeWords}</p>
                    {errors.keyChallenges ? <p className="mt-1 text-sm text-red-600">{errors.keyChallenges}</p> : null}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-3">
                {step > 1 ? (
                  <Button type="button" variant="ghost" className="border border-slate-300 bg-slate-100 px-6" onClick={handlePrevious}>
                    Previous
                  </Button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <Button type="button" variant="ghost" className="border border-slate-300 bg-slate-100 px-8 text-slate-900" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800">
                    Registration for this cohort is now closed. Check back for future cohorts.
                  </p>
                )}
              </div>

              {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again or email hello@techderby.org.</p>}

              <p className="text-sm text-slate-600">
                Need help? Email{' '}
                <a href="mailto:hello@techderby.org" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">
                  hello@techderby.org
                </a>
                .
              </p>
              </>)}
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}
