import JSZip from 'jszip';
import { importDocxArticle } from '../lib/docx-import';

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const PACKAGE_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOCUMENT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="22"/></w:rPr></w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:basedOn w:val="Normal"/>
  </w:style>
</w:styles>`;

const DOCUMENT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/><w:jc w:val="center"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:color w:val="FF0000"/><w:rFonts w:ascii="Georgia"/><w:sz w:val="36"/></w:rPr>
        <w:t>Architecture decisions</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:u w:val="single"/></w:rPr><w:t>Imported body text</w:t></w:r>
    </w:p>
    <w:sectPr/>
  </w:body>
</w:document>`;

async function createDocxFile(): Promise<File> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', CONTENT_TYPES);
  zip.file('_rels/.rels', PACKAGE_RELS);
  zip.file('word/document.xml', DOCUMENT);
  zip.file('word/styles.xml', STYLES);
  zip.file('word/_rels/document.xml.rels', DOCUMENT_RELS);
  const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  const file = new File([arrayBuffer], 'prepared-article.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  if (typeof file.arrayBuffer !== 'function') {
    Object.defineProperty(file, 'arrayBuffer', { value: async () => arrayBuffer });
  }
  return file;
}

describe('Word article import', () => {
  it('retains semantic and supported inline formatting', async () => {
    const uploadImages = vi.fn(async () => [] as string[]);
    const result = await importDocxArticle(await createDocxFile(), uploadImages);
    const rendered = document.createElement('div');
    rendered.innerHTML = result.html;
    const heading = rendered.querySelector('h1');
    const formattedText = heading?.querySelector('span');

    expect(heading?.style.textAlign).toBe('center');
    expect(result.html).toContain('<strong>');
    expect(formattedText?.style.color).toBe('rgb(255, 0, 0)');
    expect(formattedText?.style.fontFamily).toBe('Georgia');
    expect(formattedText?.style.fontSize).toBe('18pt');
    expect(result.html).toContain('<u>Imported body text</u>');
    expect(result.imageCount).toBe(0);
    expect(uploadImages).not.toHaveBeenCalled();
  });

  it('rejects files that are not .docx documents', async () => {
    const file = new File(['text'], 'article.doc');
    await expect(importDocxArticle(file, async () => [])).rejects.toThrow(
      'Select a Microsoft Word .docx file.',
    );
  });
});
