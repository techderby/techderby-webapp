import { articleContentForEditor, renderArticleContent, sanitizeArticleHtml } from '../lib/article-content';

describe('article content rendering', () => {
  it('renders legacy Markdown articles for backward compatibility', () => {
    const html = renderArticleContent(
      '## Heading\n\n- First\n- Second\n\n| Option | Owner |\n|---|---|\n| Managed | Microsoft |\n\n**Important**',
      'markdown',
    );

    expect(html).toContain('<h2>Heading</h2>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>First</li>');
    expect(html).toContain('<th>Option</th>');
    expect(html).toContain('<td>Microsoft</td>');
    expect(html).toContain('<strong>Important</strong>');
  });

  it('preserves rich tables and code blocks', () => {
    const html = renderArticleContent(
      '<table><thead><tr><th>Option</th></tr></thead><tbody><tr><td>Managed</td></tr></tbody></table><pre data-language="typescript"><code class="language-typescript">const safe = true;</code></pre>',
      'html',
    );

    expect(html).toContain('<table>');
    expect(html).toContain('<th>Option</th>');
    expect(html).toContain('language-typescript');
    expect(html).toContain('hljs-keyword');
    expect(html.match(/class="tableWrapper"/g)).toHaveLength(1);
    const rendered = document.createElement('div');
    rendered.innerHTML = html;
    expect(rendered.textContent).toContain('const safe = true;');
  });

  it('does not nest the responsive wrapper around an already wrapped table', () => {
    const html = renderArticleContent(
      '<div class="tableWrapper"><table><tbody><tr><td>Decision</td></tr></tbody></table></div>',
      'html',
    );

    expect(html.match(/class="tableWrapper"/g)).toHaveLength(1);
  });

  it('removes executable HTML and unsafe URLs', () => {
    const html = sanitizeArticleHtml(
      '<p onclick="alert(1)">Safe</p><script>alert(1)</script><a href="javascript:alert(1)">Unsafe link</a><img src="javascript:alert(1)" onerror="alert(1)">',
    );

    expect(html).toContain('<p>Safe</p>');
    expect(html).not.toContain('script');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('javascript:');
  });

  it('preserves supported article text styling', () => {
    const html = sanitizeArticleHtml(
      '<p style="text-align:center"><span style="color:#123456;background-color:#ffee00;font-family:Georgia;font-size:18pt">Formatted text</span></p>',
    );
    const rendered = document.createElement('div');
    rendered.innerHTML = html;
    const paragraph = rendered.querySelector('p');
    const span = rendered.querySelector('span');

    expect(paragraph?.style.textAlign).toBe('center');
    expect(span?.style.color).toBe('rgb(18, 52, 86)');
    expect(span?.style.backgroundColor).toBe('rgb(255, 238, 0)');
    expect(span?.style.fontFamily).toBe('Georgia');
    expect(span?.style.fontSize).toBe('18pt');
  });

  it('converts an existing Markdown article into editor-ready HTML', () => {
    expect(articleContentForEditor('# Existing article', 'markdown')).toContain('<h1>Existing article</h1>');
  });
});
