import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardRequestForm from './CardRequestForm';
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

describe('CardRequestForm Page', () => {
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

  it('renders card request form', () => {
    render(
      <BrowserRouter>
        <CardRequestForm />
      </BrowserRouter>
    );
    // Find labels specifically
    expect(screen.getByText('Card type', { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByText('Card Brand', { selector: 'label' })).toBeInTheDocument();
  });

  it('shows error toast if form is incomplete', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CardRequestForm />
      </BrowserRouter>
    );
    
    await user.click(screen.getByRole('button', { name: /Submit request/i }));
    expect(toast.error).toHaveBeenCalledWith("Pick an account");
  });

  it('calls create mutation on valid submission', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CardRequestForm />
      </BrowserRouter>
    );
    
    // Selects
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], '1'); // Account
    await user.selectOptions(selects[1], 'Debit'); // Card type
    await user.selectOptions(selects[2], 'Visa'); // Brand

    await user.click(screen.getByRole('button', { name: /Submit request/i }));
    expect(mockCreateMutate).toHaveBeenCalled();
  });
});
