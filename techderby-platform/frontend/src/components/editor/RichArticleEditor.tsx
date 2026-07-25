import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { common, createLowlight } from 'lowlight';
import { renderArticleContent, sanitizeArticleHtml } from '../../lib/article-content';

const lowlight = createLowlight(common);
const CODE_LANGUAGES = ['plaintext', 'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby', 'html', 'css', 'sql', 'bash', 'json', 'yaml'];
const FONT_FAMILIES = ['Aptos', 'Arial', 'Calibri', 'Cambria', 'Georgia', 'Times New Roman', 'Verdana', 'Courier New'];
const FONT_SIZES = ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '30pt', '36pt', '48pt'];
const FontWeight = Extension.create({
  name: 'fontWeight',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) => element.style.fontWeight || null,
            renderHTML: (attributes) =>
              attributes.fontWeight ? { style: `font-weight: ${attributes.fontWeight}` } : {},
          },
        },
      },
    ];
  },
});

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
  const docxInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importingDocx, setImportingDocx] = useState(false);
  const [importNotice, setImportNotice] = useState<{ kind: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [mode, setMode] = useState<'edit' | 'source' | 'preview'>('edit');
  const [sourceHtml, setSourceHtml] = useState(value);
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
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
      TextStyleKit,
      FontWeight,
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

  useEffect(() => {
    if (mode !== 'source') setSourceHtml(value);
  }, [mode, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      paragraph: currentEditor?.isActive('paragraph') ?? false,
      heading1: currentEditor?.isActive('heading', { level: 1 }) ?? false,
      heading2: currentEditor?.isActive('heading', { level: 2 }) ?? false,
      heading3: currentEditor?.isActive('heading', { level: 3 }) ?? false,
      heading4: currentEditor?.isActive('heading', { level: 4 }) ?? false,
      heading5: currentEditor?.isActive('heading', { level: 5 }) ?? false,
      heading6: currentEditor?.isActive('heading', { level: 6 }) ?? false,
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
      color: currentEditor?.getAttributes('textStyle').color ?? '#1e293b',
      backgroundColor: currentEditor?.getAttributes('textStyle').backgroundColor ?? '#ffff00',
      fontFamily: currentEditor?.getAttributes('textStyle').fontFamily ?? '',
      fontSize: currentEditor?.getAttributes('textStyle').fontSize ?? '',
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

  async function importWordDocument(file: File | undefined) {
    if (!file || !editor) return;
    if (!editor.isEmpty && !window.confirm('Importing this Word document will replace the current article body. Continue?')) {
      if (docxInputRef.current) docxInputRef.current.value = '';
      return;
    }

    setImportingDocx(true);
    setImportNotice(null);
    try {
      const { importDocxArticle } = await import('../../lib/docx-import');
      const result = await importDocxArticle(file, onUploadImages);
      editor.commands.setContent(result.html, { emitUpdate: true });
      const details = [
        `${file.name} was imported`,
        result.imageCount ? `${result.imageCount} embedded image${result.imageCount === 1 ? '' : 's'} uploaded` : '',
        result.warnings.length ? `${result.warnings.length} item${result.warnings.length === 1 ? '' : 's'} need review: ${result.warnings.join(' ')}` : '',
      ].filter(Boolean);
      setImportNotice({
        kind: result.warnings.length ? 'warning' : 'success',
        message: details.join('. '),
      });
      setMode('edit');
    } catch (error) {
      setImportNotice({
        kind: 'error',
        message: error instanceof Error ? error.message : 'The Word document could not be imported.',
      });
    } finally {
      setImportingDocx(false);
      if (docxInputRef.current) docxInputRef.current.value = '';
    }
  }

  function openHtmlSource() {
    if (mode === 'source') return;
    setSourceHtml(editor?.getHTML() ?? value);
    setMode('source');
  }

  function applyHtmlSource(nextMode: 'edit' | 'preview' = 'edit') {
    if (!editor) return;
    const sanitisedHtml = sanitizeArticleHtml(sourceHtml);
    editor.commands.setContent(sanitisedHtml || '<p></p>', { emitUpdate: true });
    setSourceHtml(sanitisedHtml);
    setImportNotice({
      kind: 'success',
      message: 'HTML applied. Unsupported or unsafe elements and attributes were removed.',
    });
    setMode(nextMode);
  }

  const headingValue = state?.heading1
    ? '1'
    : state?.heading2
      ? '2'
      : state?.heading3
        ? '3'
        : state?.heading4
          ? '4'
          : state?.heading5
            ? '5'
            : state?.heading6
              ? '6'
              : 'paragraph';
  const shellClass = fullscreen
    ? 'fixed inset-0 z-[100] flex flex-col bg-slate-950 p-4 md:p-8'
    : 'overflow-hidden rounded-xl border border-white/10 bg-slate-950/40';
  const editingDisabled = disabled || mode !== 'edit';

  return (
    <div className={shellClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 p-3">
        <fieldset disabled={editingDisabled} className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Text style"
            value={headingValue}
            disabled={!editor || editingDisabled}
            onChange={(event) => {
              const level = Number(event.target.value);
              if (level >= 1 && level <= 6) editor?.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
              else editor?.chain().focus().setParagraph().run();
            }}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white/75"
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>

          <select
            aria-label="Font family"
            value={state?.fontFamily || ''}
            disabled={!editor || editingDisabled}
            onChange={(event) => {
              if (event.target.value) editor?.chain().focus().setFontFamily(event.target.value).run();
              else editor?.chain().focus().unsetFontFamily().run();
            }}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white/75"
          >
            <option value="">Default font</option>
            {FONT_FAMILIES.map((font) => <option key={font} value={font}>{font}</option>)}
          </select>
          <select
            aria-label="Font size"
            value={FONT_SIZES.includes(state?.fontSize) ? state?.fontSize : ''}
            disabled={!editor || editingDisabled}
            onChange={(event) => {
              if (event.target.value) editor?.chain().focus().setFontSize(event.target.value).run();
              else editor?.chain().focus().unsetFontSize().run();
            }}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white/75"
          >
            <option value="">Default size</option>
            {FONT_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          <button type="button" aria-label="Bold" className={toolbarButton(state?.bold)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
          <button type="button" aria-label="Italic" className={toolbarButton(state?.italic)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}><em>I</em></button>
          <button type="button" aria-label="Underline" className={toolbarButton(state?.underline)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></button>
          <button type="button" aria-label="Strikethrough" className={toolbarButton(state?.strike)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></button>
          <label className={`${toolbarButton()} flex cursor-pointer items-center gap-2`} title="Text colour">
            Text
            <input
              aria-label="Text colour"
              type="color"
              value={state?.color || '#1e293b'}
              disabled={!editor || disabled}
              onInput={(event) => editor?.chain().focus().setColor(event.currentTarget.value).run()}
              className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
          <label className={`${toolbarButton()} flex cursor-pointer items-center gap-2`} title="Highlight colour">
            Highlight
            <input
              aria-label="Highlight colour"
              type="color"
              value={state?.backgroundColor || '#ffff00'}
              disabled={!editor || disabled}
              onInput={(event) => editor?.chain().focus().setBackgroundColor(event.currentTarget.value).run()}
              className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
          <button
            type="button"
            className={toolbarButton()}
            disabled={!editor || disabled}
            onClick={() => editor?.chain().focus().unsetColor().unsetBackgroundColor().unsetFontFamily().unsetFontSize().removeEmptyTextStyle().run()}
          >
            Clear style
          </button>
          <button type="button" aria-label="Align left" className={toolbarButton(state?.textAlign === 'left')} disabled={!editor || disabled} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>Left</button>
          <button type="button" aria-label="Align centre" className={toolbarButton(state?.textAlign === 'center')} disabled={!editor || disabled} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>Centre</button>
          <button type="button" aria-label="Align right" className={toolbarButton(state?.textAlign === 'right')} disabled={!editor || disabled} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>Right</button>
          <button type="button" aria-label="Justify" className={toolbarButton(state?.textAlign === 'justify')} disabled={!editor || disabled} onClick={() => editor?.chain().focus().setTextAlign('justify').run()}>Justify</button>
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
          <button
            type="button"
            className={toolbarButton()}
            disabled={!editor || disabled || importingDocx}
            onClick={() => docxInputRef.current?.click()}
          >
            {importingDocx ? 'Importing Word…' : 'Import Word'}
          </button>
          <input
            ref={docxInputRef}
            className="sr-only"
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => importWordDocument(event.target.files?.[0])}
          />
          <button type="button" className={toolbarButton(state?.table)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
          <button type="button" className={toolbarButton(state?.codeBlock)} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleCodeBlock({ language: 'plaintext' }).run()}>Code</button>
          <button type="button" className={toolbarButton()} disabled={!editor || disabled} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>Divider</button>
        </fieldset>

        <div className="flex items-center gap-2">
          <button type="button" className={toolbarButton()} disabled={!state?.canUndo || editingDisabled} onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
          <button type="button" className={toolbarButton()} disabled={!state?.canRedo || editingDisabled} onClick={() => editor?.chain().focus().redo().run()}>Redo</button>
          <button type="button" className={toolbarButton(mode === 'edit')} onClick={() => setMode('edit')}>Visual</button>
          <button type="button" className={toolbarButton(mode === 'source')} disabled={disabled} onClick={openHtmlSource}>HTML</button>
          <button
            type="button"
            className={toolbarButton(mode === 'preview')}
            onClick={() => mode === 'source' ? applyHtmlSource('preview') : setMode('preview')}
          >
            Preview
          </button>
          <button type="button" className={toolbarButton(fullscreen)} onClick={() => setFullscreen((current) => !current)}>{fullscreen ? 'Exit full screen' : 'Full screen'}</button>
        </div>
      </div>

      {importNotice ? (
        <div
          role={importNotice.kind === 'error' ? 'alert' : 'status'}
          className={`border-b px-4 py-3 text-sm ${
            importNotice.kind === 'error'
              ? 'border-red-400/30 bg-red-500/10 text-red-100'
              : importNotice.kind === 'warning'
                ? 'border-amber-400/30 bg-amber-500/10 text-amber-100'
                : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          {importNotice.message}
        </div>
      ) : null}

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
      ) : mode === 'source' ? (
        <div className={`flex flex-col bg-slate-950 ${fullscreen ? 'min-h-0 flex-1' : 'min-h-[560px]'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <p className="text-xs text-white/55">
              Paste article-body HTML only. Scripts, event handlers, forms, iframes and unsafe URLs are removed when applied.
            </p>
            <div className="flex gap-2">
              <button type="button" className={toolbarButton()} onClick={() => setSourceHtml(editor?.getHTML() ?? value)}>
                Reset
              </button>
              <button type="button" className={`${buttonBase} border-sky-400 bg-sky-500 text-white hover:bg-sky-400`} onClick={() => applyHtmlSource()}>
                Apply HTML
              </button>
            </div>
          </div>
          <textarea
            aria-label="Article HTML source"
            value={sourceHtml}
            onChange={(event) => setSourceHtml(event.target.value)}
            spellCheck={false}
            className="min-h-[500px] flex-1 resize-y bg-slate-950 p-5 font-mono text-sm leading-6 text-sky-100 outline-none"
            placeholder="<h2>Your heading</h2>&#10;<p>Your article content…</p>"
          />
        </div>
      ) : (
        <div
          className={`article-rich-content overflow-y-auto bg-white p-6 text-slate-800 md:p-10 ${fullscreen ? 'min-h-0 flex-1' : 'min-h-[560px]'}`}
          dangerouslySetInnerHTML={{ __html: renderArticleContent(value, 'html') }}
        />
      )}

      <div className="border-t border-white/10 bg-slate-950/80 px-4 py-2 text-xs text-white/40">
        Use Visual mode, edit sanitised HTML source, or import a Word .docx file (20 MB maximum). Word headings, lists, tables,
        links, common fonts, sizes, colours, alignment and supported images are retained; page margins, headers, footers and
        floating layouts are intentionally normalised for the responsive website.
      </div>
    </div>
  );
}
