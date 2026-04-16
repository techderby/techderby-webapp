import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';

// ─────────────────────── constants ───────────────────────────────────────────

const AWARD_CATEGORIES = [
  { value: 'Tech Founder of the Year', icon: '🚀', desc: 'Exceptional founders shaping the tech landscape' },
  { value: 'Rising Star in Tech', icon: '⭐', desc: 'Emerging talent making a bold early impact' },
  { value: 'AI Innovation Award', icon: '🤖', desc: 'Groundbreaking work in artificial intelligence' },
  { value: 'Cybersecurity Excellence Award', icon: '🔐', desc: 'Outstanding contribution to digital security' },
  { value: 'Community Impact Award', icon: '🤝', desc: 'Driving meaningful change in the tech community' },
  { value: 'Women in Tech Leadership Award', icon: '💜', desc: 'Championing women and non-binary leaders in tech' },
  { value: 'Startup of the Year', icon: '🏢', desc: 'The most impressive startup of 2026' },
  { value: 'Digital Transformation Leader', icon: '⚡', desc: 'Driving digital change within organisations' },
  { value: 'Tech for Good Award', icon: '🌱', desc: 'Using technology for social and environmental good' },
  { value: 'Lifetime Achievement Award', icon: '🏆', desc: 'Sustained excellence and lasting contribution to tech' },
];

const TOTAL_STEPS = 5;

// ─────────────────────── types ────────────────────────────────────────────────

type FormData = {
  // Step 1 – About You
  nominatorName: string;
  nominatorEmail: string;
  nominatorOrganisation: string;
  nominatorRole: string;
  nominationType: 'self' | 'other' | '';

  // Step 2 – Nominee Details
  nomineeName: string;
  nomineeEmail: string;
  nomineeOrganisation: string;
  nomineeRole: string;
  nomineeLinkedIn: string;

  // Step 3 – Award Category
  awardCategory: string;

  // Step 4 – Nomination Statement
  whyNominating: string;
  techEcosystemImpact: string;
  measurableAchievements: string;
  techDerbyAlignment: string;

  // Step 5 – Supporting Info + Consent
  mediaLinks: string;
  additionalComments: string;
  consentAccurate: boolean;
  consentContact: boolean;
  consentPromotional: boolean;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  nominatorName: '', nominatorEmail: '', nominatorOrganisation: '', nominatorRole: '', nominationType: '',
  nomineeName: '', nomineeEmail: '', nomineeOrganisation: '', nomineeRole: '', nomineeLinkedIn: '',
  awardCategory: '',
  whyNominating: '', techEcosystemImpact: '', measurableAchievements: '', techDerbyAlignment: '',
  mediaLinks: '', additionalComments: '',
  consentAccurate: false, consentContact: false, consentPromotional: false,
};

// ─────────────────────── helpers ─────────────────────────────────────────────

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

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
  value, onChange, placeholder, rows = 5, error,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; error?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${
        error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white focus:border-orange-400'
      }`}
    />
  );
}

// ─────────────────────── step components ─────────────────────────────────────

function Step1({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">About You</h2>
        <p className="mt-1 text-sm text-slate-500">Tell us who is making this nomination.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel required>Full Name</FieldLabel>
          <Input value={data.nominatorName} onChange={(e) => onChange('nominatorName', e.target.value)}
            placeholder="Jane Smith" className={errors.nominatorName ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.nominatorName} />
        </div>
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <Input type="email" value={data.nominatorEmail} onChange={(e) => onChange('nominatorEmail', e.target.value)}
            placeholder="jane@example.com" className={errors.nominatorEmail ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.nominatorEmail} />
        </div>
        <div>
          <FieldLabel>Organisation</FieldLabel>
          <Input value={data.nominatorOrganisation} onChange={(e) => onChange('nominatorOrganisation', e.target.value)}
            placeholder="Acme Ltd (optional)" />
        </div>
        <div>
          <FieldLabel>Role / Position</FieldLabel>
          <Input value={data.nominatorRole} onChange={(e) => onChange('nominatorRole', e.target.value)}
            placeholder="e.g. CTO, Developer, Student" />
        </div>
      </div>

      <div>
        <FieldLabel required>Who are you nominating?</FieldLabel>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          {(['self', 'other'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange('nominationType', opt)}
              className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                data.nominationType === opt
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-400/30'
                  : 'border-slate-200 bg-white hover:border-orange-300'
              }`}
            >
              <span className="text-2xl">{opt === 'self' ? '🙋' : '👤'}</span>
              <span className="font-semibold text-slate-800">{opt === 'self' ? 'Myself' : 'Someone else'}</span>
            </button>
          ))}
        </div>
        <FieldError msg={errors.nominationType} />
      </div>
    </div>
  );
}

function Step2({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  const isSelf = data.nominationType === 'self';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Nominee Details</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isSelf ? 'Your details have been pre-filled — update anything that differs.' : 'Tell us about the person or organisation you are nominating.'}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel required>Nominee Full Name</FieldLabel>
          <Input value={data.nomineeName} onChange={(e) => onChange('nomineeName', e.target.value)}
            placeholder="Full name" className={errors.nomineeName ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.nomineeName} />
        </div>
        <div>
          <FieldLabel required>Nominee Email Address</FieldLabel>
          <Input type="email" value={data.nomineeEmail} onChange={(e) => onChange('nomineeEmail', e.target.value)}
            placeholder="nominee@example.com" className={errors.nomineeEmail ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} />
          <FieldError msg={errors.nomineeEmail} />
        </div>
        <div>
          <FieldLabel>Organisation / Company</FieldLabel>
          <Input value={data.nomineeOrganisation} onChange={(e) => onChange('nomineeOrganisation', e.target.value)}
            placeholder="Company or organisation name" />
        </div>
        <div>
          <FieldLabel>Role / Position</FieldLabel>
          <Input value={data.nomineeRole} onChange={(e) => onChange('nomineeRole', e.target.value)}
            placeholder="e.g. Founder, Engineer, Manager" />
        </div>
      </div>

      <div>
        <FieldLabel>LinkedIn or Website URL</FieldLabel>
        <Input value={data.nomineeLinkedIn} onChange={(e) => onChange('nomineeLinkedIn', e.target.value)}
          placeholder="https://linkedin.com/in/nominee or https://example.com (optional)" />
      </div>
    </div>
  );
}

function Step3({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Award Category</h2>
        <p className="mt-1 text-sm text-slate-500">Select the category that best fits the nominee's contribution.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {AWARD_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange('awardCategory', cat.value)}
            className={`flex items-start gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
              data.awardCategory === cat.value
                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-400/30'
                : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/40'
            }`}
          >
            <span className="mt-0.5 text-2xl leading-none">{cat.icon}</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm leading-snug">{cat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500 leading-snug">{cat.desc}</p>
            </div>
            {data.awardCategory === cat.value && (
              <span className="ml-auto mt-0.5 flex-shrink-0 rounded-full bg-orange-500 p-0.5 text-white">
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 6 3 3 5-5" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
      <FieldError msg={errors.awardCategory} />
    </div>
  );
}

function Step4({
  data, errors, onChange,
}: { data: FormData; errors: FieldErrors; onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Nomination Statement</h2>
        <p className="mt-1 text-sm text-slate-500">
          Help us understand why this nomination deserves to win. Be specific and compelling.
        </p>
      </div>

      <div>
        <FieldLabel required>Why are you nominating this individual / organisation?</FieldLabel>
        <p className="mb-2 text-xs text-slate-500">Describe their achievements, impact, and contributions.</p>
        <Textarea value={data.whyNominating} onChange={(v) => onChange('whyNominating', v)}
          placeholder="Tell us about their journey, what makes them stand out, and why they deserve this award..."
          rows={5} error={errors.whyNominating} />
        <FieldError msg={errors.whyNominating} />
      </div>

      <div>
        <FieldLabel required>What specific impact have they made in the tech ecosystem?</FieldLabel>
        <Textarea value={data.techEcosystemImpact} onChange={(v) => onChange('techEcosystemImpact', v)}
          placeholder="Describe the tangible difference they have made to the East Midlands tech community..."
          rows={5} error={errors.techEcosystemImpact} />
        <FieldError msg={errors.techEcosystemImpact} />
      </div>

      <div>
        <FieldLabel>Measurable achievements or results</FieldLabel>
        <p className="mb-2 text-xs text-slate-500">
          e.g. growth metrics, number of people impacted, revenue milestones, innovation breakthroughs (optional but recommended)
        </p>
        <Textarea value={data.measurableAchievements} onChange={(v) => onChange('measurableAchievements', v)}
          placeholder="e.g. Grew user base from 500 to 15,000 in 12 months; trained 300 women in cybersecurity..."
          rows={4} />
      </div>

      <div>
        <FieldLabel required>How does the nominee align with TechDerby's mission?</FieldLabel>
        <p className="mb-2 text-xs text-slate-500">Consider community, innovation, and growth in your answer.</p>
        <Textarea value={data.techDerbyAlignment} onChange={(v) => onChange('techDerbyAlignment', v)}
          placeholder="Explain how their work reflects TechDerby's values of community, innovation, and sustainable growth..."
          rows={4} error={errors.techDerbyAlignment} />
        <FieldError msg={errors.techDerbyAlignment} />
      </div>
    </div>
  );
}

function Step5({
  data, errors, onChange, files, onFiles,
}: {
  data: FormData;
  errors: FieldErrors;
  onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  files: File[];
  onFiles: (files: File[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    onFiles([...files, ...picked]);
    e.target.value = '';
  }

  function removeFile(index: number) {
    onFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Supporting Info & Declaration</h2>
        <p className="mt-1 text-sm text-slate-500">Final details and your confirmation before we receive your nomination.</p>
      </div>

      {/* Supporting Documents */}
      <div>
        <FieldLabel>Supporting Documents</FieldLabel>
        <p className="mb-3 text-xs text-slate-500">Pitch decks, articles, portfolio, PDFs etc. (optional, max 10 MB per file)</p>
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition-colors hover:border-orange-400 hover:bg-orange-50/30"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload supporting documents"
        >
          <svg viewBox="0 0 24 24" className="mb-2 h-8 w-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm font-medium text-slate-600">Click to upload or drag & drop</p>
          <p className="mt-1 text-xs text-slate-400">PDF, Word, PowerPoint, images</p>
        </div>
        <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
          onChange={handleFileChange} className="sr-only" aria-label="File upload" />
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="flex-1 truncate text-sm text-slate-700">{f.name}</span>
                <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)} KB</span>
                <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}
                  className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Media Links */}
      <div>
        <FieldLabel>Links to media, press, or projects</FieldLabel>
        <Textarea value={data.mediaLinks} onChange={(v) => onChange('mediaLinks', v)}
          placeholder="Paste any relevant links, one per line (optional)&#10;e.g. https://techcrunch.com/article, https://github.com/project"
          rows={3} />
      </div>

      {/* Additional Comments */}
      <div>
        <FieldLabel>Additional Comments</FieldLabel>
        <Textarea value={data.additionalComments} onChange={(v) => onChange('additionalComments', v)}
          placeholder="Anything else you'd like us to know? (optional)" rows={3} />
      </div>

      {/* Consent */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Consent & Declaration</h3>

        {([
          { key: 'consentAccurate' as const, label: 'I confirm that the information provided in this nomination is accurate to the best of my knowledge.', required: true },
          { key: 'consentContact' as const, label: 'I consent to TechDerby contacting the nominee regarding this nomination.', required: false },
          { key: 'consentPromotional' as const, label: 'I agree to the use of submitted information for TechDerby promotional and award ceremony purposes.', required: false },
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
        <FieldError msg={errors.consentAccurate} />
      </div>
    </div>
  );
}

// ─────────────────────── step indicator ──────────────────────────────────────

const STEP_LABELS = ['About You', 'Nominee', 'Category', 'Statement', 'Declaration'];

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

export default function AwardsNominationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [files, setFiles] = useState<File[]>([]);
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
      if (!form.nominatorName.trim()) next.nominatorName = 'Full name is required.';
      if (!form.nominatorEmail.trim()) next.nominatorEmail = 'Email address is required.';
      else if (!isEmail(form.nominatorEmail)) next.nominatorEmail = 'Please enter a valid email address.';
      if (!form.nominationType) next.nominationType = 'Please select who you are nominating.';
    }

    if (s === 2) {
      if (!form.nomineeName.trim()) next.nomineeName = 'Nominee name is required.';
      if (!form.nomineeEmail.trim()) next.nomineeEmail = 'Nominee email is required.';
      else if (!isEmail(form.nomineeEmail)) next.nomineeEmail = 'Please enter a valid email address.';
    }

    if (s === 3) {
      if (!form.awardCategory) next.awardCategory = 'Please select an award category.';
    }

    if (s === 4) {
      if (!form.whyNominating.trim()) next.whyNominating = 'This field is required.';
      if (!form.techEcosystemImpact.trim()) next.techEcosystemImpact = 'This field is required.';
      if (!form.techDerbyAlignment.trim()) next.techDerbyAlignment = 'This field is required.';
    }

    if (s === 5) {
      if (!form.consentAccurate) next.consentAccurate = 'You must confirm the information is accurate to proceed.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (!validateStep(step)) { scrollToTop(); return; }
    // If nominating self, pre-fill nominee fields from nominator
    if (step === 1 && form.nominationType === 'self') {
      setForm((prev) => ({
        ...prev,
        nomineeName: prev.nomineeName || prev.nominatorName,
        nomineeEmail: prev.nomineeEmail || prev.nominatorEmail,
        nomineeOrganisation: prev.nomineeOrganisation || prev.nominatorOrganisation,
        nomineeRole: prev.nomineeRole || prev.nominatorRole,
      }));
    }
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

    const fd = new FormData();
    const fields: Record<string, string | boolean> = {
      nominatorName: form.nominatorName,
      nominatorEmail: form.nominatorEmail,
      nominatorOrganisation: form.nominatorOrganisation,
      nominatorRole: form.nominatorRole,
      nominationType: form.nominationType,
      nomineeName: form.nomineeName,
      nomineeEmail: form.nomineeEmail,
      nomineeOrganisation: form.nomineeOrganisation,
      nomineeRole: form.nomineeRole,
      nomineeLinkedIn: form.nomineeLinkedIn,
      awardCategory: form.awardCategory,
      whyNominating: form.whyNominating,
      techEcosystemImpact: form.techEcosystemImpact,
      measurableAchievements: form.measurableAchievements,
      techDerbyAlignment: form.techDerbyAlignment,
      mediaLinks: form.mediaLinks,
      additionalComments: form.additionalComments,
      consentAccurate: form.consentAccurate,
      consentContact: form.consentContact,
      consentPromotional: form.consentPromotional,
    };

    Object.entries(fields).forEach(([k, v]) => fd.append(k, String(v)));
    files.forEach((f) => fd.append('files.supportingDocuments', f, f.name));

    try {
      await apiClient.submitNomination(fd);
      setStatus('success');
      scrollToTop();
    } catch (err: unknown) {
      setStatus('error');
      // Surface the CMS error message when available
      const e = err as { response?: { data?: { error?: { message?: string }; message?: string } }; message?: string };
      const msg =
        e?.response?.data?.error?.message ??
        e?.response?.data?.message ??
        e?.message ??
        null;
      setSubmitError(
        msg
          ? `Submission failed: ${msg}`
          : 'Something went wrong. Please try again or email us at info@techderby.org.',
      );
    }
  }

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <>
      <PageSeo
        title="Nominate | TechDerby Digital Excellence Awards 2026"
        description="Submit your nomination for the TechDerby Digital Excellence Awards 2026. Recognising outstanding talent, innovation, and impact across the East Midlands tech ecosystem."
      />

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(249,115,22,0.22),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(14,165,233,0.18),transparent_50%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
            <span aria-hidden="true">🏆</span> TechDerby Awards 2026
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Submit a Nomination
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Recognising excellence, innovation, and impact across the East Midlands tech ecosystem.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="bg-slate-50 pb-24 pt-12">
        <Container className="max-w-3xl">
          <div ref={formTopRef} />

          {status === 'success' ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-4xl shadow-lg shadow-orange-200">
                🏆
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Nomination Received!</h2>
              <p className="mt-3 text-slate-600 max-w-lg mx-auto">
                Thank you for taking the time to nominate. The TechDerby Awards team will review all submissions and be in touch in due course.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/">
                  <Button variant="secondary" className="w-full sm:w-auto">Back to Home</Button>
                </Link>
                <Button onClick={() => { setStatus('idle'); setForm(INITIAL); setStep(1); setFiles([]); }}
                  className="w-full sm:w-auto">
                  Submit Another Nomination
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              {/* Step indicator */}
              <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
                <StepIndicator current={step} />
                <p className="mt-4 text-center text-xs text-slate-400">Step {step} of {TOTAL_STEPS}</p>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="px-8 py-8 md:px-10">
                  {step === 1 && <Step1 data={form} errors={errors} onChange={setField} />}
                  {step === 2 && <Step2 data={form} errors={errors} onChange={setField} />}
                  {step === 3 && <Step3 data={form} errors={errors} onChange={setField} />}
                  {step === 4 && <Step4 data={form} errors={errors} onChange={setField} />}
                  {step === 5 && <Step5 data={form} errors={errors} onChange={setField} files={files} onFiles={setFiles} />}

                  {status === 'error' && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                </div>

                {/* Footer nav */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-8 py-5 md:px-10">
                  {step > 1 ? (
                    <button type="button" onClick={handleBack}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <Link to="/" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
                      Cancel
                    </Link>
                  )}

                  {step < TOTAL_STEPS ? (
                    <Button type="button" onClick={handleNext} className="px-7">
                      Continue
                      <svg viewBox="0 0 24 24" className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  ) : (
                    <Button type="submit" disabled={status === 'submitting'} className="px-7 disabled:opacity-60">
                      {status === 'submitting' ? (
                        <>
                          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>Submit Nomination 🏆</>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
