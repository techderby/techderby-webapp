import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { RichArticleEditor } from '../../components/editor/RichArticleEditor';
import { apiClient } from '../../lib/api';
import { assetUrl } from '../../lib/asset-url';
import { articleContentForEditor } from '../../lib/article-content';
import { sanitizeMediaUrl } from '../../lib/html-sanitizer';
import { ARTICLE_CATEGORIES_BY_GROUP } from '../../constants/article-categories';
import { useAuth } from '../../contexts/AuthContext';
import type { Insight } from '../../types/content';

const CATEGORIES = ARTICLE_CATEGORIES_BY_GROUP;
const EMPTY = { title: '', excerpt: '', category: 'News - Technology', tags: '', content: '<p></p>' };
const input = 'mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-500/60';

export default function ArticleEditorPage() {
  const { documentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const role = user?.memberRole ?? 'member';
  const isAdmin = role === 'admin' || role === 'super-admin';
  const query = useQuery<{ data: Insight[] }>({
    queryKey: ['article-editor', role],
    queryFn: async () => {
      if (isAdmin) {
        const response = await apiClient.getEditorialAdminOverview();
        return { data: (response.data?.articles ?? []) as Insight[] };
      }
      return apiClient.getMyArticles().then((response) => response.data);
    },
    enabled: Boolean(documentId),
  });
  const article = query.data?.data?.find((item) => item.documentId === documentId);

  useEffect(() => {
    if (!article) return;
    setForm({
      title: article.title,
      excerpt: article.excerpt ?? '',
      category: article.category,
      tags: article.tags.join(', '),
      content: articleContentForEditor(article.content, article.contentFormat),
    });
  }, [article]);

  const preview = useMemo(
    () => sanitizeMediaUrl(image ? URL.createObjectURL(image) : assetUrl(article?.featuredImageUrl || article?.featuredImage)),
    [image, article],
  );
  useEffect(() => () => { if (image && preview) URL.revokeObjectURL(preview); }, [image, preview]);

  async function uploadInlineImages(files: File[]) {
    if (!files.length) return [];
    setError('');
    try {
      const response = await apiClient.uploadArticleAssets(files);
      return (response.data?.data as string[]).map(assetUrl);
    } catch (uploadError) {
      setError(axios.isAxiosError(uploadError) ? uploadError.response?.data?.error?.message ?? 'Could not upload inline image.' : 'Could not upload inline image.');
      return [];
    }
  }

  async function save(event: FormEvent, action: 'draft' | 'submit' | 'publish') {
    event.preventDefault();
    if (!documentId && !image) {
      setError('Select a featured image.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append('contentFormat', 'html');
      if (image) payload.append('featuredImage', image);
      const response = documentId ? await apiClient.updateArticle(documentId, payload) : await apiClient.createArticle(payload);
      const saved = response.data?.data as Insight;
      if (action === 'submit' && saved.documentId) await apiClient.submitArticle(saved.documentId);
      if (action === 'publish' && saved.documentId) await apiClient.reviewArticle(saved.documentId, 'published', '');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-articles'] }),
        queryClient.invalidateQueries({ queryKey: ['articles-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['editorial-admin'] }),
      ]);
      navigate('/dashboard/articles');
    } catch (saveError) {
      setError(axios.isAxiosError(saveError) ? saveError.response?.data?.error?.message ?? 'Could not save article.' : 'Could not save article.');
    } finally {
      setSaving(false);
    }
  }

  if (documentId && query.isLoading) return <div className="p-10 text-sm text-white/45">Loading article…</div>;
  if (documentId && !query.isLoading && !article) return <div className="p-10 text-sm text-red-300">Article not found.</div>;

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard/articles" className="text-sm font-semibold text-sky-400">← Back to articles</Link>
        <h1 className="mt-4 text-3xl font-black text-white">{documentId ? 'Edit article' : 'Write an article'}</h1>
        <p className="mt-2 text-sm text-white/45">Create and format your article visually. The editor preview matches the published article.</p>

        <form className="mt-7 space-y-6">
          <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-2">
            <label className="text-sm font-semibold text-white/70 md:col-span-2">Title *<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} /></label>
            <label className="text-sm font-semibold text-white/70 md:col-span-2">Excerpt *<textarea required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={`${input} min-h-24`} /></label>
            <label className="text-sm font-semibold text-white/70">
              Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>
                {Object.entries(CATEGORIES).map(([group, options]) => (
                  <optgroup key={group} label={group} className="bg-slate-900">
                    {options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-white/70">Tags<input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={input} placeholder="AI, Derby, React, leadership" /></label>

            <div className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-white/70">Article content *</span>
              <RichArticleEditor
                value={form.content}
                disabled={saving}
                onChange={(content) => setForm((current) => ({ ...current, content }))}
                onUploadImages={uploadInlineImages}
              />
            </div>
          </section>

          <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-2 md:items-center">
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 text-center text-sm text-white/50">
              <strong className="text-white">Choose featured image</strong>
              <span className="mt-1 text-xs">Used on The Wire listing and article header · 8 MB maximum</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
            </label>
            <div className="aspect-video overflow-hidden rounded-xl bg-white/5">{preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : null}</div>
          </section>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" disabled={saving} onClick={(e) => save(e as unknown as FormEvent, 'draft')} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/70 hover:bg-white/5">Save draft</button>
            <button type="button" disabled={saving} onClick={(e) => save(e as unknown as FormEvent, isAdmin ? 'publish' : 'submit')} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">{saving ? 'Saving…' : isAdmin ? 'Publish article' : 'Submit for review'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
