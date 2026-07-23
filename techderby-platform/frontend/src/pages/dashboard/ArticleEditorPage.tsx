import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '../../lib/api';
import { assetUrl } from '../../lib/asset-url';
import { ARTICLE_CATEGORIES_BY_GROUP } from '../../constants/article-categories';
import { useAuth } from '../../contexts/AuthContext';
import type { Insight } from '../../types/content';

const CATEGORIES = ARTICLE_CATEGORIES_BY_GROUP;
const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'plaintext'];
const EMPTY = { title: '', excerpt: '', category: 'News - Technology', tags: '', content: '' };
const input = 'mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-500/60';

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function previewMarkdown(markdown: string) {
  const segments = markdown.split(/(```[a-zA-Z0-9_+#.-]*\n[\s\S]*?```)/g);
  return segments.map((segment) => {
    const code = segment.match(/^```([a-zA-Z0-9_+#.-]*)\n([\s\S]*?)```$/);
    if (code) return `<div class="my-5 overflow-hidden rounded-xl bg-slate-950"><div class="border-b border-slate-700 px-4 py-2 text-xs font-bold uppercase text-slate-400">${escapeHtml(code[1] || 'text')}</div><pre class="overflow-x-auto p-5 text-sm leading-6 text-slate-100"><code>${escapeHtml(code[2])}</code></pre></div>`;
    return segment
      .split('\n')
      .map((line) => {
        const safe = escapeHtml(line)
          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 max-h-96 w-full rounded-xl object-contain" />')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sky-700 underline">$1</a>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono">$1</code>');
        if (/^### /.test(line)) return `<h3 class="mb-2 mt-6 text-xl font-black">${safe.slice(4)}</h3>`;
        if (/^## /.test(line)) return `<h2 class="mb-3 mt-7 text-2xl font-black">${safe.slice(3)}</h2>`;
        if (/^# /.test(line)) return `<h1 class="mb-4 mt-8 text-3xl font-black">${safe.slice(2)}</h1>`;
        if (/^[-*] /.test(line)) return `<div class="ml-5 list-item">${safe.slice(2)}</div>`;
        if (/^> /.test(line)) return `<blockquote class="my-4 border-l-4 border-sky-300 pl-4 italic text-slate-500">${safe.slice(2)}</blockquote>`;
        return line.trim() ? `<p class="mb-4 leading-8 text-slate-700">${safe}</p>` : '';
      })
      .join('');
  }).join('');
}

export default function ArticleEditorPage() {
  const { documentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inlineImageRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [uploadingInline, setUploadingInline] = useState(false);
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
      content: article.content,
    });
  }, [article]);

  const preview = useMemo(() => image ? URL.createObjectURL(image) : assetUrl(article?.featuredImageUrl || article?.featuredImage), [image, article]);
  useEffect(() => () => { if (image && preview) URL.revokeObjectURL(preview); }, [image, preview]);

  function insert(before: string, after = '', placeholder = 'text') {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? form.content.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = form.content.slice(start, end) || placeholder;
    const next = `${form.content.slice(0, start)}${before}${selected}${after}${form.content.slice(end)}`;
    setForm((current) => ({ ...current, content: next }));
    window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }

  function insertLine(prefix: string, placeholder: string) {
    insert(`\n${prefix}`, '\n', placeholder);
  }

  async function uploadInlineImages(files: File[]) {
    if (!files.length) return;
    setUploadingInline(true);
    setError('');
    try {
      const response = await apiClient.uploadArticleAssets(files);
      const urls = (response.data?.data as string[]).map(assetUrl);
      const markdown = urls.map((url, index) => `![${files[index]?.name.replace(/\.[^.]+$/, '') || 'Article image'}](${url})`).join('\n\n');
      insert('\n', '\n', markdown);
    } catch (uploadError) {
      setError(axios.isAxiosError(uploadError) ? uploadError.response?.data?.error?.message ?? 'Could not upload inline image.' : 'Could not upload inline image.');
    } finally {
      setUploadingInline(false);
      if (inlineImageRef.current) inlineImageRef.current.value = '';
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

  const toolbarButton = 'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/65 transition hover:bg-white/10 hover:text-white';

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard/articles" className="text-sm font-semibold text-sky-400">← Back to articles</Link>
        <h1 className="mt-4 text-3xl font-black text-white">{documentId ? 'Edit article' : 'Write an article'}</h1>
        <p className="mt-2 text-sm text-white/45">Use the formatting buttons below or write Markdown directly. No technical knowledge is required.</p>

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
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={toolbarButton} onClick={() => insertLine('## ', 'Section heading')}>Heading</button>
                  <button type="button" className={toolbarButton} onClick={() => insert('**', '**', 'bold text')}>Bold</button>
                  <button type="button" className={toolbarButton} onClick={() => insert('*', '*', 'italic text')}>Italic</button>
                  <button type="button" className={toolbarButton} onClick={() => insertLine('- ', 'List item')}>Bulleted list</button>
                  <button type="button" className={toolbarButton} onClick={() => insert('[', '](https://example.com)', 'link text')}>Link</button>
                  <button type="button" className={toolbarButton} onClick={() => inlineImageRef.current?.click()}>{uploadingInline ? 'Uploading…' : 'Inline image'}</button>
                  <input ref={inlineImageRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => uploadInlineImages(Array.from(e.target.files ?? []))} />
                  <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-xs text-white/70">
                    {LANGUAGES.map((language) => <option key={language}>{language}</option>)}
                  </select>
                  <button type="button" className={toolbarButton} onClick={() => insert(`\n\`\`\`${codeLanguage}\n`, '\n```\n', codeLanguage === 'javascript' ? 'const greeting = "Hello, Derby";' : 'Paste code here')}>Code block</button>
                </div>
                <div className="flex rounded-lg border border-white/10 p-1">
                  <button type="button" onClick={() => setMode('write')} className={`rounded px-3 py-1 text-xs font-bold ${mode === 'write' ? 'bg-sky-500 text-white' : 'text-white/45'}`}>Write</button>
                  <button type="button" onClick={() => setMode('preview')} className={`rounded px-3 py-1 text-xs font-bold ${mode === 'preview' ? 'bg-sky-500 text-white' : 'text-white/45'}`}>Preview</button>
                </div>
              </div>
              {mode === 'write' ? (
                <textarea ref={textareaRef} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-[520px] w-full rounded-b-xl border border-t-0 border-white/10 bg-white/5 p-4 font-mono text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-sky-500/60" placeholder="Start writing here…" />
              ) : (
                <div className="min-h-[520px] rounded-b-xl border border-t-0 border-white/10 bg-white p-6 text-slate-900" dangerouslySetInnerHTML={{ __html: previewMarkdown(form.content) }} />
              )}
              <p className="mt-2 text-xs text-white/35">Inline images are uploaded and inserted at your cursor. Code blocks display the selected language and preserve formatting.</p>
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
