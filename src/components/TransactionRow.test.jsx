import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionRow } from './TransactionRow';
import { expect, it, describe, vi } from 'vitest';

describe('TransactionRow Component', () => {
  const mockTx = {
    id: 1,
    type: 'Deposit',
    amount: 1000,
    description: 'Salary',
    createdAt: new Date().toISOString(),
  };

  it('renders credit transaction correctly', () => {
    render(<TransactionRow tx={mockTx} />);
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText(/\+£1,000\.00/)).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('renders debit transaction correctly', () => {
    const debitTx = { ...mockTx, type: 'Withdraw', amount: -500 };
    render(<TransactionRow tx={debitTx} />);
    expect(screen.getByText(/-£500\.00/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TransactionRow tx={mockTx} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
