import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { renderArticleContent } from '../../lib/article-content';

const lowlight = createLowlight(common);
const CODE_LANGUAGES = ['plaintext', 'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby', 'html', 'css', 'sql', 'bash', 'json', 'yaml'];

type RichArticleEditorProps = {
  value: string;
  onChange: (html: string) => void;
  onUploadImages: (files: File[]) => Promise<string[]>;
  disabled?: boolean;
};

const buttonBase = 'rounded-lg border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40';

function toolbarButton(active = false) {
  return `${buttonBase} ${active
    ? 'border-sky-400 bg-sky-500 text-white'
    : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'}`;
}

export function RichArticleEditor({ value, onChange, onUploadImages, disabled = false }: RichArticleEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
        },
      }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'plaintext' }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { loading: 'lazy' },
      }),
      TableKit.configure({
        table: { resizable: true, lastColumnResizable: false },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    content: value || '<p></p>',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || !value || editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      paragraph: currentEditor?.isActive('paragraph') ?? false,
      heading1: currentEditor?.isActive('heading', { level: 1 }) ?? false,
      heading2: currentEditor?.isActive('heading', { level: 2 }) ?? false,
      heading3: currentEditor?.isActive('heading', { level: 3 }) ?? false,
      bold: currentEditor?.isActive('bold') ?? false,
      italic: currentEditor?.isActive('italic') ?? false,
      underline: currentEditor?.isActive('underline') ?? false,
      strike: currentEditor?.isActive('strike') ?? false,
      bulletList: currentEditor?.isActive('bulletList') ?? false,
      orderedList: currentEditor?.isActive('orderedList') ?? false,
      blockquote: currentEditor?.isActive('blockquote') ?? false,
      codeBlock: currentEditor?.isActive('codeBlock') ?? false,
      table: currentEditor?.isActive('table') ?? false,
      link: currentEditor?.isActive('link') ?? false,
      textAlign: currentEditor?.getAttributes('paragraph').textAlign ?? currentEditor?.getAttributes('heading').textAlign ?? 'left',
      codeLanguage: currentEditor?.getAttributes('codeBlock').language ?? 'plaintext',
      canUndo: currentEditor?.can().chain().focus().undo().run() ?? false,
      canRedo: currentEditor?.can().chain().focus().redo().run() ?? false,
    }),
  });

  function setLink() {
    if (!editor) return;
    const existing = editor.getAttributes('link').href as string | undefined;
    const href = window.prompt('Link URL', existing ?? 'https://');
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: href.trim() }).run();
  }

  async function uploadImages(files: File[]) {
    if (!files.length || !editor) return;
    setUploading(true);
    try {
      const urls = await onUploadImages(files);
      const chain = editor.chain().focus();
      urls.forEach((src, index) => {
        chain.setImage({ src, alt: files[index]?.name.replace(/\.[^.]+$/, '') || 'Article image' }).createParagraphNear();
      });
      chain.run();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const headingValue = state?.heading1 ? '1' : state?.heading2 ? '2' : state?.heading3 ? '3' : 'paragraph';
  const shellClass = fullscreen
    ? 'fixed inset-0 z-[100] flex flex-col bg-slate-950 p-4 md:p-8'
    : 'overflow-hidden rounded-xl border border-white/10 bg-slate-950/40';

  return (
    <div className={shellClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Text style"
            value={headingValue}
            disabled={!editor || disabled}
            onChange={(event) => {
              const level = Number(event.target.value);
              if (level >= 1 && level <= 4) editor?.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 }).run();
              else editor?.chain().focus().setParagraph().run();
            }}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white/75"
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>

          <button type="button" aria-label="Bold" className={toolbarButton(state?.bold)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
          <button type="button" aria-label="Italic" className={toolbarButton(state?.italic)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}><em>I</em></button>
          <button type="button" aria-label="Underline" className={toolbarButton(state?.underline)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></button>
          <button type="button" aria-label="Strikethrough" className={toolbarButton(state?.strike)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></button>
          <button type="button" className={toolbarButton(state?.bulletList)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
          <button type="button" className={toolbarButton(state?.orderedList)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered</button>
          <button type="button" className={toolbarButton(state?.blockquote)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
          <button type="button" className={toolbarButton(state?.link)} disabled={!editor || disabled} onClick={setLink}>Link</button>
          <button type="button" className={toolbarButton()} disabled={!editor || disabled || uploading} onClick={() => fileInputRef.current?.click()}>{uploading ? 'Uploading…' : 'Image'}</button>
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => uploadImages(Array.from(event.target.files ?? []))}
          />
          <button type="button" className={toolbarButton(state?.table)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
          <button type="button" className={toolbarButton(state?.codeBlock)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleCodeBlock({ language: 'plaintext' }).run()}>Code</button>
          <button type="button" className={toolbarButton()} disabled={!editor || disabled} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>Divider</button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className={toolbarButton()} disabled={!state?.canUndo || disabled} onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
          <button type="button" className={toolbarButton()} disabled={!state?.canRedo || disabled} onClick={() => editor?.chain().focus().redo().run()}>Redo</button>
          <button type="button" className={toolbarButton(mode === 'preview')} onClick={() => setMode((current) => current === 'edit' ? 'preview' : 'edit')}>{mode === 'edit' ? 'Preview' : 'Edit'}</button>
          <button type="button" className={toolbarButton(fullscreen)} onClick={() => setFullscreen((current) => !current)}>{fullscreen ? 'Exit full screen' : 'Full screen'}</button>
        </div>
      </div>

      {state?.table && mode === 'edit' ? (
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-slate-900 px-3 py-2">
          <span className="self-center text-xs font-bold uppercase tracking-wide text-white/40">Table</span>
          <button type="button" className={toolbarButton()} onClick={() => editor?.chain().focus().addRowAfter().run()}>Add row</button>
          <button type="button" className={toolbarButton()} onClick={() => editor?.chain().focus().addColumnAfter().run()}>Add column</button>
          <button type="button" className={toolbarButton()} onClick={() => editor?.chain().focus().deleteRow().run()}>Delete row</button>
          <button type="button" className={toolbarButton()} onClick={() => editor?.chain().focus().deleteColumn().run()}>Delete column</button>
          <button type="button" className={toolbarButton()} onClick={() => editor?.chain().focus().toggleHeaderRow().run()}>Toggle header</button>
          <button type="button" className={toolbarButton()} onClick={() => editor?.chain().focus().mergeOrSplit().run()}>Merge/split</button>
          <button type="button" className={`${buttonBase} border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20`} onClick={() => editor?.chain().focus().deleteTable().run()}>Delete table</button>
        </div>
      ) : null}

      {state?.codeBlock && mode === 'edit' ? (
        <div className="flex items-center gap-3 border-b border-white/10 bg-slate-900 px-3 py-2">
          <label className="text-xs font-bold uppercase tracking-wide text-white/40" htmlFor="article-code-language">Code language</label>
          <select
            id="article-code-language"
            value={state.codeLanguage}
            onChange={(event) => editor?.chain().focus().updateAttributes('codeBlock', { language: event.target.value }).run()}
            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white/75"
          >
            {CODE_LANGUAGES.map((language) => <option key={language} value={language}>{language}</option>)}
          </select>
        </div>
      ) : null}

      {mode === 'edit' ? (
        <EditorContent
          editor={editor}
          className={`article-rich-content article-editor-surface overflow-y-auto bg-white text-slate-800 ${fullscreen ? 'min-h-0 flex-1' : 'min-h-[560px]'}`}
        />
      ) : (
        <div
          className={`article-rich-content overflow-y-auto bg-white p-6 text-slate-800 md:p-10 ${fullscreen ? 'min-h-0 flex-1' : 'min-h-[560px]'}`}
          dangerouslySetInnerHTML={{ __html: renderArticleContent(value, 'html') }}
        />
      )}

      <div className="border-t border-white/10 bg-slate-950/80 px-4 py-2 text-xs text-white/40">
        Use the toolbar to format content visually. Tables, images and code blocks render consistently in preview and on the published article.
      </div>
    </div>
  );
}
