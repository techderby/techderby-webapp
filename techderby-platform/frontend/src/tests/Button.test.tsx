import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Join</Button>);
    expect(screen.getByRole('button', { name: 'Join' })).toBeInTheDocument();
  });
});
