import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import grapesjs, { type Editor } from 'grapesjs';
import newsletterPreset from 'grapesjs-preset-newsletter';
import axios from 'axios';
import 'grapesjs/dist/css/grapes.min.css';
import { apiClient } from '../lib/api';
import type { MailingListSegment } from '../constants/mailing-list';

// Increment when the base template changes so stale browser drafts do not
// override a newly deployed branded template. Older drafts remain untouched.
const DRAFT_KEY = 'td_newsletter_draft_v2';
const BRAND_LOGO_URL = `${String(import.meta.env.VITE_API_URL ?? 'http://localhost:1337').replace(/\/$/, '')}/techderbywhitelogo.webp`;

const DEFAULT_CONTENT = `
<table data-td-newsletter-shell="true" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:32px 16px;font-family:Arial,'Helvetica Neue',sans-serif;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 36px rgba(15,23,42,0.12);">
        <tr><td style="height:5px;background:#0ea5e9;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="background:#0f172a;padding:28px 36px;color:#ffffff;">
            <img data-td-brand-logo="true" src="${BRAND_LOGO_URL}" width="150" alt="Tech Derby" style="display:block;width:150px;max-width:100%;height:auto;border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:38px 36px 18px;">
            <p style="margin:0 0 12px;color:#0284c7;font-size:12px;line-height:18px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase;">Tech Derby community update</p>
            <h1 style="margin:0;color:#0f172a;font-size:34px;line-height:42px;font-weight:800;">Your newsletter headline</h1>
            <p style="margin:18px 0 0;color:#475569;font-size:16px;line-height:26px;">Use this opening section to introduce the most important update for Derby's tech community.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 36px 38px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
              <tr>
                <td style="padding:24px;">
                  <h2 style="margin:0 0 12px;color:#0f172a;font-size:22px;line-height:29px;">Featured update</h2>
                  <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:24px;">Add your news, opportunities, programme announcements, community stories, or upcoming events here. Drag more blocks into this content area as needed.</p>
                  <a href="https://techderby.org" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-size:14px;line-height:20px;font-weight:800;padding:13px 22px;border-radius:9px;">Read more&nbsp;&nbsp;&rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td data-td-brand-footer="true" style="background:#0f172a;padding:26px 36px;">
            <p style="margin:0 0 8px;color:#ffffff;font-size:14px;line-height:21px;font-weight:700;">Learn. Connect. Build Derby's tech future.</p>
            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:19px;">You received this email because you joined the Tech Derby mailing list.</p>
            <p style="margin:10px 0 0;color:#64748b;font-size:12px;line-height:18px;">&copy; Tech Derby &middot; <a href="https://techderby.org" style="color:#38bdf8;text-decoration:none;">Visit our website</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

type StoredDraft = {
  subject?: string;
  project?: Record<string, unknown>;
};

type SendResult = {
  segments?: Array<{ id: number; name: string }>;
  total: number;
  sent: number;
  failed: number;
};

function buildCompactEmailHtml(editor: Editor) {
  const body = editor.getHtml({ cleanId: true });
  const css = editor.getCss({ avoidProtected: true, onlyMatched: true });
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${body}</body></html>`
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim();
}

function readDraft(): StoredDraft {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}') as StoredDraft;
  } catch {
    return {};
  }
}

export default function NewsletterComposerPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const initialDraftRef = useRef<StoredDraft>(readDraft());
  const subjectRef = useRef(initialDraftRef.current.subject ?? '');
  const [subject, setSubject] = useState(subjectRef.current);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [segments, setSegments] = useState<MailingListSegment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving'>('saved');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  useEffect(() => {
    apiClient
      .getMailingListSubscriptionsAdmin()
      .then((response) => setSubscriberCount(Array.isArray(response.data) ? response.data.length : 0))
      .catch(() => setError('Could not load the current subscriber count.'));

    apiClient
      .getMailingListSegmentsForAdmin()
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setSegments(data);
        const allUsersSegment = data.find((segment: MailingListSegment) => segment.includeAll);
        if (allUsersSegment) {
          setSelectedSegments([allUsersSegment.id]);
        }
      })
      .catch(() => setError('Could not load mailing list segments.'));
  }, []);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: '68vh',
      fromElement: false,
      storageManager: false,
      plugins: [newsletterPreset],
      pluginsOpts: {
        [newsletterPreset as unknown as string]: {
          inlineCss: true,
          modalLabelImport: 'Paste HTML email content here',
        },
      },
      components: initialDraftRef.current.project ? undefined : DEFAULT_CONTENT,
      projectData: initialDraftRef.current.project,
      assetManager: {
        upload: `${import.meta.env.VITE_API_URL ?? 'http://localhost:1337'}/api/mailing-list-subscriptions/newsletter-assets`,
        uploadName: 'files',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('td_jwt') || localStorage.getItem('td_jwt') || ''}`,
        },
        autoAdd: true,
        embedAsBase64: false,
      },
    });

    editorRef.current = editor;

    const saveDraft = () => {
      setDraftStatus('saving');
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            subject: subjectRef.current,
            project: editor.getProjectData(),
          }),
        );
        setDraftStatus('saved');
      }, 500);
    };

    editor.on('update', saveDraft);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    subjectRef.current = subject;
    if (!editorRef.current) return;
    setDraftStatus('saving');
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          subject,
          project: editorRef.current?.getProjectData(),
        }),
      );
      setDraftStatus('saved');
    }, 500);
  }, [subject]);

  function validateNewsletter() {
    setError(null);
    setResult(null);
    if (!subject.trim()) {
      setError('Enter an email subject before sending.');
      return false;
    }
    if (subscriberCount === 0) {
      setError('There are no subscribers in the mailing list.');
      return false;
    }
    if (!editorRef.current?.getHtml().trim()) {
      setError('Add some content to the newsletter before sending.');
      return false;
    }
    const emailHtml = buildCompactEmailHtml(editorRef.current);
    if (/&lt;img\b/i.test(emailHtml)) {
      setError('An image was inserted as text. Remove it, drag in an Image block, then upload the image through its asset manager.');
      return false;
    }
    if (/<img\b[^>]*\bsrc\s*=\s*["']data:image\//i.test(emailHtml)) {
      setError('Embedded images cannot be sent reliably. Remove the image and upload it through an Image block.');
      return false;
    }
    return true;
  }

  function startSend() {
    if (validateNewsletter()) setIsConfirming(true);
  }

  async function sendNewsletter() {
    const editor = editorRef.current;
    if (!editor || !validateNewsletter()) return;

    setIsConfirming(false);
    setIsSending(true);

    try {
      const compactHtml = buildCompactEmailHtml(editor);
      const response = await apiClient.sendNewsletterForAdmin(subject.trim(), compactHtml, selectedSegments);
      const sendResult = response.data as SendResult;
      setResult(sendResult);
      if (sendResult.failed === 0) {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (sendError) {
      const message = axios.isAxiosError(sendError)
        ? sendError.response?.data?.error?.message
        : null;
      setError(message ?? 'The newsletter could not be sent. Your draft has been preserved.');
    } finally {
      setIsSending(false);
    }
  }

  function resetDraft() {
    if (!window.confirm('Clear this draft and start again?')) return;
    localStorage.removeItem(DRAFT_KEY);
    setSubject('');
    editorRef.current?.setComponents(DEFAULT_CONTENT);
    editorRef.current?.setStyle('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/dashboard/mailing-list" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300">
            <span aria-hidden="true">←</span> Back to mailing list
          </Link>
          <h1 className="text-2xl font-black text-white">Create Newsletter</h1>
          <p className="mt-1 text-sm text-white/40">Drag and drop sections, click content to edit it, then send to all subscribers.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/35">
            {draftStatus === 'saving' ? 'Saving draft…' : 'Draft saved locally'}
          </span>
          <button type="button" onClick={resetDraft} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/50 transition hover:bg-white/5 hover:text-white">
            Clear draft
          </button>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="newsletter-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
              Email subject
            </label>
            <input
              id="newsletter-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={200}
              placeholder="e.g. What’s happening in Derby tech this month"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div className="flex items-center justify-between gap-5 rounded-xl border border-white/8 bg-black/10 px-4 py-2.5 lg:justify-start">
            <span className="text-xs text-white/40">Subscribers</span>
            <span className="text-sm font-bold text-white">{subscriberCount}</span>
          </div>
          <button
            type="button"
            onClick={startSend}
            disabled={isSending || subscriberCount === 0}
            className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? 'Sending…' : 'Review and send'}
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Target segments</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {segments.map((segment) => {
              const selected = selectedSegments.includes(segment.id);
              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => {
                    if (segment.includeAll) {
                      setSelectedSegments([segment.id]);
                      return;
                    }

                    setSelectedSegments((current) => {
                      const allUsers = segments.find((entry) => entry.includeAll)?.id;
                      const withoutAll = allUsers ? current.filter((entry) => entry !== allUsers) : current;
                      if (withoutAll.includes(segment.id)) {
                        const next = withoutAll.filter((entry) => entry !== segment.id);
                        return next.length ? next : allUsers ? [allUsers] : [];
                      }
                      return [...withoutAll, segment.id];
                    });
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${selected ? 'border-sky-500/45 bg-sky-500/20 text-sky-200' : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  {segment.name} ({segment.subscriberCount})
                </button>
              );
            })}
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        {result ? (
          <p className={`mt-3 text-sm ${result.failed ? 'text-amber-300' : 'text-emerald-300'}`}>
            Sent to {result.sent} of {result.total} subscribers
            {result.failed ? `; ${result.failed} failed.` : '.'}
          </p>
        ) : null}
      </div>

      <div className="newsletter-builder overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        <div className="border-b border-white/10 bg-sky-500/10 px-4 py-3 text-xs text-sky-200">
          For images: drag an <strong>Image</strong> block into the email, double-click it, then upload or select the image. Do not paste image HTML into a text block.
        </div>
        <div ref={containerRef} />
      </div>

      {isConfirming ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="send-newsletter-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 id="send-newsletter-title" className="text-xl font-black text-white">Send this newsletter?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              “{subject.trim()}” will be sent to the selected segment audience. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsConfirming(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white">
                Keep editing
              </button>
              <button type="button" onClick={sendNewsletter} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-400">
                Send to everyone
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
