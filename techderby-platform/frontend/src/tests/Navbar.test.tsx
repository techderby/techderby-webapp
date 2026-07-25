import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('shows primary navigation links', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Tech Derby home' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle menu' })).toBeInTheDocument();
  });

  it('keeps the member menu open until it is explicitly dismissed', async () => {
    const user = userEvent.setup();
    const member = { id: 7, username: 'akin', email: 'akin@example.com', firstName: 'Akin' };
    localStorage.setItem('td_jwt', 'test-token');
    localStorage.setItem('td_user', JSON.stringify(member));
    vi.spyOn(apiClient, 'getMyProfile').mockResolvedValue(
      { data: member } as unknown as Awaited<ReturnType<typeof apiClient.getMyProfile>>,
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>,
    );

    const accountButton = screen.getByRole('button', { name: /Akin/i });
    await user.click(accountButton);
    expect(screen.getByRole('menuitem', { name: 'Dashboard' })).toBeVisible();

    fireEvent.mouseLeave(accountButton.parentElement as HTMLElement);
    expect(screen.getByRole('menuitem', { name: 'Dashboard' })).toBeVisible();

    await user.click(accountButton);
    expect(screen.queryByRole('menuitem', { name: 'Dashboard' })).not.toBeInTheDocument();
  });
});
