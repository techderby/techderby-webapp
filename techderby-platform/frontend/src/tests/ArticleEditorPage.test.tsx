import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ArticleEditorPage from '../pages/dashboard/ArticleEditorPage';
import { apiClient } from '../lib/api';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 7, memberRole: 'editor' } }),
}));

vi.mock('../components/editor/RichArticleEditor', () => ({
  RichArticleEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea aria-label="Article content" value={value} onChange={(event) => onChange(event.target.value)} />
  ),
}));

vi.mock('../lib/api', () => ({
  apiClient: {
    getMyArticles: vi.fn(),
    getEditorialAdminOverview: vi.fn(),
    createArticle: vi.fn(),
    updateArticle: vi.fn(),
    submitArticle: vi.fn(),
    reviewArticle: vi.fn(),
    uploadArticleAssets: vi.fn(),
  },
}));

const savedDraft = {
  id: 12,
  documentId: 'draft-document-id',
  title: 'Working title',
  slug: 'working-title',
  featuredImage: '',
  featuredImageUrl: '',
  content: '',
  contentFormat: 'html' as const,
  author: 'Test Writer',
  authorUserId: 7,
  excerpt: '',
  tags: [],
  category: 'News - Technology',
  workflowStatus: 'draft' as const,
};

function CurrentPath() {
  return <div data-testid="current-path">{useLocation().pathname}</div>;
}

function renderEditor(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <CurrentPath />
        <Routes>
          <Route path="/dashboard/articles/new" element={<ArticleEditorPage />} />
          <Route path="/dashboard/articles/:documentId/edit" element={<ArticleEditorPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Article draft saving', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.getMyArticles).mockResolvedValue({ data: { data: [savedDraft] } } as never);
    vi.mocked(apiClient.createArticle).mockResolvedValue({ data: { data: savedDraft } } as never);
    vi.mocked(apiClient.updateArticle).mockResolvedValue({ data: { data: savedDraft } } as never);
  });

  it('saves a partially written article without requiring an excerpt, content, or image', async () => {
    const user = userEvent.setup();
    renderEditor('/dashboard/articles/new');

    await user.type(screen.getByRole('textbox', { name: /Title/ }), 'Working title');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() => expect(apiClient.createArticle).toHaveBeenCalledTimes(1));
    const payload = vi.mocked(apiClient.createArticle).mock.calls[0][0];
    expect(payload.get('title')).toBe('Working title');
    expect(payload.get('excerpt')).toBe('');
    expect(payload.get('featuredImage')).toBeNull();
    expect(apiClient.submitArticle).not.toHaveBeenCalled();
    expect(await screen.findByRole('status')).toHaveTextContent('Draft saved');
    expect(screen.getByTestId('current-path')).toHaveTextContent('/dashboard/articles/draft-document-id/edit');
  });

  it('loads a saved draft and updates the same article when the writer returns', async () => {
    const user = userEvent.setup();
    renderEditor('/dashboard/articles/draft-document-id/edit');

    const title = await screen.findByRole('textbox', { name: /Title/ });
    expect(title).toHaveValue('Working title');
    await user.clear(title);
    await user.type(title, 'Revised working title');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() => expect(apiClient.updateArticle).toHaveBeenCalledTimes(1));
    expect(apiClient.updateArticle).toHaveBeenCalledWith('draft-document-id', expect.any(FormData));
    expect(apiClient.createArticle).not.toHaveBeenCalled();
    expect(await screen.findByRole('status')).toHaveTextContent('Draft saved');
  });
});
