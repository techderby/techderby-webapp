import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RichArticleEditor } from '../components/editor/RichArticleEditor';

describe('RichArticleEditor HTML source mode', () => {
  it('applies supported HTML and removes executable markup', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RichArticleEditor
        value="<p>Existing article</p>"
        onChange={onChange}
        onUploadImages={async () => []}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'HTML' }));
    const source = screen.getByRole('textbox', { name: 'Article HTML source' });
    fireEvent.change(source, {
      target: {
        value:
          '<h2 style="text-align:center" onclick="alert(1)">Heading</h2><p><span style="color:red;font-weight:600;font-size:18px">Formatted</span></p><script>alert(1)</script>',
      },
    });
    await user.click(screen.getByRole('button', { name: 'Apply HTML' }));

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const appliedHtml = onChange.mock.calls.at(-1)?.[0] as string;
    const rendered = document.createElement('div');
    rendered.innerHTML = appliedHtml;
    const heading = rendered.querySelector('h2');
    const formatted = rendered.querySelector('span');
    expect(heading?.textContent).toBe('Heading');
    expect(heading?.style.textAlign).toBe('center');
    expect(formatted?.style.color).toBe('red');
    expect(formatted?.style.fontWeight).toBe('600');
    expect(formatted?.style.fontSize).toBe('18px');
    expect(appliedHtml).not.toContain('script');
    expect(appliedHtml).not.toContain('onclick');
  });
});
