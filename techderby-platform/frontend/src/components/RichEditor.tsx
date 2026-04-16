import { useEditor, EditorContent, BubbleMenu, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
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
import { useState, useCallback, useRef } from 'react';
import { cn } from '../lib/utils';

const lowlight = createLowlight(common);

// ── Column Layout Extension ───────────────────────────────────────────────────
const ColumnBlock = Node.create({
  name: 'columnBlock',
  group: 'block',
  content: 'column+',
  defining: true,
  addAttributes() {
    return {
      columns: { default: 2 },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-column-block]' }];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-column-block': '', style: `display:grid;grid-template-columns:repeat(${node.attrs.columns},1fr);gap:1.5rem;` }),
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

// ── Callout / Quote block extension ──────────────────────────────────────────
const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  defining: true,
  addAttributes() {
    return {
      type: { default: 'info' }, // info | warning | success | tip
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },
  renderHTML({ HTMLAttributes, node }) {
    const color = { info: '#3b82f6', warning: '#f59e0b', success: '#22c55e', tip: '#a855f7' }[node.attrs.type as string] ?? '#3b82f6';
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': node.attrs.type,
        style: `border-left:3px solid ${color};padding:0.75rem 1rem;background:${color}18;border-radius:0 0.5rem 0.5rem 0;margin:1rem 0;`,
      }),
      0,
    ];
  },
});

// ── Indent extension ──────────────────────────────────────────────────────────
const Indent = Extension.create({
  name: 'indent',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const { state, dispatch } = this.editor.view;
        const { $from } = state.selection;
        if ($from.parent.type.name === 'codeBlock') return false;
        if (dispatch) dispatch(state.tr.insertText('    ').scrollIntoView());
        return true;
      },
    };
  },
});

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all duration-100 select-none',
        active
          ? 'bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30'
          : 'text-white/55 hover:bg-white/10 hover:text-white/90',
        disabled && 'cursor-not-allowed opacity-30',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <div className="mx-0.5 h-5 w-px shrink-0 bg-white/10" />;
}

// ── Heading select ────────────────────────────────────────────────────────────
function HeadingSelect({ editor }: { editor: Editor }) {
  const getLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    if (editor.isActive('heading', { level: 4 })) return 'H4';
    if (editor.isActive('paragraph')) return 'P';
    return 'P';
  };

  return (
    <select
      value={getLabel()}
      onChange={(e) => {
        const val = e.target.value;
        if (val === 'P') editor.chain().focus().setParagraph().run();
        else editor.chain().focus().setHeading({ level: parseInt(val[1]) as 1 | 2 | 3 | 4 }).run();
      }}
      className="h-7 rounded-md bg-white/5 px-2 text-[11px] font-semibold text-white/70 outline-none ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white/90 focus:ring-sky-500/50"
      aria-label="Text style"
    >
      <option value="P">Paragraph</option>
      <option value="H1">Heading 1</option>
      <option value="H2">Heading 2</option>
      <option value="H3">Heading 3</option>
      <option value="H4">Heading 4</option>
    </select>
  );
}

// ── Add column layout ─────────────────────────────────────────────────────────
function insertColumns(editor: Editor, count: number) {
  editor.chain().focus().insertContent({
    type: 'columnBlock',
    attrs: { columns: count },
    content: Array.from({ length: count }, () => ({
      type: 'column',
      content: [{ type: 'paragraph' }],
    })),
  }).run();
}

// ── Image upload modal ────────────────────────────────────────────────────────
function ImageModal({ onInsert, onClose }: { onInsert: (url: string, alt: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-sm font-bold text-white">Insert Image</h3>
        <label className="mb-1 block text-[11px] font-semibold text-white/50">Image URL</label>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
        />
        <label className="mb-1 block text-[11px] font-semibold text-white/50">Alt text (accessibility)</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe the image..."
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { if (url) { onInsert(url, alt); onClose(); } }}
            disabled={!url}
            className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-bold text-white transition hover:bg-sky-400 disabled:opacity-40"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Link modal ────────────────────────────────────────────────────────────────
function LinkModal({ onInsert, onClose, initial }: { onInsert: (url: string) => void; onClose: () => void; initial?: string }) {
  const [url, setUrl] = useState(initial ?? '');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-sm font-bold text-white">Insert Link</h3>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && url) { onInsert(url); onClose(); } }}
          placeholder="https://..."
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { if (url) { onInsert(url); onClose(); } }}
            disabled={!url}
            className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-bold text-white transition hover:bg-sky-400 disabled:opacity-40"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── YouTube modal ─────────────────────────────────────────────────────────────
function YoutubeModal({ onInsert, onClose }: { onInsert: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState('');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-sm font-bold text-white">Embed YouTube Video</h3>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { if (url) { onInsert(url); onClose(); } }}
            disabled={!url}
            className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-bold text-white transition hover:bg-sky-400 disabled:opacity-40"
          >
            Embed
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Column picker ─────────────────────────────────────────────────────────────
function ColumnPicker({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  return (
    <div className="absolute left-0 top-full z-[200] mt-1 flex gap-1 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-2xl">
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => { insertColumns(editor, n); onClose(); }}
          className="flex h-14 w-14 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white/70 transition hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300"
        >
          <div className={cn('flex gap-0.5', n === 1 ? 'w-8' : n === 2 ? 'w-8' : 'w-8')}>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="h-6 flex-1 rounded-sm bg-white/20" />
            ))}
          </div>
          <span>{n} col{n > 1 ? 's' : ''}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main Toolbar ──────────────────────────────────────────────────────────────
function Toolbar({ editor, wordCount, charCount }: { editor: Editor; wordCount: number; charCount: number }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const colorRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback((url: string, alt: string) => {
    editor.chain().focus().setImage({ src: url, alt }).run();
  }, [editor]);

  const addLink = useCallback((url: string) => {
    if (editor.state.selection.empty) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addYoutube = useCallback((url: string) => {
    editor.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
  }, [editor]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.07] bg-[#0a0d14] px-3 py-2">

        {/* Text Style */}
        <HeadingSelect editor={editor} />
        <ToolbarSep />

        {/* Basic formatting */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="12" x2="20" y2="12"/><path d="M17.5 5.5C16.5 4.5 15 4 13 4c-2.5 0-4 1.2-4 3 0 .8.3 1.5.8 2"/><path d="M6.5 18c1 1 2.5 1.5 4.5 1.5 2.5 0 4-1 4-3 0-.8-.2-1.5-.7-2"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript">
          <span className="font-mono text-[10px]">x²</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript">
          <span className="font-mono text-[10px]">x₂</span>
        </ToolBtn>

        {/* Color */}
        <div className="relative">
          <ToolBtn onClick={() => colorRef.current?.click()} title="Text colour">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/>
            </svg>
          </ToolBtn>
          <input
            ref={colorRef}
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            aria-label="Text colour picker"
          />
        </div>

        <ToolbarSep />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task list">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </ToolBtn>

        <ToolbarSep />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align centre">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
        </ToolBtn>

        <ToolbarSep />

        {/* Blocks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M11.3 4.c-.4 0-.8.2-1 .5L6 11v9h9V11H9.7l3-5.5c.2-.4.1-.9-.2-1.2-.2-.2-.5-.3-.1-.3zm9 0c-.4 0-.8.2-1 .5L15 11v9h9V11h-5.3l3-5.5c.2-.4.1-.9-.2-1.2-.2-.2-.5-.3-.2-.3z"/><path d="M3 10a8 8 0 1 0 1 6.3"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
        </ToolBtn>

        <ToolbarSep />

        {/* Media */}
        <ToolBtn onClick={() => setShowImageModal(true)} title="Insert image">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => setShowLinkModal(true)} active={editor.isActive('link')} title="Insert link">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => setShowYoutubeModal(true)} title="Embed YouTube">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </ToolBtn>

        {/* Tables */}
        <ToolBtn
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert table"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
        </ToolBtn>

        <ToolbarSep />

        {/* Columns */}
        <div className="relative">
          <ToolBtn onClick={() => setShowColumnPicker((v) => !v)} title="Multi-column layout">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>
            </svg>
          </ToolBtn>
          {showColumnPicker && <ColumnPicker editor={editor} onClose={() => setShowColumnPicker(false)} />}
        </div>

        {/* Callout */}
        <ToolBtn
          onClick={() => editor.chain().focus().insertContent({ type: 'callout', attrs: { type: 'info' }, content: [{ type: 'text', text: 'Callout text here...' }] }).run()}
          title="Insert callout"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </ToolBtn>

        <ToolbarSep />

        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
        </ToolBtn>

        {/* Word count */}
        <div className="ml-auto flex items-center gap-2 text-[10px] text-white/25 select-none">
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {showImageModal && <ImageModal onInsert={addImage} onClose={() => setShowImageModal(false)} />}
      {showLinkModal && <LinkModal onInsert={addLink} onClose={() => setShowLinkModal(false)} initial={editor.getAttributes('link').href} />}
      {showYoutubeModal && <YoutubeModal onInsert={addYoutube} onClose={() => setShowYoutubeModal(false)} />}
    </>
  );
}

// ── Bubble menu (selection toolbar) ──────────────────────────────────────────
function SelectionBubble({ editor }: { editor: Editor }) {
  const [showLinkModal, setShowLinkModal] = useState(false);

  return (
    <>
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-slate-900/95 px-1.5 py-1 shadow-2xl backdrop-blur-sm"
      >
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
        </ToolBtn>
        <div className="mx-0.5 h-4 w-px bg-white/10" />
        <ToolBtn onClick={() => setShowLinkModal(true)} active={editor.isActive('link')} title="Link">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </ToolBtn>
        {editor.isActive('link') && (
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/></svg>
          </ToolBtn>
        )}
      </BubbleMenu>
      {showLinkModal && (
        <LinkModal
          onInsert={(url) => editor.chain().focus().setLink({ href: url }).run()}
          onClose={() => setShowLinkModal(false)}
          initial={editor.getAttributes('link').href}
        />
      )}
    </>
  );
}

// ── Main RichEditor component ─────────────────────────────────────────────────
export interface RichEditorProps {
  content?: Record<string, unknown>;
  onChange?: (content: Record<string, unknown>) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  minHeight?: number;
}

export function RichEditor({
  content,
  onChange,
  placeholder = 'Start writing your article...',
  readOnly = false,
  className,
  minHeight = 480,
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', class: 'rich-link' } }),
      Placeholder.configure({ placeholder, emptyEditorClass: 'is-editor-empty' }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ controls: true, nocookie: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      ColumnBlock,
      Column,
      Callout,
      Indent,
    ],
    content: content ?? null,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-content focus:outline-none',
        'aria-label': 'Article editor',
        'aria-multiline': 'true',
        role: 'textbox',
        spellcheck: 'true',
      },
    },
  });

  const wordCount = editor?.storage.characterCount?.words() ?? 0;
  const charCount = editor?.storage.characterCount?.characters() ?? 0;

  if (!editor) return null;

  return (
    <div className={cn('rich-editor flex flex-col rounded-xl border border-white/10 bg-[#0a0d14] overflow-hidden', className)}>
      {!readOnly && <Toolbar editor={editor} wordCount={wordCount} charCount={charCount} />}
      {!readOnly && <SelectionBubble editor={editor} />}
      <div
        className="flex-1 overflow-y-auto px-8 py-6"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .rich-editor-content {
          color: rgba(255,255,255,0.85);
          font-size: 1rem;
          line-height: 1.75;
          font-family: 'Georgia', serif;
          outline: none;
        }
        .rich-editor-content.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.18);
          float: left;
          height: 0;
          pointer-events: none;
          font-family: inherit;
        }
        .rich-editor-content p { margin: 0 0 1rem; }
        .rich-editor-content h1 { font-size: 2rem; font-weight: 900; color: white; margin: 2rem 0 1rem; line-height: 1.2; letter-spacing: -0.02em; }
        .rich-editor-content h2 { font-size: 1.5rem; font-weight: 800; color: white; margin: 1.75rem 0 0.75rem; line-height: 1.3; letter-spacing: -0.01em; }
        .rich-editor-content h3 { font-size: 1.25rem; font-weight: 700; color: rgba(255,255,255,0.9); margin: 1.5rem 0 0.5rem; }
        .rich-editor-content h4 { font-size: 1.1rem; font-weight: 700; color: rgba(255,255,255,0.85); margin: 1.25rem 0 0.5rem; }
        .rich-editor-content strong { font-weight: 700; color: rgba(255,255,255,0.95); }
        .rich-editor-content em { font-style: italic; }
        .rich-editor-content u { text-decoration: underline; text-underline-offset: 3px; }
        .rich-editor-content s { text-decoration: line-through; color: rgba(255,255,255,0.45); }
        .rich-editor-content a, .rich-link { color: #38bdf8; text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
        .rich-editor-content a:hover, .rich-link:hover { color: #7dd3fc; }
        .rich-editor-content blockquote { border-left: 3px solid #38bdf8; padding: 0.5rem 0 0.5rem 1.25rem; margin: 1.5rem 0; color: rgba(255,255,255,0.6); font-style: italic; font-size: 1.05rem; }
        .rich-editor-content code { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 0.15rem 0.4rem; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.875rem; color: #93c5fd; }
        .rich-editor-content pre { background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
        .rich-editor-content pre code { background: none; border: none; padding: 0; color: #e2e8f0; font-size: 0.875rem; line-height: 1.6; }
        .rich-editor-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0 1rem; }
        .rich-editor-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0 1rem; }
        .rich-editor-content li { margin-bottom: 0.4rem; }
        .rich-editor-content ul[data-type="taskList"] { list-style: none; padding-left: 0; }
        .rich-editor-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; }
        .rich-editor-content ul[data-type="taskList"] li input[type="checkbox"] { margin-top: 0.25rem; accent-color: #38bdf8; }
        .rich-editor-content img { max-width: 100%; border-radius: 10px; margin: 1.5rem 0; border: 1px solid rgba(255,255,255,0.08); }
        .rich-editor-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2rem 0; }
        .rich-editor-content mark { background: rgba(251,191,36,0.25); color: rgba(255,255,255,0.9); border-radius: 2px; padding: 0 2px; }
        .rich-editor-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
        .rich-editor-content table th { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.8); font-weight: 700; padding: 0.6rem 1rem; border: 1px solid rgba(255,255,255,0.1); text-align: left; }
        .rich-editor-content table td { padding: 0.6rem 1rem; border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); }
        .rich-editor-content table tr:hover td { background: rgba(255,255,255,0.03); }
        .rich-editor-content .selectedCell { background: rgba(56,189,248,0.08) !important; }
        /* Syntax highlighting */
        .hljs-keyword, .hljs-selector-tag, .hljs-title { color: #c792ea; }
        .hljs-string, .hljs-attr { color: #c3e88d; }
        .hljs-number, .hljs-literal { color: #f78c6c; }
        .hljs-comment { color: rgba(255,255,255,0.35); font-style: italic; }
        .hljs-function, .hljs-built_in { color: #82aaff; }
        .hljs-type { color: #ffcb6b; }
        .hljs-params { color: #f07178; }
      `}</style>
    </div>
  );
}
