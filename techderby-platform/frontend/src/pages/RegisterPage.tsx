import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { useAuth } from '../contexts/AuthContext';
import { trackAnalyticsEvent } from '../lib/analytics';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

function PasswordStrength({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  if (!password) return null;
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-slate-200'}`} />
        ))}
      </div>
      <span className={`text-[11px] font-semibold ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-orange-500' : score === 3 ? 'text-yellow-600' : 'text-emerald-600'}`}>
        {labels[score]}
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Username can only contain letters, numbers, and underscores';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    setServerError('');
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
      });
      trackAnalyticsEvent('member_registration_complete');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ?? 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageSeo title="Join Tech Derby | Create your account" description="Create your Tech Derby member account." />

      <div className="flex min-h-screen bg-slate-950">
        {/* ── Left panel ── */}
        <div className="hidden w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-12 lg:flex">
          <Link to="/">
            <img src={brandLogo} alt="Tech Derby" className="h-8 w-auto" />
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Welcome to the community</p>
            <h2 className="mt-4 text-3xl font-black text-white leading-tight">
              Derby's tech community<br />starts here.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Join 2,500+ developers, designers, founders, and tech professionals building careers and connections across Derby and the Midlands.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: '🗓️', title: 'Priority event access', desc: 'Early tickets for meetups and special events' },
                { icon: '🤝', title: 'Community directory', desc: 'Find and connect with other members' },
                { icon: '💬', title: 'Direct messaging', desc: 'Chat privately with your connections' },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">{b.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{b.title}</p>
                    <p className="text-xs text-white/50">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/30">© {new Date().getFullYear()} Tech Derby</p>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link to="/" className="mb-8 flex justify-center lg:hidden">
              <img src={brandLogo} alt="Tech Derby" className="h-7 w-auto" />
            </Link>

            <h1 className="text-2xl font-black text-white">Create your account</h1>
            <p className="mt-1 text-sm text-white/50">
              Already a member?{' '}
              <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                Sign in
              </Link>
            </p>

            {serverError ? (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="First name" error={errors.firstName}>
                  <StyledInput
                    placeholder="Jane"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(v) => set('firstName', v)}
                    hasError={!!errors.firstName}
                  />
                </FormField>
                <FormField label="Last name" error={errors.lastName}>
                  <StyledInput
                    placeholder="Doe"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(v) => set('lastName', v)}
                    hasError={!!errors.lastName}
                  />
                </FormField>
              </div>

              <FormField label="Email address" error={errors.email}>
                <StyledInput
                  type="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(v) => set('email', v)}
                  hasError={!!errors.email}
                />
              </FormField>

              <FormField label="Username" hint="Letters, numbers, underscores only (saved in lowercase)" error={errors.username}>
                <StyledInput
                  placeholder="jane_doe"
                  autoComplete="username"
                  value={form.username}
                  onChange={(v) => set('username', v.toLowerCase())}
                  hasError={!!errors.username}
                />
              </FormField>

              <FormField label="Password" error={errors.password}>
                <StyledInput
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(v) => set('password', v)}
                  hasError={!!errors.password}
                />
                <PasswordStrength password={form.password} />
              </FormField>

              <FormField label="Confirm password" error={errors.confirmPassword}>
                <StyledInput
                  type="password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(v) => set('confirmPassword', v)}
                  hasError={!!errors.confirmPassword}
                />
              </FormField>

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-sky-500"
                    checked={form.agreeTerms}
                    onChange={(e) => set('agreeTerms', e.target.checked)}
                  />
                  <span className="text-xs text-white/60 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/code-of-conduct" className="text-sky-400 hover:underline" target="_blank">
                      Code of Conduct
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-sky-400 hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms ? (
                  <p className="mt-1 text-xs text-red-400">{errors.agreeTerms}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition hover:bg-orange-400 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Creating account…
                  </span>
                ) : (
                  'Create my account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function FormField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1 text-[11px] text-white/35">{hint}</p> : null}
      {error ? <p className="mt-1 text-[11px] text-red-400">{error}</p> : null}
    </div>
  );
}

function StyledInput({
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  hasError,
}: {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-11 w-full rounded-xl border bg-white/5 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:ring-2 ${
        hasError
          ? 'border-red-500/60 focus:ring-red-500/30'
          : 'border-white/10 focus:border-sky-500/60 focus:ring-sky-500/20'
      }`}
    />
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  );
}
