import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';

export type ArticleContentFormat = 'markdown' | 'html';

const BLOCK_HTML = /<(p|h[1-6]|ul|ol|li|div|table|figure|pre|section|article|blockquote)(\s[^>]*)?>/i;

export function looksLikeArticleHtml(content: string) {
  const trimmed = content.trimStart();
  return trimmed.startsWith('<') || BLOCK_HTML.test(trimmed);
}

export function sanitizeArticleHtml(content: string) {
  return DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'colspan', 'rowspan', 'scope', 'data-language', 'style', 'start', 'value'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['srcset'],
  });
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMarkdown(text: string) {
  return escapeHtml(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{w=([^}]+)\})?/g, (_match, alt, src, width) => {
      const style = width ? ` style="width:${width};max-width:100%"` : '';
      return `<img src="${src}" alt="${alt}"${style} />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function tableCells(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableDivider(line = '') {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function processMarkdownLines(text: string) {
  const lines = text.split('\n');
  const output: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const fence = line.match(/^```([a-zA-Z0-9_+#.-]*)\s*$/);
    if (fence) {
      const language = fence[1] || 'plaintext';
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      output.push(`<pre data-language="${escapeHtml(language)}"><code class="language-${escapeHtml(language)}">${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    if (line.includes('|') && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      output.push('<table><thead><tr>');
      headers.forEach((cell) => output.push(`<th>${inlineMarkdown(cell)}</th>`));
      output.push('</tr></thead><tbody>');
      rows.forEach((row) => {
        output.push('<tr>');
        headers.forEach((_, cellIndex) => output.push(`<td>${inlineMarkdown(row[cellIndex] ?? '')}</td>`));
        output.push('</tr>');
      });
      output.push('</tbody></table>');
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)/);
    if (heading) {
      const level = heading[1].length;
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      output.push('<ul>');
      while (index < lines.length && /^[-*+]\s+/.test(lines[index])) {
        output.push(`<li>${inlineMarkdown(lines[index].replace(/^[-*+]\s+/, ''))}</li>`);
        index += 1;
      }
      output.push('</ul>');
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      output.push('<ol>');
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        output.push(`<li>${inlineMarkdown(lines[index].replace(/^\d+\.\s+/, ''))}</li>`);
        index += 1;
      }
      output.push('</ol>');
      continue;
    }

    if (line.startsWith('> ')) {
      output.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      output.push('<hr />');
      index += 1;
      continue;
    }

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !/^#{1,6}\s+/.test(lines[index]) &&
      !/^[-*+]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index]) &&
      !/^```/.test(lines[index]) &&
      !lines[index].startsWith('> ') &&
      !lines[index].startsWith(':::')
    ) {
      paragraph.push(inlineMarkdown(lines[index]));
      index += 1;
    }
    if (paragraph.length) output.push(`<p>${paragraph.join(' ')}</p>`);
  }

  return output.join('\n');
}

function legacyMarkdownToHtml(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const segments = normalized.split(/(:::html[\s\S]*?:::|:::image-(?:left|right)(?::\d+)?[\s\S]*?:::)/);

  return segments.map((segment) => {
    const html = segment.match(/:::html\s*\n([\s\S]*?):::/);
    if (html) return html[1];

    const imageBlock = segment.match(/:::(image-left|image-right)(?::(\d+))?\s*\n([\s\S]*?):::/);
    if (!imageBlock) return processMarkdownLines(segment);

    const [, direction, widthValue, blockContent] = imageBlock;
    const lines = blockContent.trim().split('\n');
    const imageIndex = lines.findIndex((line) => /^!\[/.test(line.trim()));
    if (imageIndex < 0) return processMarkdownLines(blockContent);

    const image = lines[imageIndex].trim().match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\{w=([^}]+)\})?/);
    if (!image) return processMarkdownLines(blockContent);

    const [, alt, src, inlineWidth] = image;
    const text = lines.filter((_, index) => index !== imageIndex).join('\n');
    const width = inlineWidth ?? `${widthValue ?? '40'}%`;
    return [
      `<figure class="article-split article-split-${direction === 'image-right' ? 'right' : 'left'}">`,
      `<img src="${src}" alt="${alt}" style="width:${width};max-width:100%" />`,
      `<figcaption>${processMarkdownLines(text)}</figcaption>`,
      '</figure>',
    ].join('');
  }).join('');
}

export function renderArticleContent(content: string, format?: ArticleContentFormat | null) {
  const isHtml = format === 'html' || looksLikeArticleHtml(content);
  const sanitized = sanitizeArticleHtml(isHtml ? content : legacyMarkdownToHtml(content));
  const template = document.createElement('template');
  template.innerHTML = sanitized;
  template.content.querySelectorAll('pre code').forEach((code) => {
    const languageClass = [...code.classList].find((name) => name.startsWith('language-'));
    const requestedLanguage = languageClass?.slice('language-'.length) || (code.parentElement?.getAttribute('data-language') ?? '');
    if (!requestedLanguage || requestedLanguage === 'plaintext' || !hljs.getLanguage(requestedLanguage)) return;
    code.innerHTML = hljs.highlight(code.textContent ?? '', { language: requestedLanguage }).value;
    code.classList.add('hljs');
  });

  template.content.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('tableWrapper')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'tableWrapper';
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  return template.innerHTML;
}

export function articleContentForEditor(content: string, format?: ArticleContentFormat | null) {
  if (!content.trim()) return '<p></p>';
  return renderArticleContent(content, format);
}
