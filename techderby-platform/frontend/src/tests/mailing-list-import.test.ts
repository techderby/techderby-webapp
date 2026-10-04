import JSZip from 'jszip';
import { parseMailingListCsv, parseMailingListFile } from '../lib/mailing-list-import';

describe('parseMailingListCsv', () => {
  it('reads categories and keeps the last category supplied for a duplicate email', () => {
    const entries = parseMailingListCsv([
      'email,category',
      'member@example.com,Students',
      'founder@example.com,Startup Founder',
      'member@example.com,Employee (Tech Professional/Enthusiast)',
    ].join('\n'));

    expect(entries).toEqual([
      { email: 'member@example.com', category: 'Employee (Tech Professional/Enthusiast)' },
      { email: 'founder@example.com', category: 'Startup Founder' },
    ]);
  });

  it('uses None when a category column is present but blank', () => {
    expect(parseMailingListCsv('email,category\nmember@example.com,')).toEqual([
      { email: 'member@example.com', category: 'None' },
    ]);
  });

  it('does not overwrite a category when the imported file has no category column', () => {
    expect(parseMailingListCsv('email\nmember@example.com')).toEqual([
      { email: 'member@example.com' },
    ]);
  });

  it('rejects unrecognised categories instead of silently clearing existing data', () => {
    expect(() => parseMailingListCsv('email,category\nmember@example.com,Unknown group'))
      .toThrow('Row 2 has an unrecognised category: Unknown group.');
  });

  it('imports email and category values from an Excel workbook', async () => {
    const archive = new JSZip();
    archive.file('xl/workbook.xml', `<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Subscribers" sheetId="1" r:id="rId1"/></sheets></workbook>`);
    archive.file('xl/_rels/workbook.xml.rels', `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`);
    archive.file('xl/sharedStrings.xml', `<?xml version="1.0"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><si><t>email</t></si><si><t>category</t></si><si><t>member@example.com</t></si><si><t>Students</t></si></sst>`);
    archive.file('xl/worksheets/sheet1.xml', `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row><row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2" t="s"><v>3</v></c></row></sheetData></worksheet>`);
    const workbook = await archive.generateAsync({ type: 'uint8array' });
    const file = new File([workbook], 'subscribers.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    await expect(parseMailingListFile(file)).resolves.toEqual([
      { email: 'member@example.com', category: 'Students' },
    ]);
  });
});
