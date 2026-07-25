import JSZip from 'jszip';
import mammoth from 'mammoth';
import { sanitizeArticleHtml } from './article-content';

export const MAX_DOCX_IMPORT_BYTES = 20 * 1024 * 1024;

export type DocxImportResult = {
  html: string;
  warnings: string[];
  imageCount: number;
};

type CssProperties = {
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: string;
  textAlign?: string;
};

type RunProperties = CssProperties & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
};

type WordStyle = {
  id: string;
  name: string;
  basedOn?: string;
  runProperties?: Element;
  paragraphProperties?: Element;
};

type PreparedDocx = {
  arrayBuffer: ArrayBuffer;
  styleMap: string[];
  classStyles: Map<string, CssProperties>;
};

const WORD_NAMESPACE = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const IMPORTED_FONT_FAMILIES = new Map(
  [
    'Aptos',
    'Arial',
    'Calibri',
    'Cambria',
    'Courier New',
    'Garamond',
    'Georgia',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
  ].map((font) => [font.toLowerCase(), font]),
);

const HIGHLIGHT_COLOURS: Record<string, string> = {
  black: '#000000',
  blue: '#0000ff',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkmagenta: '#8b008b',
  darkred: '#8b0000',
  darkyellow: '#808000',
  green: '#00ff00',
  lightgray: '#d3d3d3',
  magenta: '#ff00ff',
  red: '#ff0000',
  white: '#ffffff',
  yellow: '#ffff00',
};

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function child(element: Element | undefined, localName: string): Element | undefined {
  return element ? Array.from(element.children).find((item) => item.localName === localName) : undefined;
}

function descendants(element: Element | XMLDocument, localName: string): Element[] {
  return Array.from(element.getElementsByTagNameNS('*', localName));
}

function wordAttribute(element: Element | undefined, name: string): string | undefined {
  return element?.getAttributeNS(WORD_NAMESPACE, name) ?? element?.getAttribute(`w:${name}`) ?? undefined;
}

function createWordElement(document: XMLDocument, name: string): Element {
  return document.createElementNS(WORD_NAMESPACE, `w:${name}`);
}

function setWordAttribute(element: Element, name: string, value: string): void {
  element.setAttributeNS(WORD_NAMESPACE, `w:${name}`, value);
}

function parseXml(xml: string, fileName: string): XMLDocument {
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  if (document.querySelector('parsererror')) {
    throw new Error(`The Word document contains invalid XML in ${fileName}.`);
  }
  return document;
}

function parseBooleanProperty(element: Element | undefined): boolean | undefined {
  if (!element) return undefined;
  const value = (wordAttribute(element, 'val') ?? 'true').toLowerCase();
  return !['0', 'false', 'off', 'no', 'none'].includes(value);
}

function normaliseHexColour(value: string | undefined): string | undefined {
  if (!value || value.toLowerCase() === 'auto') return undefined;
  const colour = value.replace(/^#/, '');
  return /^[0-9a-f]{6}$/i.test(colour) ? `#${colour.toLowerCase()}` : undefined;
}

function normaliseFontFamily(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const firstFont = value.split(',')[0]?.replace(/['"]/g, '').trim();
  if (!firstFont) return undefined;
  return IMPORTED_FONT_FAMILIES.get(firstFont.toLowerCase());
}

function readRunProperties(runProperties: Element | undefined): RunProperties {
  if (!runProperties) return {};

  const fontElement = child(runProperties, 'rFonts');
  const fontName =
    wordAttribute(fontElement, 'ascii') ??
    wordAttribute(fontElement, 'hAnsi') ??
    wordAttribute(fontElement, 'eastAsia') ??
    wordAttribute(fontElement, 'cs');
  const halfPointSize = Number(wordAttribute(child(runProperties, 'sz'), 'val'));
  const fontSize =
    Number.isFinite(halfPointSize) && halfPointSize > 0
      ? `${Math.min(72, Math.max(8, halfPointSize / 2))}pt`
      : undefined;
  const highlight = wordAttribute(child(runProperties, 'highlight'), 'val')?.toLowerCase();
  const shading = normaliseHexColour(wordAttribute(child(runProperties, 'shd'), 'fill'));

  return {
    color: normaliseHexColour(wordAttribute(child(runProperties, 'color'), 'val')),
    backgroundColor: (highlight && HIGHLIGHT_COLOURS[highlight]) || shading,
    fontFamily: normaliseFontFamily(fontName),
    fontSize,
    bold: parseBooleanProperty(child(runProperties, 'b')),
    italic: parseBooleanProperty(child(runProperties, 'i')),
    underline: parseBooleanProperty(child(runProperties, 'u')),
    strike: parseBooleanProperty(child(runProperties, 'strike')),
  };
}

function mergeProperties(...properties: RunProperties[]): RunProperties {
  return Object.assign({}, ...properties);
}

function readStyles(document: XMLDocument): Map<string, WordStyle> {
  const styles = new Map<string, WordStyle>();
  descendants(document, 'style').forEach((styleElement) => {
    const id = wordAttribute(styleElement, 'styleId');
    if (!id) return;
    styles.set(id, {
      id,
      name: wordAttribute(child(styleElement, 'name'), 'val') ?? id,
      basedOn: wordAttribute(child(styleElement, 'basedOn'), 'val'),
      runProperties: child(styleElement, 'rPr'),
      paragraphProperties: child(styleElement, 'pPr'),
    });
  });
  return styles;
}

function resolveStyleRunProperties(
  styles: Map<string, WordStyle>,
  styleId: string | undefined,
  visited = new Set<string>(),
): RunProperties {
  if (!styleId || visited.has(styleId)) return {};
  const style = styles.get(styleId);
  if (!style) return {};
  visited.add(styleId);
  return mergeProperties(
    resolveStyleRunProperties(styles, style.basedOn, visited),
    readRunProperties(style.runProperties),
  );
}

function resolveParagraphAlignment(
  styles: Map<string, WordStyle>,
  styleId: string | undefined,
  visited = new Set<string>(),
): string | undefined {
  if (!styleId || visited.has(styleId)) return undefined;
  const style = styles.get(styleId);
  if (!style) return undefined;
  visited.add(styleId);
  return (
    wordAttribute(child(style.paragraphProperties, 'jc'), 'val') ??
    resolveParagraphAlignment(styles, style.basedOn, visited)
  );
}

function findAncestor(element: Element, localName: string): Element | undefined {
  let current = element.parentElement;
  while (current) {
    if (current.localName === localName) return current;
    current = current.parentElement;
  }
  return undefined;
}

function setBooleanRunProperty(runProperties: Element, name: string, value: boolean | undefined): void {
  if (value === undefined) return;
  let property = child(runProperties, name);
  if (!property) {
    property = createWordElement(runProperties.ownerDocument, name);
    runProperties.appendChild(property);
  }
  setWordAttribute(property, 'val', value ? '1' : '0');
}

function addSyntheticStyle(
  stylesDocument: XMLDocument,
  type: 'character' | 'paragraph',
  id: string,
  name: string,
  basedOn?: string,
): void {
  const root = stylesDocument.documentElement;
  const style = createWordElement(stylesDocument, 'style');
  setWordAttribute(style, 'type', type);
  setWordAttribute(style, 'styleId', id);
  const nameElement = createWordElement(stylesDocument, 'name');
  setWordAttribute(nameElement, 'val', name);
  style.appendChild(nameElement);
  if (basedOn) {
    const basedOnElement = createWordElement(stylesDocument, 'basedOn');
    setWordAttribute(basedOnElement, 'val', basedOn);
    style.appendChild(basedOnElement);
  }
  root.appendChild(style);
}

function cssKey(properties: CssProperties): string {
  return JSON.stringify(properties);
}

function paragraphTag(styleName: string | undefined): string {
  const heading = styleName?.match(/heading\s*([1-6])/i);
  if (heading) return `h${heading[1]}`;
  if (styleName && /^title$/i.test(styleName)) return 'h1';
  return 'p';
}

async function prepareDocx(arrayBuffer: ArrayBuffer): Promise<PreparedDocx> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const documentFile = zip.file('word/document.xml');
  const stylesFile = zip.file('word/styles.xml');
  if (!documentFile || !stylesFile) {
    throw new Error('This file is not a supported Word document.');
  }

  const [documentXml, stylesXml] = await Promise.all([
    documentFile.async('string'),
    stylesFile.async('string'),
  ]);
  const document = parseXml(documentXml, 'word/document.xml');
  const stylesDocument = parseXml(stylesXml, 'word/styles.xml');
  const styles = readStyles(stylesDocument);
  const defaultRunProperties = readRunProperties(
    child(child(child(stylesDocument.documentElement, 'docDefaults'), 'rPrDefault'), 'rPr'),
  );
  const styleMap: string[] = ['u => u'];
  const classStyles = new Map<string, CssProperties>();
  const characterStyles = new Map<string, { id: string; name: string; className: string }>();
  const paragraphStyles = new Map<string, { id: string; name: string; className: string }>();

  descendants(document, 'r').forEach((run) => {
    const paragraph = findAncestor(run, 'p');
    const paragraphProperties = child(paragraph, 'pPr');
    const paragraphStyleId = wordAttribute(child(paragraphProperties, 'pStyle'), 'val');
    let runProperties = child(run, 'rPr');
    const runStyleId = wordAttribute(child(runProperties, 'rStyle'), 'val');
    const effectiveProperties = mergeProperties(
      defaultRunProperties,
      resolveStyleRunProperties(styles, paragraphStyleId),
      resolveStyleRunProperties(styles, runStyleId),
      readRunProperties(runProperties),
    );
    const inlineProperties: CssProperties = {
      color: effectiveProperties.color,
      backgroundColor: effectiveProperties.backgroundColor,
      fontFamily: effectiveProperties.fontFamily,
      fontSize: effectiveProperties.fontSize,
    };
    Object.keys(inlineProperties).forEach((key) => {
      if (inlineProperties[key as keyof CssProperties] === undefined) {
        delete inlineProperties[key as keyof CssProperties];
      }
    });
    if (Object.keys(inlineProperties).length === 0) return;

    const key = cssKey(inlineProperties);
    let synthetic = characterStyles.get(key);
    if (!synthetic) {
      const sequence = characterStyles.size + 1;
      synthetic = {
        id: `TDImportChar${sequence}`,
        name: `TD Import Character ${sequence}`,
        className: `td-docx-char-${sequence}`,
      };
      characterStyles.set(key, synthetic);
      classStyles.set(synthetic.className, inlineProperties);
      addSyntheticStyle(stylesDocument, 'character', synthetic.id, synthetic.name);
      styleMap.push(`r[style-name='${synthetic.name}'] => span.${synthetic.className}`);
    }

    if (!runProperties) {
      runProperties = createWordElement(document, 'rPr');
      run.insertBefore(runProperties, run.firstChild);
    }
    let runStyle = child(runProperties, 'rStyle');
    if (!runStyle) {
      runStyle = createWordElement(document, 'rStyle');
      runProperties.insertBefore(runStyle, runProperties.firstChild);
    }
    setWordAttribute(runStyle, 'val', synthetic.id);
    setBooleanRunProperty(runProperties, 'b', effectiveProperties.bold);
    setBooleanRunProperty(runProperties, 'i', effectiveProperties.italic);
    setBooleanRunProperty(runProperties, 'u', effectiveProperties.underline);
    setBooleanRunProperty(runProperties, 'strike', effectiveProperties.strike);
  });

  descendants(document, 'p').forEach((paragraph) => {
    let paragraphProperties = child(paragraph, 'pPr');
    const paragraphStyleElement = child(paragraphProperties, 'pStyle');
    const paragraphStyleId = wordAttribute(paragraphStyleElement, 'val');
    const styleName = paragraphStyleId ? styles.get(paragraphStyleId)?.name : undefined;
    const directAlignment = wordAttribute(child(paragraphProperties, 'jc'), 'val');
    const alignment = (directAlignment ?? resolveParagraphAlignment(styles, paragraphStyleId))?.toLowerCase();
    const cssAlignment =
      alignment === 'both' || alignment === 'distribute'
        ? 'justify'
        : alignment === 'start'
          ? 'left'
          : alignment === 'end'
            ? 'right'
            : alignment;
    if (!cssAlignment || !['center', 'right', 'justify'].includes(cssAlignment)) return;

    const tag = paragraphTag(styleName);
    const key = `${paragraphStyleId ?? ''}|${tag}|${cssAlignment}`;
    let synthetic = paragraphStyles.get(key);
    if (!synthetic) {
      const sequence = paragraphStyles.size + 1;
      synthetic = {
        id: `TDImportPara${sequence}`,
        name: `TD Import Paragraph ${sequence}`,
        className: `td-docx-para-${sequence}`,
      };
      paragraphStyles.set(key, synthetic);
      classStyles.set(synthetic.className, {});
      addSyntheticStyle(stylesDocument, 'paragraph', synthetic.id, synthetic.name, paragraphStyleId);
      styleMap.push(`p[style-name='${synthetic.name}'] => ${tag}.${synthetic.className}:fresh`);
    }

    classStyles.set(synthetic.className, { ...classStyles.get(synthetic.className), textAlign: cssAlignment });
    if (!paragraphProperties) {
      paragraphProperties = createWordElement(document, 'pPr');
      paragraph.insertBefore(paragraphProperties, paragraph.firstChild);
    }
    let paragraphStyle = child(paragraphProperties, 'pStyle');
    if (!paragraphStyle) {
      paragraphStyle = createWordElement(document, 'pStyle');
      paragraphProperties.insertBefore(paragraphStyle, paragraphProperties.firstChild);
    }
    setWordAttribute(paragraphStyle, 'val', synthetic.id);
  });

  zip.file('word/document.xml', new XMLSerializer().serializeToString(document));
  zip.file('word/styles.xml', new XMLSerializer().serializeToString(stylesDocument));
  return {
    arrayBuffer: await zip.generateAsync({ type: 'arraybuffer' }),
    styleMap,
    classStyles,
  };
}

function applyClassStyles(html: string, classStyles: Map<string, CssProperties>): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  classStyles.forEach((properties, className) => {
    template.content.querySelectorAll<HTMLElement>(`.${className}`).forEach((element) => {
      if (properties.color) element.style.color = properties.color;
      if (properties.backgroundColor) element.style.backgroundColor = properties.backgroundColor;
      if (properties.fontFamily) element.style.fontFamily = properties.fontFamily;
      if (properties.fontSize) element.style.fontSize = properties.fontSize;
      if ('textAlign' in properties && properties.textAlign) {
        element.style.textAlign = properties.textAlign;
      }
      element.classList.remove(className);
      if (!element.className) element.removeAttribute('class');
    });
  });
  template.content.querySelectorAll('img:not([src]), img[src=""]').forEach((image) => image.remove());
  return template.innerHTML;
}

function imageExtension(contentType: string): string {
  if (contentType === 'image/jpeg') return 'jpg';
  if (contentType === 'image/webp') return 'webp';
  return 'png';
}

export async function importDocxArticle(
  file: File,
  uploadImages: (files: File[]) => Promise<string[]>,
): Promise<DocxImportResult> {
  if (!file.name.toLowerCase().endsWith('.docx')) {
    throw new Error('Select a Microsoft Word .docx file.');
  }
  if (file.size > MAX_DOCX_IMPORT_BYTES) {
    throw new Error('The Word document must be 20 MB or smaller.');
  }

  const warnings: string[] = [];
  let imageCount = 0;
  const prepared = await prepareDocx(await file.arrayBuffer());
  const nodeBuffer = (
    globalThis as typeof globalThis & {
      Buffer?: { from(value: ArrayBuffer): Uint8Array };
    }
  ).Buffer;
  const mammothInput = nodeBuffer
    ? ({ buffer: nodeBuffer.from(prepared.arrayBuffer) } as Parameters<typeof mammoth.convertToHtml>[0])
    : { arrayBuffer: prepared.arrayBuffer };
  const result = await mammoth.convertToHtml(
    mammothInput,
    {
      includeDefaultStyleMap: true,
      styleMap: prepared.styleMap,
      ignoreEmptyParagraphs: false,
      convertImage: mammoth.images.imgElement(async (image) => {
        if (!IMAGE_MIME_TYPES.has(image.contentType)) {
          warnings.push(
            `An embedded ${image.contentType || 'unknown'} image was omitted. Use JPEG, PNG or WebP images.`,
          );
          return { src: '' };
        }
        const imageBuffer = await image.readAsArrayBuffer();
        const imageFile = new File(
          [imageBuffer],
          `word-image-${imageCount + 1}.${imageExtension(image.contentType)}`,
          { type: image.contentType },
        );
        const urls = await uploadImages([imageFile]);
        if (!urls[0]) throw new Error('An embedded image could not be uploaded.');
        imageCount += 1;
        return { src: urls[0] };
      }),
    },
  );

  result.messages.forEach((message) => {
    warnings.push(message.message);
  });
  const html = sanitizeArticleHtml(applyClassStyles(result.value, prepared.classStyles));
  if (!html.trim()) {
    throw new Error('No publishable content was found in this Word document.');
  }
  return {
    html,
    imageCount,
    warnings: Array.from(new Set(warnings.filter(Boolean))),
  };
}
