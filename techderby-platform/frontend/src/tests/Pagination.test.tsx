import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../components/Pagination';
import { paginateItems } from '../lib/pagination';

describe('Pagination', () => {
  it('clamps the requested page and returns the correct items', () => {
    const result = paginateItems(Array.from({ length: 23 }, (_, index) => index + 1), 8);

    expect(result.page).toBe(3);
    expect(result.totalPages).toBe(3);
    expect(result.start).toBe(21);
    expect(result.end).toBe(23);
    expect(result.items).toEqual([21, 22, 23]);
  });

  it('shows the current range and requests the next page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalItems={26}
        onPageChange={onPageChange}
        itemLabel="members"
      />,
    );

    expect(screen.getByText('Showing 11–20 of 26 members')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
