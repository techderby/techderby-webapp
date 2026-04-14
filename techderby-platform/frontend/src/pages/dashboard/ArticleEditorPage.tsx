import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { RichEditor } from '../../components/RichEditor';
import { cn } from '../../lib/utils';
import type { Article } from '../../types/content';

const TAGS_SUGGESTIONS = [
  'AI', 'Cloud', 'DevOps', 'Web Development', 'Mobile', 'Startup', 'Career', 'Leadership',
  'Open Source', 'Security', 'Data Science', 'Design', 'Engineering Culture', 'East Midlands',
  'Tech Derby', 'Product', 'Finance Tech', 'Green Tech',
];

type SaveState = 'saved' | 'saving' | 'unsaved' | 'error';

function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <span className={cn(
      'flex items-center gap-1.5 text-xs font-medium transition-all',
      state === 'saved'   && 'text-emerald-400',
      state === 'saving'  && 'text-white/40',
      state === 'unsaved' && 'text-amber-400',
      state === 'error'   && 'text-red-400',
    )}>
      {state === 'saving' && <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/20 border-t-white/60" />}
      {state === 'saved'  && (
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
      )}
      {state === 'unsaved' && <span className="h-2 w-2 rounded-full bg-amber-400" />}
      {state === 'error'   && <span className="h-2 w-2 rounded-full bg-red-400" />}
      {{
        saved: 'Saved',
        saving: 'Saving…',
        unsaved: 'Unsaved changes',
        error: 'Save failed',
      }[state]}
    </span>
  );
}

export default function ArticleEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEditing = Boolean(id);

  const [title, setTitle]           = useState('');
  const [excerpt, setExcerpt]       = useState('');
  const [coverUrl, setCoverUrl]     = useState('');
  const [tags, setTags]             = useState<string[]>([]);
  const [tagInput, setTagInput]     = useState('');
  const [content, setContent]       = useState<Record<string, unknown>>({});
  const [saveState, setSaveState]   = useState<SaveState>('saved');
  const [articleId, setArticleId]   = useState<number | null>(id ? parseInt(id, 10) : null);
  const [showMeta, setShowMeta]     = useState(false);
  const [submitConfirm, setSubmitConfirm] = useState(false);

  // ── Load existing article ─────────────────────────────────────────────────
  const { isLoading } = useQuery<Article>({
    queryKey: ['article', articleId],
    queryFn: () => apiClient.getArticleById(articleId!).then((r) => r.data),
    enabled: Boolean(isEditing && articleId),
    refetchOnWindowFocus: false,
    onSuccess: (data: Article) => {
      setTitle(data.title ?? '');
      setExcerpt(data.excerpt ?? '');
      setCoverUrl(data.coverImageUrl ?? '');
      setTags(data.tags ?? []);
      setContent((data.content ?? {}) as Record<string, unknown>);
    },
  } as any);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (payload: { title: string; excerpt: string; content: object; tags: string[]; coverImageUrl: string }) => {
      if (articleId) {
        return apiClient.updateArticle(articleId, payload).then((r) => r.data);
      } else {
        return apiClient.createArticle(payload).then((r) => r.data);
      }
    },
    onMutate: () => setSaveState('saving'),
    onSuccess: (data: Article) => {
      setSaveState('saved');
      if (!articleId) {
        setArticleId(data.id);
        navigate(`/dashboard/author/articles/${data.id}/edit`, { replace: true });
        qc.invalidateQueries({ queryKey: ['myArticles'] });
      }
    },
    onError: () => setSaveState('error'),
  });

  const submitMutation = useMutation({
    mutationFn: () => apiClient.submitArticle(articleId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myArticles'] });
      navigate('/dashboard/author/articles');
    },
  });

  // Debounced auto-save
  useEffect(() => {
    if (!title.trim()) return;
    setSaveState('unsaved');
    const t = setTimeout(() => {
      saveMutation.mutate({ title, excerpt, content, tags, coverImageUrl: coverUrl });
    }, 1500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, excerpt, content, tags, coverUrl]);

  const handleContentChange = useCallback((c: Record<string, unknown>) => {
    setContent(c);
  }, []);

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (clean && !tags.includes(clean)) setTags((prev) => [...prev, clean]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  if (isLoading && isEditing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#07090f]">

      {/* ── Top bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#09090f] px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/author/articles')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/8 hover:text-white/70"
            aria-label="Back to articles"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs font-semibold text-white/40">
            {isEditing ? 'Edit Article' : 'New Article'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SaveIndicator state={saveState} />

          <button
            type="button"
            onClick={() => setShowMeta((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              showMeta ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/6 hover:text-white/70',
            )}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
            Settings
          </button>

          <button
            type="button"
            onClick={() => { saveMutation.mutate({ title, excerpt, content, tags, coverImageUrl: coverUrl }); }}
            disabled={!title.trim() || saveMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save
          </button>

          <button
            type="button"
            onClick={() => setSubmitConfirm(true)}
            disabled={!articleId || !title.trim()}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold text-white transition',
              articleId && title.trim()
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md shadow-sky-500/20 hover:shadow-sky-500/35'
                : 'bg-white/10 cursor-not-allowed opacity-50',
            )}
          >
            Submit for Review
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Editor area ── */}
        <main className="flex flex-1 flex-col overflow-hidden">

          {/* Title */}
          <div className="border-b border-white/[0.05] px-8 py-4 md:px-16">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title…"
              maxLength={150}
              aria-label="Article title"
              className="w-full bg-transparent text-2xl font-black text-white placeholder:text-white/15 outline-none md:text-3xl"
            />
            {title && (
              <div className="mt-1.5 flex items-center gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-sky-400/60 hover:text-sky-300" aria-label={`Remove tag ${tag}`}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rich editor */}
          <div className="flex-1 overflow-hidden">
            <RichEditor
              content={Object.keys(content).length > 0 ? content : undefined}
              onChange={handleContentChange}
              placeholder="Tell your story… Start with an idea, a problem you've solved, or something the East Midlands tech community should know."
              className="h-full rounded-none border-0"
              minHeight={0}
            />
          </div>
        </main>

        {/* ── Meta sidebar panel ── */}
        {showMeta && (
          <aside className="w-72 shrink-0 overflow-y-auto border-l border-white/[0.06] bg-[#09090f] p-5">
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.15em] text-white/40">Article Settings</h3>

            {/* Cover Image */}
            <div className="mb-5">
              <label htmlFor="cover-url" className="mb-1.5 block text-xs font-semibold text-white/70">Cover Image URL</label>
              {coverUrl && (
                <div className="mb-2 overflow-hidden rounded-lg">
                  <img src={coverUrl} alt="Cover preview" className="h-28 w-full object-cover" />
                </div>
              )}
              <input
                id="cover-url"
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25"
              />
            </div>

            {/* Excerpt */}
            <div className="mb-5">
              <label htmlFor="excerpt" className="mb-1.5 block text-xs font-semibold text-white/70">Excerpt</label>
              <p className="mb-1.5 text-[10px] text-white/30">A short description shown in article cards.</p>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={280}
                placeholder="Brief summary of your article…"
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25"
              />
              <p className="mt-0.5 text-right text-[10px] text-white/25">{excerpt.length}/280</p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tag-input" className="mb-1.5 block text-xs font-semibold text-white/70">Tags</label>

              {/* Current tags */}
              {tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-sky-400/50 hover:text-sky-300 leading-none" aria-label={`Remove tag ${tag}`}>×</button>
                    </span>
                  ))}
                </div>
              )}

              <input
                id="tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
                  if (e.key === 'Backspace' && !tagInput && tags.length > 0) removeTag(tags[tags.length - 1]);
                }}
                placeholder="Add tag, press Enter…"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25"
              />

              {/* Suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                {TAGS_SUGGESTIONS.filter((s) => !tags.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addTag(s)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/40 transition hover:border-sky-500/25 hover:text-sky-400"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing tips */}
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/30">Writing Tips</p>
              <ul className="space-y-1.5 text-[10px] text-white/35">
                <li className="flex items-start gap-1.5"><span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-sky-500/50" />Aim for 800–2,000 words for best engagement</li>
                <li className="flex items-start gap-1.5"><span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-sky-500/50" />Break up text with H2/H3 headings every 300 words</li>
                <li className="flex items-start gap-1.5"><span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-sky-500/50" />Add a compelling cover image for more clicks</li>
                <li className="flex items-start gap-1.5"><span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-sky-500/50" />Include code examples for technical articles</li>
                <li className="flex items-start gap-1.5"><span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-sky-500/50" />End with a clear call-to-action or question</li>
              </ul>
            </div>
          </aside>
        )}
      </div>

      {/* ── Submit confirmation modal ── */}
      {submitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
            <h3 className="mb-2 text-base font-bold text-white">Submit for Review?</h3>
            <p className="mb-5 text-sm text-white/50">
              Your article will be sent to our editorial team. You won't be able to edit it until they review it (usually 1–3 days).
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { submitMutation.mutate(); setSubmitConfirm(false); }}
                disabled={submitMutation.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/35 disabled:opacity-60"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Article'}
              </button>
              <button
                type="button"
                onClick={() => setSubmitConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
