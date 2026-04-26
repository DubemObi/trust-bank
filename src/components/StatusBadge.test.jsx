import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import { expect, it, describe } from 'vitest';

describe('StatusBadge Component', () => {
  it('renders approved status correctly', () => {
    render(<StatusBadge status="Approved" />);
    const badge = screen.getByText('Approved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-success');
  });

  it('renders rejected status correctly', () => {
    render(<StatusBadge status="Rejected" />);
    const badge = screen.getByText('Rejected');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-destructive');
  });

  it('renders pending status as default', () => {
    render(<StatusBadge status={null} />);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary/15');
  });
});
