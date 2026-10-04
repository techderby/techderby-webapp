import JSZip from 'jszip';
import { MAILING_LIST_CATEGORIES, type MailingListCategory } from '../constants/mailing-list';

export type MailingListImportEntry = {
  email: string;
  category?: MailingListCategory;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_HEADERS = new Set(['email', 'email address', 'emailaddress', 'e-mail', 'e-mail address']);
const CATEGORY_HEADERS = new Set(['category', 'subscriber category', 'mailing list category']);

function canonicalCategory(value: string): MailingListCategory | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'general') return 'None';
  return MAILING_LIST_CATEGORIES.find((category) => category.toLowerCase() === normalized) ?? null;
}

export function parseMailingListCsv(contents: string): MailingListImportEntry[] {
  return parseMailingListRows(parseCsv(contents));
}

export async function parseMailingListFile(file: File): Promise<MailingListImportEntry[]> {
  const filename = file.name.toLowerCase();
  if (filename.endsWith('.csv') || file.type === 'text/csv') {
    return parseMailingListCsv(await readFileAsText(file));
  }
  if (!filename.endsWith('.xlsx')) {
    throw new Error('Select a CSV or Excel (.xlsx) file.');
  }

  return parseMailingListRows(await readFirstExcelWorksheet(await readFileAsArrayBuffer(file)));
}

export function parseMailingListRows(rows: string[][]): MailingListImportEntry[] {
  if (!rows.length) return [];

  const headerIndex = rows.findIndex((row) => row.some((cell) => EMAIL_HEADERS.has(cell.trim().toLowerCase())));
  const header = headerIndex >= 0 ? rows[headerIndex] : [];
  const emailColumn = header.findIndex((cell) => EMAIL_HEADERS.has(cell.trim().toLowerCase()));
  const categoryColumn = header.findIndex((cell) => CATEGORY_HEADERS.has(cell.trim().toLowerCase()));
  const entriesByEmail = new Map<string, MailingListImportEntry>();

  rows.slice(headerIndex >= 0 ? headerIndex + 1 : 0).forEach((row, rowOffset) => {
    const email = String(emailColumn >= 0 ? row[emailColumn] ?? '' : row.find((cell) => EMAIL_PATTERN.test(cell.trim())) ?? '')
      .trim()
      .toLowerCase();
    if (!email) return;

    let category: MailingListCategory | undefined;
    if (categoryColumn >= 0) {
      const rawCategory = String(row[categoryColumn] ?? '');
      const parsed = canonicalCategory(rawCategory);
      if (!parsed) {
        const spreadsheetRow = (headerIndex >= 0 ? headerIndex + 2 : 1) + rowOffset;
        throw new Error(`Row ${spreadsheetRow} has an unrecognised category: ${rawCategory.trim()}.`);
      }
      category = parsed;
    } else {
      const detected = row
        .map((cell) => canonicalCategory(String(cell)))
        .find((value): value is MailingListCategory => value !== null && value !== 'None');
      if (detected) category = detected;
    }

    const previous = entriesByEmail.get(email);
    entriesByEmail.set(email, {
      email,
      ...(category !== undefined ? { category } : previous?.category !== undefined ? { category: previous.category } : {}),
    });
  });

  return [...entriesByEmail.values()];
}

async function readFirstExcelWorksheet(contents: ArrayBuffer): Promise<string[][]> {
  const archive = await JSZip.loadAsync(contents);
  const workbookSource = await archive.file('xl/workbook.xml')?.async('string');
  const relationshipSource = await archive.file('xl/_rels/workbook.xml.rels')?.async('string');
  if (!workbookSource || !relationshipSource) throw new Error('The Excel workbook is missing its worksheet information.');

  const workbook = parseXml(workbookSource, 'The Excel workbook could not be read.');
  const relationships = parseXml(relationshipSource, 'The Excel workbook relationships could not be read.');
  const firstSheet = workbook.getElementsByTagNameNS('*', 'sheet')[0];
  const relationshipId = firstSheet?.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id')
    ?? firstSheet?.getAttribute('r:id');
  if (!relationshipId) throw new Error('The Excel workbook does not contain a worksheet.');

  const relationship = [...relationships.getElementsByTagNameNS('*', 'Relationship')]
    .find((entry) => entry.getAttribute('Id') === relationshipId);
  const target = relationship?.getAttribute('Target');
  if (!target) throw new Error('The first Excel worksheet could not be located.');

  const worksheetPath = target.startsWith('/')
    ? target.slice(1)
    : `xl/${target.replace(/^\.\//, '')}`.replace(/\/[^/]+\/\.\.\//g, '/');
  const worksheetSource = await archive.file(worksheetPath)?.async('string');
  if (!worksheetSource) throw new Error('The first Excel worksheet could not be read.');

  const sharedStringsSource = await archive.file('xl/sharedStrings.xml')?.async('string');
  const sharedStrings = sharedStringsSource
    ? [...parseXml(sharedStringsSource, 'The Excel shared strings could not be read.').getElementsByTagNameNS('*', 'si')]
        .map((entry) => entry.textContent ?? '')
    : [];
  const worksheet = parseXml(worksheetSource, 'The first Excel worksheet could not be read.');

  return [...worksheet.getElementsByTagNameNS('*', 'row')].map((row) => {
    const cells: string[] = [];
    for (const cell of [...row.getElementsByTagNameNS('*', 'c')]) {
      const reference = cell.getAttribute('r') ?? '';
      const column = excelColumnIndex(reference);
      const type = cell.getAttribute('t');
      const rawValue = cell.getElementsByTagNameNS('*', 'v')[0]?.textContent ?? '';
      const value = type === 's'
        ? sharedStrings[Number(rawValue)] ?? ''
        : type === 'inlineStr'
          ? cell.getElementsByTagNameNS('*', 'is')[0]?.textContent ?? ''
          : rawValue;
      cells[column] = value;
    }
    return cells.map((value) => value ?? '');
  });
}

function parseXml(source: string, errorMessage: string): Document {
  const document = new DOMParser().parseFromString(source, 'application/xml');
  if (document.getElementsByTagName('parsererror').length) throw new Error(errorMessage);
  return document;
}

function excelColumnIndex(reference: string): number {
  const letters = reference.match(/^[A-Z]+/i)?.[0]?.toUpperCase() ?? 'A';
  return [...letters].reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text();
  return readFile(file, 'text') as Promise<string>;
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return readFile(file, 'arrayBuffer') as Promise<ArrayBuffer>;
}

function readFile(file: File, resultType: 'text' | 'arrayBuffer'): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The selected file could not be read.'));
    reader.onload = () => {
      if (typeof reader.result === 'string' || reader.result instanceof ArrayBuffer) resolve(reader.result);
      else reject(new Error('The selected file could not be read.'));
    };
    if (resultType === 'text') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });
}

export function parseCsv(contents: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < contents.length; index += 1) {
    const character = contents[index];
    const next = contents[index + 1];

    if (character === '"') {
      if (quoted && next === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}
