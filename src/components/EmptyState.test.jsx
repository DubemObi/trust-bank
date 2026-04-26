import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { expect, it, describe } from 'vitest';

describe('EmptyState Component', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No data" description="Try again later" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Try again later')).toBeInTheDocument();
  });

  it('renders action button if provided', () => {
    render(<EmptyState title="No data" action={<button>Click me</button>} />);
    expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
  });
});
