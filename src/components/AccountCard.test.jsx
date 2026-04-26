import { render, screen, fireEvent } from '@testing-library/react';
import { AccountCard } from './AccountCard';
import { expect, it, describe, vi } from 'vitest';

describe('AccountCard Component', () => {
  const mockAccount = {
    id: 1,
    accountName: 'Savings',
    accountNumber: '1234567890',
    accountBalance: 5000,
    currency: 'USD',
    accountType: 2
  };

  it('renders account information correctly', () => {
    render(<AccountCard account={mockAccount} />);
    expect(screen.getByText('Savings')).toBeInTheDocument();
    expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
    // accountNumber should be masked with dots as per format.js
    expect(screen.getByText(/•••• 7890/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<AccountCard account={mockAccount} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary styles when variant is primary', () => {
    const { container } = render(<AccountCard account={mockAccount} variant="primary" />);
    // Check if surface-dark class is applied for primary variant
    expect(container.firstChild).toHaveClass('surface-dark');
  });

  it('applies default styles when variant is default', () => {
    const { container } = render(<AccountCard account={mockAccount} variant="default" />);
    expect(container.firstChild).toHaveClass('bg-card');
    expect(container.firstChild).not.toHaveClass('surface-dark');
  });
});
