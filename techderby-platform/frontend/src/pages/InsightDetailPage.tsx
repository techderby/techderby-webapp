import { Link, useParams } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useInsightBySlug } from '../hooks/use-content-query';

function toAssetUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

function normalizeCategory(category: string) {
  const value = category.trim().toLowerCase();
  if (value.includes('career')) return 'Career';
  if (value.includes('technical') || value.includes('tech')) return 'Technical';
  if (value.includes('community')) return 'Community';
  return 'Community';
}

function formatInsightDate(value?: string) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function inlineMarkdown(text: string): string {
  return text
    // Images with optional size: ![alt](url){w=50%} or ![alt](url){w=300px}
    .replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{w=([^}]+)\})?/g, (_m, alt, src, width) => {
      const style = width ? ` style="width:${width};max-width:100%"` : '';
      const cls = width ? '' : 'w-full ';
      return `<img src="${src}" alt="${alt}"${style} class="${cls}rounded-xl border border-slate-200 my-4 object-cover" />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sky-700 hover:underline">$1</a>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-800">$1</code>');
}

// Converts a plain markdown text block (no :::image blocks) into HTML line by line.
function processLines(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const heading = line.match(/^(#{1,6})\s+(.*)/);
    if (heading) {
      const level = heading[1].length;
      const headingClass = [
        '',                                                                         // 0 unused
        'text-3xl font-black text-slate-900 mt-10 mb-4 leading-tight',            // h1
        'text-2xl font-black text-slate-900 mt-8 mb-3 leading-tight',            // h2
        'text-xl font-black text-slate-900 mt-6 mb-2 leading-snug',              // h3
        'text-lg font-bold text-slate-800 mt-5 mb-2',                             // h4
        'text-base font-bold text-slate-700 mt-4 mb-1',                           // h5
        'text-sm font-bold text-slate-600 mt-3 mb-1 uppercase tracking-wide',    // h6
      ][level];
      out.push(`<h${level} class="${headingClass}">${inlineMarkdown(heading[2])}</h${level}>`);
      i++; continue;
    }
    if (/^[-*+]\s+/.test(line)) {
      out.push('<ul style="list-style-type:disc;padding-left:1.5rem;margin-bottom:1rem;">');
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        out.push(`<li style="margin-bottom:0.25rem;line-height:1.7;">${inlineMarkdown(lines[i].replace(/^[-*+]\s+/, ''))}</li>`);
        i++;
      }
      out.push('</ul>'); continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      out.push('<ol style="list-style-type:decimal;padding-left:1.5rem;margin-bottom:1rem;">');
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        out.push(`<li style="margin-bottom:0.25rem;line-height:1.7;">${inlineMarkdown(lines[i].replace(/^\d+\.\s+/, ''))}</li>`);
        i++;
      }
      out.push('</ol>'); continue;
    }
    if (line.startsWith('> ')) {
      out.push(`<blockquote style="border-left:4px solid #7dd3fc;padding-left:1rem;font-style:italic;color:#64748b;margin:1rem 0;">${inlineMarkdown(line.slice(2))}</blockquote>`);
      i++; continue;
    }
    if (line.trim() === '') { i++; continue; }
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^#{1,6}\s+/) &&
      !lines[i].match(/^[-*+]\s+/) &&
      !lines[i].match(/^\d+\.\s+/) &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith(':::')
    ) {
      paraLines.push(inlineMarkdown(lines[i]));
      i++;
    }
    if (paraLines.length > 0) out.push(`<p style="margin-bottom:1rem;line-height:1.8;color:#374151;">${paraLines.join(' ')}</p>`);
  }
  return out.join('\n');
}

// Supported special blocks (all line endings — LF and CRLF — are handled):
//
// 1. Side-by-side layout — image takes 40% width by default.
//    Append :N to set a custom image width percentage (e.g. :::image-left:30).
//
//    :::image-left
//    ![Alt text](https://your-cms/uploads/photo.webp)
//    Text that appears on the RIGHT. Supports **bold**, lists, etc.
//    :::
//
//    :::image-right:35
//    ![Alt text](https://your-cms/uploads/photo.webp)
//    Text that appears on the LEFT. Image takes 35% width.
//    :::
//
// 2. Regular inline images with size control:
//    ![alt](url){w=300px}   — fixed pixel width
//    ![alt](url){w=50%}     — percentage width
//
// 3. Raw HTML passthrough:
//    :::html
//    <div class="p-6 bg-sky-50 rounded-2xl">any HTML + Tailwind</div>
//    :::
function markdownToHtml(markdown: string): string {
  // Normalise Windows line endings so all regexes only need to handle \n
  const md = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split on all supported block types, keeping delimiters
  const segments = md.split(/(:::html[\s\S]*?:::|:::image-(?:left|right)(?::\d+)?[\s\S]*?:::)/);

  return segments.map((segment) => {
    // ── :::html block ── verbatim HTML passthrough
    const htmlMatch = segment.match(/:::html\s*\n([\s\S]*?):::/);
    if (htmlMatch) return htmlMatch[1];

    // ── :::image-left / :::image-right block ──
    // Optional :N suffix sets the image column width in percent (default 40)
    const blockMatch = segment.match(/:::(image-left|image-right)(?::(\d+))?\s*\n([\s\S]*?):::/);
    if (!blockMatch) return processLines(segment);

    const [, direction, widthParam, blockContent] = blockMatch;
    const imgWidthPct = widthParam ?? '40';
    const blockLines = blockContent.trim().split('\n');

    // First line that is an image becomes the <img>; everything else is the text column
    let imageLine = '';
    const textLines: string[] = [];
    for (const line of blockLines) {
      if (!imageLine && /^!\[/.test(line.trim())) {
        imageLine = line.trim();
      } else {
        textLines.push(line);
      }
    }

    const imgMatch = imageLine.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\{w=([^}]+)\})?/);
    if (!imgMatch) return processLines(blockContent);

    const [, alt, src, inlineWidth] = imgMatch;
    const imgStyle = inlineWidth
      ? `style="width:${inlineWidth};max-width:100%"`
      : `style="width:${imgWidthPct}%;max-width:100%"`;

    const flexDir = direction === 'image-right' ? 'md:flex-row-reverse' : 'md:flex-row';
    const textHtml = textLines.join('\n').trim() ? processLines(textLines.join('\n')) : '';

    return [
      `<div class="not-prose my-8 flex flex-col ${flexDir} items-start gap-6 md:items-center">`,
      `<img src="${src}" alt="${alt}" ${imgStyle} class="w-full shrink-0 rounded-2xl border border-slate-200 object-cover shadow-sm md:w-auto" />`,
      `<div class="flex-1 min-w-0 space-y-3 text-base leading-relaxed text-slate-700">${textHtml}</div>`,
      `</div>`,
    ].join('\n');
  }).join('');
}

// If the content is predominantly HTML (starts with a tag or has block-level tags)
// it is passed straight to dangerouslySetInnerHTML without markdown processing.
function looksLikeHtml(content: string): boolean {
  const trimmed = content.trimStart();
  if (trimmed.startsWith('<')) return true;
  return /<(p|h[1-6]|ul|ol|div|table|section|article|blockquote)(\s[^>]*)?>/.test(trimmed);
}

function renderContent(content: string): string {
  if (looksLikeHtml(content)) {
    return content;
  }
  return markdownToHtml(content);
}

export default function InsightDetailPage() {
  const { slug = '' } = useParams();
  const { data: insight, isLoading, isError, error } = useInsightBySlug(slug);

  const title = insight?.title ?? 'Insight';

  return (
    <>
      <PageSeo
        title={`Tech Derby | ${title}`}
        description={insight?.content ? insight.content.replace(/<[^>]*>/g, ' ').slice(0, 155) : 'An article from The Wire by Tech Derby.'}
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-16 md:py-24">
          <Link
            to="/wire"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to The Wire
          </Link>

          {!isLoading && !isError && insight ? (
            <div className="mt-8 max-w-3xl">
              <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                {normalizeCategory(insight.category)}
              </span>
              <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                {insight.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="font-semibold text-white/90">{insight.author || 'Tech Derby'}</span>
                <span aria-hidden="true" className="text-white/30">|</span>
                <span>{formatInsightDate(insight.publishedAt ?? insight.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div className="mt-8 max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                {isLoading ? 'Loading article...' : 'Insight'}
              </h1>
            </div>
          )}
        </Container>
      </Section>

      {/* ── CONTENT ── */}
      <Section className="bg-white py-12 md:py-16">
        <Container>
          {isLoading ? (
            <div className="mx-auto max-w-3xl py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />
              <p className="mt-4 text-sm text-slate-500">Loading article...</p>
            </div>
          ) : null}

          {isError ? (
            <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-700">
                Could not load article: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : null}

          {!isLoading && !isError && !insight ? (
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <h2 className="text-2xl font-black text-slate-900">Article not found</h2>
              <p className="mt-2 text-sm text-slate-600">The requested article could not be found or may not be published yet.</p>
              <Link to="/wire" className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
                Browse all articles &rarr;
              </Link>
            </div>
          ) : null}

          {!isLoading && !isError && insight ? (
            <div className="mx-auto max-w-3xl">
              {/* Featured image */}
              <div className="-mt-20 relative z-10">
                <img
                  src={toAssetUrl(insight.featuredImage)}
                  alt={insight.title}
                  className="h-64 w-full rounded-2xl border border-slate-200 object-cover shadow-xl md:h-96"
                  loading="lazy"
                />
              </div>

              {/* Tags */}
              {insight.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {insight.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Article body */}
              <div className="mt-8 border-t border-slate-200 pt-8">
                <div
                  className="article-body max-w-none text-base leading-relaxed text-slate-700 [&_p]:mb-4 [&_p]:leading-[1.8] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:leading-[1.7] [&_strong]:font-bold [&_strong]:text-slate-900 [&_em]:italic [&_a]:text-sky-700 [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-sky-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-4 [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-slate-800 [&_hr]:my-8 [&_hr]:border-slate-200"
                  dangerouslySetInnerHTML={{ __html: renderContent(insight.content) }}
                />
              </div>

              {/* Footer */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {(insight.author || 'T')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{insight.author || 'Tech Derby'}</p>
                    <p className="text-xs text-slate-500">{formatInsightDate(insight.publishedAt ?? insight.createdAt)}</p>
                  </div>
                </div>
                <Link to="/wire">
                  <Button className="h-10 rounded-full px-6 text-sm shadow-lg shadow-orange-900/30">
                    More from The Wire
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
