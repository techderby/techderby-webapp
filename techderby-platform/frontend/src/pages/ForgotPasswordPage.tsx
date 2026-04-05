import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { apiClient } from '../lib/api';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await apiClient.forgotPassword(trimmed);
      setStatus('success');
    } catch (err: unknown) {
      // Strapi returns 200 even for unknown emails to prevent enumeration.
      // Show a generic error only for network/server failures.
      const code = (err as { response?: { status?: number } })?.response?.status;
      if (code && code < 500) {
        setStatus('success'); // surface as success to avoid email enumeration
      } else {
        setErrorMsg('Something went wrong. Please try again later.');
        setStatus('error');
      }
    }
  }

  return (
    <>
      <PageSeo title="Forgot password | Tech Derby" description="Reset your Tech Derby account password." />

      <div className="flex min-h-screen bg-slate-950">
        {/* ── Left panel ── */}
        <div className="hidden w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-12 lg:flex">
          <Link to="/">
            <img src={brandLogo} alt="Tech Derby" className="h-8 w-auto" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Password reset</p>
            <h2 className="mt-4 text-3xl font-black text-white leading-tight">
              Locked out?<br />No worries.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Enter the email address linked to your account and we'll send you a secure link to reset your password.
            </p>
            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" />
                </svg>
                <p className="text-sm text-white/50">
                  If no email arrives within a few minutes, check your spam folder or contact{' '}
                  <a href="mailto:hello@techderby.co.uk" className="text-sky-400 hover:text-sky-300 transition-colors">
                    hello@techderby.co.uk
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Tech Derby</p>
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link to="/" className="mb-8 flex justify-center lg:hidden">
              <img src={brandLogo} alt="Tech Derby" className="h-7 w-auto" />
            </Link>

            {status === 'success' ? (
              /* ── Success state ── */
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                  <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.78h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.55 5.55l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17.22z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black text-white">Check your inbox</h1>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  If <span className="font-semibold text-white/70">{email}</span> is linked to an account, you'll receive a password reset link shortly.
                </p>
                <p className="mt-2 text-xs text-white/35">
                  Didn't get it? Check your spam folder.
                </p>
                <Link
                  to="/login"
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-white/8 px-6 text-sm font-semibold text-white/80 transition hover:bg-white/12 hover:text-white"
                >
                  Back to sign in
                </Link>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <h1 className="text-2xl font-black text-white">Forgot your password?</h1>
                <p className="mt-1 text-sm text-white/50">
                  Remembered it?{' '}
                  <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                    Sign in
                  </Link>
                </p>

                {errorMsg ? (
                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                    <svg className="h-4 w-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                    </svg>
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
                      Email address
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition hover:bg-orange-400 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <Spinner />
                        Sending…
                      </span>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
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
