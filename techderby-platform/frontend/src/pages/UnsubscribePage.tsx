import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../lib/api';

const REASONS = [
  { value: 'too-many-emails', label: 'I receive too many emails' },
  { value: 'content-not-relevant', label: 'The content is not relevant to me' },
  { value: 'no-longer-interested', label: 'I am no longer interested' },
  { value: 'did-not-sign-up', label: 'I do not remember signing up' },
  { value: 'privacy-concerns', label: 'I have privacy concerns' },
  { value: 'other', label: 'Another reason' },
];

type UnsubscribeDetails = {
  email: string;
  status: 'subscribed' | 'unsubscribed';
  unsubscribedAt?: string | null;
};

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [details, setDetails] = useState<UnsubscribeDetails | null>(null);
  const [reason, setReason] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Unsubscribe | Tech Derby';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setError('This unsubscribe link is incomplete. Please use the link in your Tech Derby email.');
      setIsLoading(false);
      return;
    }

    apiClient.getMailingListUnsubscribeDetails(token)
      .then((response) => {
        const loaded = response.data as UnsubscribeDetails;
        setDetails(loaded);
        if (loaded.status === 'unsubscribed') setIsComplete(true);
      })
      .catch(() => setError('This unsubscribe link is invalid or no longer available.'))
      .finally(() => setIsLoading(false));
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!reason) {
      setError('Please select a reason. Your feedback helps us improve.');
      return;
    }
    if (reason === 'other' && !reasonDetails.trim()) {
      setError('Please tell us your reason for unsubscribing.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.unsubscribeFromMailingList(token, reason, reasonDetails.trim());
      setIsComplete(true);
    } catch (submitError) {
      setError(
        axios.isAxiosError(submitError)
          ? submitError.response?.data?.error?.message ?? 'We could not process your request. Please try again.'
          : 'We could not process your request. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-slate-950 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/30">
        <div className="h-1.5 bg-sky-500" />
        <div className="p-7 sm:p-10">
          <Link to="/" className="text-sm font-bold text-sky-700 hover:text-sky-600">← Tech Derby home</Link>

          {isLoading ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-slate-500">Checking your unsubscribe link…</p>
            </div>
          ) : isComplete ? (
            <div className="py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700" aria-hidden="true">✓</div>
              <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">You have been unsubscribed</h1>
              <p className="mt-4 leading-7 text-slate-600">
                We will no longer send mailing-list announcements to <strong className="text-slate-900">{details?.email}</strong>.
                Transactional messages you specifically request are not affected.
              </p>
              <p className="mt-5 text-sm text-slate-500">
                Changed your mind? You can subscribe again from the Tech Derby website at any time.
              </p>
              <Link to="/" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
                Return to Tech Derby
              </Link>
            </div>
          ) : error && !details ? (
            <div className="py-8">
              <h1 className="text-3xl font-black tracking-tight text-slate-950">We could not open this link</h1>
              <p className="mt-4 leading-7 text-slate-600">{error}</p>
              <Link to="/contact" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
                Contact Tech Derby
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mt-7 text-3xl font-black tracking-tight text-slate-950">Unsubscribe from our mailing list</h1>
              <p className="mt-3 leading-7 text-slate-600">
                Confirm the email address and tell us why you are leaving. We use this feedback to improve our communications.
              </p>

              <form className="mt-8 space-y-6" onSubmit={submit}>
                <label className="block text-sm font-bold text-slate-800">
                  Email address
                  <input
                    type="email"
                    readOnly
                    value={details?.email ?? ''}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-700 outline-none"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-800">
                  Why are you unsubscribing?
                  <select
                    required
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    <option value="">Select a reason…</option>
                    {REASONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-bold text-slate-800">
                  Additional feedback {reason === 'other' ? '(required)' : '(optional)'}
                  <textarea
                    value={reasonDetails}
                    onChange={(event) => setReasonDetails(event.target.value)}
                    required={reason === 'other'}
                    maxLength={1_000}
                    rows={4}
                    placeholder="Tell us anything else that would help us improve."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  <span className="mt-1 block text-right text-xs font-normal text-slate-400">{reasonDetails.length}/1,000</span>
                </label>

                {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? 'Removing you…' : 'Confirm unsubscribe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
