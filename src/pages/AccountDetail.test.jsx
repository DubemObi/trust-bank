import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountDetail from './AccountDetail';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams, BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock AlertDialog
vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }) => <div>{children}</div>,
  AlertDialogAction: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({ children }) => <button>{children}</button>,
  AlertDialogContent: ({ children }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }) => <h2>{children}</h2>,
  AlertDialogTrigger: ({ children }) => <>{children}</>,
}));

describe('AccountDetail Page', () => {
  const mockAccount = { accountId: '1', accountName: 'Main', accountBalance: 1000, accountNumber: '123', accountType: 1 };
  const mockTransactions = [
    { transactionId: 'TX1', accountId: 1, description: 'Groceries', amount: -50, createdAt: new Date().toISOString(), type: 'Withdraw' },
  ];
  const mockNavigate = vi.fn();
  const mockRemoveMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: '1' });
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'account') return { data: mockAccount, isLoading: false };
      if (queryKey[0] === 'transactions') return { data: mockTransactions, isLoading: false };
      return { data: null, isLoading: false };
    });
    useMutation.mockReturnValue({
      mutate: mockRemoveMutate,
      isPending: false,
    });
  });

  it('renders account and transaction details', () => {
    render(
      <BrowserRouter>
        <AccountDetail />
      </BrowserRouter>
    );
    expect(screen.getByText('Checking')).toBeInTheDocument(); // accountType 1
    expect(screen.getByText(/£1,000\.00/i)).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('navigates to actions correctly', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AccountDetail />
      </BrowserRouter>
    );
    
    await user.click(screen.getByText(/Deposit/i));
    expect(mockNavigate).toHaveBeenCalledWith('/deposit?account=1');
    
    await user.click(screen.getByText(/Withdraw/i));
    expect(mockNavigate).toHaveBeenCalledWith('/withdraw?account=1');
  });

  it('calls remove mutation when delete is confirmed', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AccountDetail />
      </BrowserRouter>
    );
    
    await user.click(screen.getByText(/Delete account/i));
    await user.click(screen.getByRole('button', { name: /^Delete$/ }));
    expect(mockRemoveMutate).toHaveBeenCalled();
  });
});
