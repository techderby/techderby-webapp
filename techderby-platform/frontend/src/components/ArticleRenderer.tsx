import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import { common, createLowlight } from 'lowlight';
import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { cn } from '../lib/utils';

const lowlight = createLowlight(common);

// Re-export same custom extensions for HTML generation
const ColumnBlock = Node.create({
  name: 'columnBlock',
  group: 'block',
  content: 'column+',
  defining: true,
  addAttributes() {
    return { columns: { default: 2 } };
  },
  parseHTML() {
    return [{ tag: 'div[data-column-block]' }];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-column-block': '',
        style: `display:grid;grid-template-columns:repeat(${node.attrs.columns},1fr);gap:2rem;margin:2rem 0;`,
      }),
      0,
    ];
  },
});

const Column = Node.create({
  name: 'column',
  group: 'column',
  content: 'block+',
  defining: true,
  parseHTML() {
    return [{ tag: 'div[data-column]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-column': '' }), 0];
  },
});

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  defining: true,
  addAttributes() {
    return { type: { default: 'info' } };
  },
  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },
  renderHTML({ HTMLAttributes, node }) {
    const colors: Record<string, string> = {
      info: '#38bdf8',
      warning: '#f59e0b',
      success: '#22c55e',
      tip: '#a855f7',
    };
    const color = colors[node.attrs.type as string] ?? colors.info;
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': node.attrs.type,
        style: `border-left:3px solid ${color};padding:1rem 1.25rem;background:${color}15;border-radius:0 0.75rem 0.75rem 0;margin:1.5rem 0;color:rgba(255,255,255,0.85);`,
      }),
      0,
    ];
  },
});

const Indent = Extension.create({ name: 'indent' });

const RENDERER_EXTENSIONS = [
  StarterKit.configure({ codeBlock: false, heading: { levels: [1, 2, 3, 4] } }),
  Underline,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Superscript,
  Subscript,
  Image.configure({ inline: false }),
  Link.configure({ openOnClick: true, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank', class: 'article-link' } }),
  CharacterCount,
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Youtube.configure({ controls: true, nocookie: true }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  TaskList,
  TaskItem.configure({ nested: true }),
  ColumnBlock,
  Column,
  Callout,
  Indent,
];

interface ArticleRendererProps {
  content: Record<string, unknown>;
  className?: string;
}

export function ArticleRenderer({ content, className }: ArticleRendererProps) {
  let html = '';
  try {
    html = generateHTML(content as Parameters<typeof generateHTML>[0], RENDERER_EXTENSIONS);
  } catch {
    html = '<p>Unable to render content.</p>';
  }

  return (
    <div className={cn('article-renderer', className)}>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: html }} />

      <style>{`
        .article-renderer {
          color: rgba(255,255,255,0.82);
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.125rem;
          line-height: 1.85;
          letter-spacing: 0.01em;
        }
        .article-renderer p {
          margin: 0 0 1.25rem;
        }
        .article-renderer h1 {
          font-size: 2.25rem;
          font-weight: 900;
          color: white;
          margin: 2.5rem 0 1rem;
          line-height: 1.15;
          letter-spacing: -0.03em;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .article-renderer h2 {
          font-size: 1.65rem;
          font-weight: 800;
          color: white;
          margin: 2.25rem 0 0.85rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
          font-family: system-ui, -apple-system, sans-serif;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .article-renderer h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          margin: 2rem 0 0.6rem;
          line-height: 1.35;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .article-renderer h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin: 1.5rem 0 0.5rem;
          font-family: system-ui, -apple-system, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
        }
        .article-renderer strong {
          font-weight: 700;
          color: rgba(255,255,255,0.97);
        }
        .article-renderer em {
          font-style: italic;
          color: rgba(255,255,255,0.75);
        }
        .article-renderer a, .article-link {
          color: #38bdf8;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(56,189,248,0.4);
          transition: color 0.15s, text-decoration-color 0.15s;
        }
        .article-renderer a:hover, .article-link:hover {
          color: #7dd3fc;
          text-decoration-color: rgba(125,211,252,0.6);
        }
        .article-renderer blockquote {
          border-left: 3px solid #38bdf8;
          padding: 0.75rem 0 0.75rem 1.5rem;
          margin: 2rem 0;
          color: rgba(255,255,255,0.65);
          font-size: 1.15rem;
          font-style: italic;
          position: relative;
        }
        .article-renderer blockquote::before {
          content: '"';
          position: absolute;
          left: -0.5rem;
          top: -0.5rem;
          font-size: 3rem;
          color: #38bdf8;
          opacity: 0.3;
          font-family: Georgia, serif;
          line-height: 1;
        }
        .article-renderer code {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px;
          padding: 0.15rem 0.45rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
          font-size: 0.85rem;
          color: #93c5fd;
        }
        .article-renderer pre {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
          position: relative;
        }
        .article-renderer pre code {
          background: none;
          border: none;
          padding: 0;
          color: #e2e8f0;
          font-size: 0.9rem;
          line-height: 1.7;
        }
        .article-renderer ul {
          list-style: none;
          padding-left: 1.25rem;
          margin: 0.5rem 0 1.25rem;
        }
        .article-renderer ul li {
          position: relative;
          padding-left: 1rem;
          margin-bottom: 0.5rem;
        }
        .article-renderer ul li::before {
          content: '•';
          position: absolute;
          left: -0.25rem;
          color: #38bdf8;
          font-weight: 900;
        }
        .article-renderer ol {
          list-style: decimal;
          padding-left: 1.75rem;
          margin: 0.5rem 0 1.25rem;
        }
        .article-renderer ol li {
          margin-bottom: 0.5rem;
          padding-left: 0.25rem;
        }
        .article-renderer ol li::marker {
          color: #38bdf8;
          font-weight: 700;
        }
        .article-renderer ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        .article-renderer ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding-left: 0;
        }
        .article-renderer ul[data-type="taskList"] li::before { display: none; }
        .article-renderer ul[data-type="taskList"] li input[type="checkbox"] {
          margin-top: 0.35rem;
          accent-color: #38bdf8;
          flex-shrink: 0;
        }
        .article-renderer img {
          max-width: 100%;
          border-radius: 12px;
          margin: 2rem auto;
          display: block;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .article-renderer hr {
          border: none;
          margin: 3rem auto;
          width: 40%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
          color: rgba(255,255,255,0.2);
        }
        .article-renderer hr::before,
        .article-renderer hr::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }
        .article-renderer mark {
          background: rgba(251,191,36,0.2);
          color: rgba(255,255,255,0.92);
          border-radius: 3px;
          padding: 0.05rem 0.25rem;
        }
        .article-renderer table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.95rem;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .article-renderer table th {
          background: rgba(56,189,248,0.08);
          color: rgba(255,255,255,0.85);
          font-weight: 700;
          padding: 0.75rem 1.25rem;
          border: 1px solid rgba(255,255,255,0.08);
          text-align: left;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .article-renderer table td {
          padding: 0.7rem 1.25rem;
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.72);
          vertical-align: top;
        }
        .article-renderer table tr:nth-child(even) td {
          background: rgba(255,255,255,0.02);
        }
        /* YouTube embed */
        .article-renderer .youtube-embed {
          margin: 2rem 0;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 16/9;
        }
        .article-renderer iframe {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        /* Syntax highlighting */
        .hljs-keyword, .hljs-selector-tag { color: #c792ea; }
        .hljs-title, .hljs-function { color: #82aaff; }
        .hljs-string { color: #c3e88d; }
        .hljs-attr, .hljs-attribute { color: #c3e88d; }
        .hljs-number, .hljs-literal { color: #f78c6c; }
        .hljs-comment { color: rgba(255,255,255,0.35); font-style: italic; }
        .hljs-built_in { color: #82aaff; }
        .hljs-type { color: #ffcb6b; }
        .hljs-params { color: #f07178; }
        .hljs-variable { color: #f07178; }
        .hljs-operator { color: #89ddff; }
        .hljs-punctuation { color: rgba(255,255,255,0.6); }
      `}</style>
    </div>
  );
}
