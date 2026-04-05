import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function NotFoundPage() {
  const error = useRouteError();
  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,165,233,0.12),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(249,115,22,0.10),transparent_50%)]" />

      <div className="relative z-10 max-w-lg">
        <p className="text-8xl font-black text-white/10 select-none">{is404 ? '404' : 'Oops'}</p>

        <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">
          {is404 ? "This page doesn't exist yet" : 'Something went wrong'}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-white/55">
          {is404
            ? "We're always building — this page may be coming soon, or the link might be wrong."
            : 'An unexpected error occurred. Try refreshing, or head back home.'}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-600"
          >
            Go to homepage
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
