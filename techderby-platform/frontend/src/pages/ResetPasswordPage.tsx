import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { apiClient } from '../lib/api';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Validate password strength
  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) {
      setErrorMsg('Invalid or missing reset link. Please request a new one.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await apiClient.resetPassword(code, password, confirm);
      setStatus('success');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      if (msg?.toLowerCase().includes('code')) {
        setErrorMsg('This reset link has expired or already been used. Please request a new one.');
      } else {
        setErrorMsg(msg ?? 'Failed to reset password. Please try again.');
      }
      setStatus('error');
    }
  }

  if (!code) {
    return (
      <>
        <PageSeo title="Reset password | Tech Derby" description="Reset your Tech Derby account password." />
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-white">Invalid reset link</h1>
            <p className="mt-2 text-sm text-white/50">
              This link is missing a reset code. Please request a new password reset.
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              Request new link
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSeo title="Reset password | Tech Derby" description="Set a new password for your Tech Derby account." />

      <div className="flex min-h-screen bg-slate-950">
        {/* ── Left panel ── */}
        <div className="hidden w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-12 lg:flex">
          <Link to="/">
            <img src={brandLogo} alt="Tech Derby" className="h-8 w-auto" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Password reset</p>
            <h2 className="mt-4 text-3xl font-black text-white leading-tight">
              Choose a strong<br />new password.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Pick something memorable but hard to guess. We recommend using a passphrase or a password manager.
            </p>
            <div className="mt-10 space-y-3">
              {[
                'At least 8 characters',
                'Mix of upper & lowercase',
                'Include numbers or symbols',
              ].map((tip) => (
                <div key={tip} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15">
                    <svg className="h-3 w-3 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-white/55">{tip}</p>
                </div>
              ))}
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black text-white">Password updated!</h1>
                <p className="mt-3 text-sm text-white/55">
                  Your password has been changed successfully. Redirecting you to sign in…
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  Sign in now
                </Link>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <h1 className="text-2xl font-black text-white">Set new password</h1>
                <p className="mt-1 text-sm text-white/50">
                  Enter and confirm your new password below.
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
                  {/* New password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div className="mt-2.5 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score
                                  ? strength.score <= 1 ? 'bg-red-500'
                                  : strength.score === 2 ? 'bg-orange-400'
                                  : strength.score === 3 ? 'bg-yellow-400'
                                  : 'bg-emerald-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-semibold ${
                          strength.score <= 1 ? 'text-red-400'
                          : strength.score === 2 ? 'text-orange-400'
                          : strength.score === 3 ? 'text-yellow-400'
                          : 'text-emerald-400'
                        }`}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setErrorMsg(''); }}
                        className={`h-11 w-full rounded-xl border bg-white/5 px-4 pr-11 text-sm text-white placeholder:text-white/25 outline-none transition focus:ring-2 ${
                          confirm.length > 0 && confirm !== password
                            ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                            : 'border-white/10 focus:border-sky-500/60 focus:ring-sky-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {confirm.length > 0 && confirm !== password && (
                      <p className="mt-1.5 text-xs text-red-400">Passwords do not match.</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition hover:bg-orange-400 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <Spinner />
                        Updating…
                      </span>
                    ) : (
                      'Update password'
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStrength(pwd: string): { score: number; label: string } {
  if (!pwd) return { score: 0, label: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score: Math.max(score, 1), label: labels[Math.min(score, 4)] };
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
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
