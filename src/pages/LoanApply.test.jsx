import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanApply from './LoanApply';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Select component
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }) => <>{children}</>,
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
  SelectValue: ({ placeholder }) => <option disabled value="">{placeholder}</option>,
}));

describe('LoanApply Page', () => {
  const mockUser = { id: '1' };
  const mockAccounts = [{ accountId: '1', accountNumber: '12345678' }];
  const mockCreateMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    useQuery.mockReturnValue({ data: mockAccounts, isLoading: false });
    useMutation.mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    });
  });

  it('renders loan apply form', () => {
    render(
      <BrowserRouter>
        <LoanApply />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Term/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Purpose/i)).toBeInTheDocument();
  });

  it('shows error toast if form is incomplete', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <LoanApply />
      </BrowserRouter>
    );
    
    // Default amount is empty, term is "12"
    await user.click(screen.getByRole('button', { name: /Submit application/i }));
    expect(toast.error).toHaveBeenCalledWith("Enter a valid amount");
  });

  it('calls create mutation on valid submission', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <LoanApply />
      </BrowserRouter>
    );
    
    await user.type(screen.getByLabelText(/Amount/i), '5000');
    
    const accountSelect = screen.getByRole('combobox');
    await user.selectOptions(accountSelect, '1');
    
    await user.type(screen.getByLabelText(/Purpose/i), 'Buying a car');

    await user.click(screen.getByRole('button', { name: /Submit application/i }));
    expect(mockCreateMutate).toHaveBeenCalled();
  });
});
