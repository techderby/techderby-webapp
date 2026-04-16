import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';

// ─────────────────────── constants ───────────────────────────────────────────

const EXPERTISE_OPTIONS = [
  'Artificial Intelligence',
  'Cyber Security',
  'Software Development',
  'Product Management',
  'Startups / Entrepreneurship',
  'Investment / Venture Capital',
  'Digital Transformation',
  'Community / Ecosystem Building',
  'Other',
];

const AWARD_CATEGORIES = [
  'Tech Founder of the Year',
  'Rising Star in Tech',
  'AI Innovation Award',
  'Cybersecurity Excellence Award',
  'Community Impact Award',
  'Women in Tech Leadership Award',
  'Startup of the Year',
  'Digital Transformation Leader',
  'Tech for Good Award',
  'Lifetime Achievement Award',
];

const TOTAL_STEPS = 5;

// ─────────────────────── types ────────────────────────────────────────────────

type FormData = {
  // Step 1 – Personal Information
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;

  // Step 2 – Professional Background
  currentRole: string;
  organisation: string;
  professionalBackground: string;

  // Step 3 – Expertise & Category Preferences
  expertiseAreas: string[];
  expertiseOther: string;
  judgingCategories: string[];

  // Step 4 – Motivation & Experience
  motivation: string;
  previousJudgeExperience: 'yes' | 'no' | '';
  previousJudgeDetails: string;

  // Step 5 – Availability & Declaration
  availableForJudging: boolean | null;
  willingToCommit: boolean | null;
  declareFairness: boolean;
  agreeContact: boolean;
};

type FieldErrors = Partial<Record<keyof FormData | 'availabilityGroup', string>>;

const INITIAL: FormData = {
  fullName: '', email: '', phone: '', linkedIn: '',
  currentRole: '', organisation: '', professionalBackground: '',
  expertiseAreas: [], expertiseOther: '', judgingCategories: [],
  motivation: '', previousJudgeExperience: '', previousJudgeDetails: '',
  availableForJudging: null, willingToCommit: null,
  declareFairness: false, agreeContact: false,
};

// ─────────────────────── helpers ─────────────────────────────────────────────

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function wordCount(v: string) { return v.trim().split(/\s+/).filter(Boolean).length; }

// ─────────────────────── sub-components ──────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-slate-800">
      {children} {required && <span className="text-orange-500" aria-hidden="true">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{msg}</p>;
}

function Textarea({
  value, onChange, placeholder, rows = 5, error, maxWords,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; error?: string; maxWords?: number }) {
  const words = wordCount(value);
  const overLimit = maxWords ? words > maxWords : false;
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-lg border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          error || overLimit ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white focus:border-orange-400'
        }`}
      />
      {maxWords && (
        <p className={`mt-1 text-right text-xs ${overLimit ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
          {words} / {maxWords} words
        </p>
      )}
    </div>
  );
}

function CheckboxGroup({
  options, selected, onChange, error,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void; error?: string }) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  }
  return (
    <div className={`grid gap-2 sm:grid-cols-2 ${error ? 'rounded-xl border border-red-300 bg-red-50 p-3' : ''}`}>
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all hover:bg-orange-50/60 has-[:checked]:border-orange-300 has-[:checked]:bg-orange-50">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt)}
              className="h-4 w-4 flex-shrink-0 rounded border-slate-300 accent-orange-500"
            />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function YesNoToggle({
  value, onChange, error,
}: { value: boolean | null; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <div className="flex gap-3">
        {([true, false] as const).map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all ${
              value === opt
                ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-400/30'
                : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300'
            }`}
          >
            {opt ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─────────────────────── step components ─────────────────────────────────────

function Step1({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Personal Information</h2>
        <p className="mt-1 text-sm text-slate-500">Tell us a bit about yourself.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel required>Full Name</FieldLabel>
          <Input value={data.fullName} onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Jane Smith"
            className={errors.fullName ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.fullName} />
        </div>
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <Input type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)}
            placeholder="jane@example.com"
            className={errors.email ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.email} />
        </div>
        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <Input type="tel" value={data.phone} onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+44 7700 000000 (optional)" />
        </div>
        <div>
          <FieldLabel>LinkedIn Profile / Website</FieldLabel>
          <Input value={data.linkedIn} onChange={(e) => onChange('linkedIn', e.target.value)}
            placeholder="https://linkedin.com/in/yourname (optional)" />
        </div>
      </div>
    </div>
  );
}

function Step2({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Professional Background</h2>
        <p className="mt-1 text-sm text-slate-500">Help us understand your professional experience.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel required>Current Role / Position</FieldLabel>
          <Input value={data.currentRole} onChange={(e) => onChange('currentRole', e.target.value)}
            placeholder="e.g. CTO, Founder, Principal Engineer"
            className={errors.currentRole ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.currentRole} />
        </div>
        <div>
          <FieldLabel required>Organisation / Company</FieldLabel>
          <Input value={data.organisation} onChange={(e) => onChange('organisation', e.target.value)}
            placeholder="Company or organisation name"
            className={errors.organisation ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.organisation} />
        </div>
      </div>

      <div>
        <FieldLabel required>Professional Background & Experience</FieldLabel>
        <p className="mb-2 text-xs text-slate-500">Describe your career trajectory, key achievements, and why your expertise makes you a strong judge. (200–300 words recommended)</p>
        <Textarea
          value={data.professionalBackground}
          onChange={(v) => onChange('professionalBackground', v)}
          placeholder="Describe your professional journey, sector experience, notable projects or organisations you've worked with..."
          rows={6}
          maxWords={300}
          error={errors.professionalBackground}
        />
        <FieldError msg={errors.professionalBackground} />
      </div>
    </div>
  );
}

function Step3({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Expertise & Preferences</h2>
        <p className="mt-1 text-sm text-slate-500">Select all that apply — this helps us match you to the right categories.</p>
      </div>

      <div>
        <FieldLabel required>Areas of Expertise</FieldLabel>
        <p className="mb-3 text-xs text-slate-500">Select all that apply.</p>
        <CheckboxGroup
          options={EXPERTISE_OPTIONS}
          selected={data.expertiseAreas}
          onChange={(v) => onChange('expertiseAreas', v)}
          error={errors.expertiseAreas as string | undefined}
        />
        <FieldError msg={errors.expertiseAreas as string | undefined} />
        {data.expertiseAreas.includes('Other') && (
          <div className="mt-3">
            <FieldLabel>Please specify your other area of expertise</FieldLabel>
            <Input value={data.expertiseOther} onChange={(e) => onChange('expertiseOther', e.target.value)}
              placeholder="e.g. EdTech, HealthTech, Blockchain..." />
          </div>
        )}
      </div>

      <div>
        <FieldLabel required>Award Categories You'd Like to Judge</FieldLabel>
        <p className="mb-3 text-xs text-slate-500">Select all that interest you — you can choose multiple.</p>
        <CheckboxGroup
          options={AWARD_CATEGORIES}
          selected={data.judgingCategories}
          onChange={(v) => onChange('judgingCategories', v)}
          error={errors.judgingCategories as string | undefined}
        />
        <FieldError msg={errors.judgingCategories as string | undefined} />
      </div>
    </div>
  );
}

function Step4({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Motivation & Experience</h2>
        <p className="mt-1 text-sm text-slate-500">Tell us why you want to be a judge and any relevant experience.</p>
      </div>

      <div>
        <FieldLabel required>Why would you like to be a judge for the TechDerby Awards?</FieldLabel>
        <p className="mb-2 text-xs text-slate-500">Max 200 words.</p>
        <Textarea
          value={data.motivation}
          onChange={(v) => onChange('motivation', v)}
          placeholder="Tell us what drives you to support the East Midlands tech community and what you hope to contribute as a judge..."
          rows={5}
          maxWords={200}
          error={errors.motivation}
        />
        <FieldError msg={errors.motivation} />
      </div>

      <div>
        <FieldLabel required>Have you previously served as a judge, mentor, or advisor?</FieldLabel>
        <div className="mt-2">
          <YesNoToggle
            value={data.previousJudgeExperience === 'yes' ? true : data.previousJudgeExperience === 'no' ? false : null}
            onChange={(v) => onChange('previousJudgeExperience', v ? 'yes' : 'no')}
            error={errors.previousJudgeExperience}
          />
        </div>
        {data.previousJudgeExperience === 'yes' && (
          <div className="mt-4">
            <FieldLabel required>Please provide details</FieldLabel>
            <Textarea
              value={data.previousJudgeDetails}
              onChange={(v) => onChange('previousJudgeDetails', v)}
              placeholder="e.g. Judge at Midlands Tech Awards 2024, Mentor at Founders Factory, Advisor at DCMS..."
              rows={3}
              error={errors.previousJudgeDetails}
            />
            <FieldError msg={errors.previousJudgeDetails} />
          </div>
        )}
      </div>
    </div>
  );
}

function Step5({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Availability & Declaration</h2>
        <p className="mt-1 text-sm text-slate-500">Almost there — confirm your availability and commitment.</p>
      </div>

      <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/60 p-6">
        <div>
          <FieldLabel required>Are you available during the judging period?</FieldLabel>
          <p className="mb-3 text-xs text-slate-500">Judging is expected to take place in summer 2026.</p>
          <YesNoToggle
            value={data.availableForJudging}
            onChange={(v) => onChange('availableForJudging', v)}
            error={errors.availabilityGroup}
          />
        </div>

        <div>
          <FieldLabel required>Are you willing to commit the required time (approx. 3–5 hours)?</FieldLabel>
          <div className="mt-2">
            <YesNoToggle
              value={data.willingToCommit}
              onChange={(v) => onChange('willingToCommit', v)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Declaration</h3>

        {([
          {
            key: 'declareFairness' as const,
            label: 'I confirm that I will act fairly, objectively, and maintain confidentiality throughout the judging process.',
            required: true,
          },
          {
            key: 'agreeContact' as const,
            label: 'I agree to be contacted by TechDerby regarding my application.',
            required: true,
          },
        ]).map(({ key, label, required }) => (
          <label key={key} className={`flex cursor-pointer items-start gap-3 ${errors[key] ? 'text-red-600' : 'text-slate-700'}`}>
            <input
              type="checkbox"
              checked={data[key] as boolean}
              onChange={(e) => onChange(key, e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 accent-orange-500"
            />
            <span className="text-sm leading-snug">
              {label} {required && <span className="text-orange-500" aria-hidden="true">*</span>}
            </span>
          </label>
        ))}
        <FieldError msg={errors.declareFairness ?? errors.agreeContact} />
      </div>
    </div>
  );
}

// ─────────────────────── step indicator ──────────────────────────────────────

const STEP_LABELS = ['Personal', 'Background', 'Expertise', 'Motivation', 'Declaration'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                done ? 'border-orange-500 bg-orange-500 text-white'
                  : active ? 'border-orange-500 bg-white text-orange-500 shadow-md shadow-orange-200'
                  : 'border-slate-200 bg-white text-slate-400'
              }`}>
                {done ? (
                  <svg viewBox="0 0 12 12" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m2 6 3 3 5-5" />
                  </svg>
                ) : step}
              </div>
              <span className={`mt-1.5 hidden text-[10px] font-semibold uppercase tracking-wide sm:block ${
                active ? 'text-orange-500' : done ? 'text-orange-400' : 'text-slate-400'
              }`}>{label}</span>
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div className={`mx-1 mb-4 h-0.5 w-8 sm:w-12 transition-all ${done ? 'bg-orange-400' : 'bg-slate-200'}`} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────── main page ───────────────────────────────────────────

export default function JudgeApplicationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const formTopRef = useRef<HTMLDivElement>(null);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: undefined };
    });
  }

  function scrollToTop() {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(s: number): boolean {
    const next: FieldErrors = {};

    if (s === 1) {
      if (!form.fullName.trim()) next.fullName = 'Full name is required.';
      if (!form.email.trim()) next.email = 'Email address is required.';
      else if (!isEmail(form.email)) next.email = 'Please enter a valid email address.';
    }

    if (s === 2) {
      if (!form.currentRole.trim()) next.currentRole = 'Current role is required.';
      if (!form.organisation.trim()) next.organisation = 'Organisation is required.';
      if (!form.professionalBackground.trim()) next.professionalBackground = 'Please describe your professional background.';
    }

    if (s === 3) {
      if (form.expertiseAreas.length === 0) (next as any).expertiseAreas = 'Please select at least one area of expertise.';
      if (form.judgingCategories.length === 0) (next as any).judgingCategories = 'Please select at least one category.';
    }

    if (s === 4) {
      if (!form.motivation.trim()) next.motivation = 'Please share your motivation.';
      if (wordCount(form.motivation) > 200) next.motivation = 'Please keep your motivation to 200 words or fewer.';
      if (!form.previousJudgeExperience) next.previousJudgeExperience = 'Please answer this question.';
      if (form.previousJudgeExperience === 'yes' && !form.previousJudgeDetails.trim())
        next.previousJudgeDetails = 'Please provide details of your prior experience.';
    }

    if (s === 5) {
      if (form.availableForJudging === null || form.willingToCommit === null)
        (next as any).availabilityGroup = 'Please answer both availability questions.';
      if (!form.declareFairness) next.declareFairness = 'You must agree to the declaration to proceed.';
      if (!form.agreeContact) next.agreeContact = 'You must agree to be contacted to proceed.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (!validateStep(step)) { scrollToTop(); return; }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    scrollToTop();
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    scrollToTop();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(5)) { scrollToTop(); return; }

    setStatus('submitting');
    setSubmitError('');

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      linkedIn: form.linkedIn,
      currentRole: form.currentRole,
      organisation: form.organisation,
      professionalBackground: form.professionalBackground,
      expertiseAreas: form.expertiseAreas.join(', '),
      expertiseOther: form.expertiseOther,
      judgingCategories: form.judgingCategories.join(', '),
      motivation: form.motivation,
      previousJudgeExperience: form.previousJudgeExperience,
      previousJudgeDetails: form.previousJudgeDetails,
      availableForJudging: form.availableForJudging ?? false,
      willingToCommit: form.willingToCommit ?? false,
      declareFairness: form.declareFairness,
      agreeContact: form.agreeContact,
    };

    try {
      await apiClient.submitJudgeApplication(payload);
      setStatus('success');
      scrollToTop();
    } catch (err: unknown) {
      setStatus('error');
      const msg =
        (err as any)?.response?.data?.error?.message ??
        (err as any)?.response?.data?.message ??
        (err as any)?.message ??
        null;
      setSubmitError(
        msg
          ? `Submission failed: ${msg}`
          : 'Something went wrong. Please try again or email us at info@techderby.org.',
      );
    }
  }

  // ── success screen ─────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <>
        <PageSeo title="Application Received | TechDerby Awards Judge" description="Thank you for applying to be a TechDerby Awards judge." />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-24">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 shadow-2xl shadow-orange-500/30">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Application Received!</h1>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Thank you for your interest in becoming a TechDerby Awards Judge.
            </p>
            <p className="mt-3 text-base text-white/55 leading-relaxed">
              Our team will review your application and be in touch soon. We appreciate your willingness to support innovation and excellence in our community.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-colors hover:bg-orange-600"
              >
                Back to home
              </Link>
              <Link
                to="/awards/nominate"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                Submit a nomination
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <PageSeo
        title="Apply to Judge | TechDerby Digital Excellence Awards 2026"
        description="Apply to be a judge for the TechDerby Digital Excellence Awards 2026. Share your expertise and help recognise outstanding talent across the East Midlands tech ecosystem."
      />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
            ⚖️ TechDerby Awards 2026 — Judges Panel
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl leading-tight">
            Apply to Become a Judge
          </h1>
          <p className="mt-4 text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Help us recognise the outstanding talent, innovation, and impact across the East Midlands tech ecosystem.
          </p>
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="bg-slate-50 pb-24 pt-10">
        <Container className="max-w-2xl">
          <div ref={formTopRef} />

          <form onSubmit={handleSubmit} noValidate>
            {/* Step indicator */}
            <div className="mb-8">
              <StepIndicator current={step} />
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {step === 1 && <Step1 data={form} errors={errors} onChange={setField} />}
              {step === 2 && <Step2 data={form} errors={errors} onChange={setField} />}
              {step === 3 && <Step3 data={form} errors={errors} onChange={setField} />}
              {step === 4 && <Step4 data={form} errors={errors} onChange={setField} />}
              {step === 5 && <Step5 data={form} errors={errors} onChange={setField} />}

              {/* Error banner */}
              {status === 'error' && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-sm font-medium text-red-600">{submitError}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                {step > 1 ? (
                  <Button type="button" variant="ghost" onClick={handleBack} className="gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </Button>
                ) : (
                  <Link to="/" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
                    ← Cancel
                  </Link>
                )}

                {step < TOTAL_STEPS ? (
                  <Button type="button" onClick={handleNext} className="ml-auto gap-2 bg-orange-500 text-white hover:bg-orange-600">
                    Continue
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="ml-auto gap-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Application
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
                        </svg>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Progress text */}
            <p className="mt-4 text-center text-xs text-slate-400">
              Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}
            </p>
          </form>
        </Container>
      </div>
    </>
  );
}
