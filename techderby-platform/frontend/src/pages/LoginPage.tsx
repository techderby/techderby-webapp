import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { useAuth } from '../contexts/AuthContext';
import brandLogo from '../assets/images/techderbywhitelogo.webp';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? '/dashboard';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await login({ identifier: identifier.trim(), password }, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message;
      setError(msg === 'Invalid identifier or password' ? 'Incorrect username or password.' : (msg ?? 'Login failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageSeo title="Sign in | Tech Derby" description="Sign in to your Tech Derby member account." />

      <div className="flex min-h-screen bg-slate-950">
        {/* ── Left panel ── */}
        <div className="hidden w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-12 lg:flex">
          <Link to="/">
            <img src={brandLogo} alt="Tech Derby" className="h-8 w-auto" />
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Member portal</p>
            <h2 className="mt-4 text-3xl font-black text-white leading-tight">
              Good to have<br />you back.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Sign in to access your member dashboard, connect with the community, and stay updated on everything happening in Derby's tech scene.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: '2,500+', label: 'Members' },
                { value: '150+', label: 'Events / year' },
                { value: '80+', label: 'Partners' },
                { value: '10+', label: 'Years running' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{s.label}</p>
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

            <h1 className="text-2xl font-black text-white">Sign in</h1>
            <p className="mt-1 text-sm text-white/50">
              New to Tech Derby?{' '}
              <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                Create an account
              </Link>
            </p>

            {error ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <svg className="h-4 w-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
                  Username or email
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="your_username"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe((v) => !v)}
                  className={`relative h-5 w-5 shrink-0 rounded-md border transition-all ${
                    rememberMe
                      ? 'border-sky-500 bg-sky-500'
                      : 'border-white/20 bg-white/5 hover:border-white/35'
                  }`}
                >
                  {rememberMe && (
                    <svg className="absolute inset-0 m-auto h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-white/55 select-none" onClick={() => setRememberMe((v) => !v)} style={{ cursor: 'pointer' }}>
                  Remember me
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition hover:bg-orange-400 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-8 rounded-xl border border-white/8 bg-white/3 p-4">
              <p className="text-xs text-white/40 text-center">
                By signing in you agree to our{' '}
                <Link to="/privacy-policy" className="text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link to="/code-of-conduct" className="text-white/60 hover:text-white transition-colors">
                  Code of Conduct
                </Link>
              </p>
            </div>
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

