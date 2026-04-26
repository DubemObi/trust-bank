import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Transactions from './Transactions';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Transactions Page', () => {
  const mockTransactions = [
    { id: '1', transactionId: 'TX1', description: 'Groceries', amount: -50, createdAt: new Date().toISOString(), type: 'Withdraw' },
    { id: '2', transactionId: 'TX2', description: 'Salary', amount: 3000, createdAt: new Date().toISOString(), type: 'Deposit' },
  ];
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useQuery.mockReturnValue({ data: mockTransactions, isLoading: false, error: null });
  });

  it('renders transactions list correctly', () => {
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('navigates to detail when a row is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    
    await user.click(screen.getByText('Groceries'));
    expect(mockNavigate).toHaveBeenCalledWith('/transactions/TX1');
  });

  it('shows empty state when no transactions exist', () => {
    useQuery.mockReturnValue({ data: [], isLoading: false, error: null });
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    expect(screen.getByText(/No transactions yet/i)).toBeInTheDocument();
  });
});
