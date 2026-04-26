import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Transfer from './Transfer';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery, useMutation } from '@tanstack/react-query';
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the Select component from shadcn/ui
vi.mock('@/components/ui/select', () => {
  let currentId = '';
  return {
    Select: ({ children, onValueChange, value }) => (
      <select id={currentId} data-testid="from-select" value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    ),
    SelectTrigger: ({ children, id }) => {
      currentId = id;
      return <>{children}</>;
    },
    SelectContent: ({ children }) => <>{children}</>,
    SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
    SelectValue: ({ placeholder }) => <option disabled value="">{placeholder}</option>,
  };
});

describe('Transfer Page', () => {
  const mockAccounts = [
    { accountId: '1', accountNumber: '12345678', accountBalance: 1000, currency: 'GBP' },
    { accountId: '2', accountNumber: '87654321', accountBalance: 500, currency: 'GBP' },
  ];
  const mockNavigate = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useQuery.mockReturnValue({ data: mockAccounts, isLoading: false });
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders transfer form correctly', () => {
    render(
      <BrowserRouter>
        <Transfer />
      </BrowserRouter>
    );
    expect(screen.getByText(/From/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  });

  it('shows error if accounts are not picked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Transfer />
      </BrowserRouter>
    );
    
    await user.click(screen.getByRole('button', { name: /Send transfer/i }));
    expect(toast.error).toHaveBeenCalledWith("Pick both accounts");
  });

  it('calls transfer mutation on valid submit', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Transfer />
      </BrowserRouter>
    );
    
    // Pick accounts
    const fromSelect = screen.getByLabelText(/From/i);
    await user.selectOptions(fromSelect, '1');
    
    await user.type(screen.getByLabelText(/To/i), '2');
    await user.type(screen.getByLabelText(/Amount/i), '100');
    await user.click(screen.getByRole('button', { name: /Send transfer/i }));

    expect(mockMutate).toHaveBeenCalled();
  });

  it('shows error if insufficient funds', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Transfer />
      </BrowserRouter>
    );
    
    // Pick account 1 (balance 1000)
    const fromSelect = screen.getByRole('combobox');
    await user.selectOptions(fromSelect, '1');
    
    await user.type(screen.getByLabelText(/To/i), '2');
    await user.type(screen.getByLabelText(/Amount/i), '2000'); // More than 1000
    await user.click(screen.getByRole('button', { name: /Send transfer/i }));

    expect(toast.error).toHaveBeenCalledWith("Insufficient funds");
  });
});
