import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminAccounts from './AdminAccounts';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

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

describe('AdminAccounts Page', () => {
  const mockAccounts = [
    { accountId: '1', accountName: 'John', accountBalance: 1000, accountNumber: '12345678', accountType: 'Checking' },
  ];
  const mockRemoveMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockReturnValue({ data: mockAccounts, isLoading: false });
    useMutation.mockReturnValue({
      mutate: mockRemoveMutate,
      isPending: false,
    });
  });

  it('renders accounts list correctly', () => {
    render(
      <BrowserRouter>
        <AdminAccounts />
      </BrowserRouter>
    );
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/1,000/i)).toBeInTheDocument();
  });

  it('calls remove mutation when delete is confirmed', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminAccounts />
      </BrowserRouter>
    );
    
    // There's only one "Delete" action button per account (Trash icon trigger)
    // and one "Delete" confirmation button in the dialog.
    const trashBtn = screen.getByRole('button', { name: '' }); // The icon button has no text
    await user.click(trashBtn);
    
    const confirmBtn = screen.getByRole('button', { name: /^Delete$/ });
    await user.click(confirmBtn);
    expect(mockRemoveMutate).toHaveBeenCalledWith('1');
  });
});
