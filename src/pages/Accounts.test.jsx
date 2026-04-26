import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accounts from './Accounts';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
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

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Dialog component
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogTrigger: ({ children }) => <div data-testid="dialog-trigger">{children}</div>,
}));

// Mock PageHeader explicitly to ensure it renders the action prop
vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({ title, subtitle, action }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {action && <div data-testid="header-action">{action}</div>}
    </div>
  ),
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

describe('Accounts Page', () => {
  const mockUser = { id: '1' };
  const mockAccounts = [
    { accountId: '1', accountName: 'Main', accountBalance: 1000, accountNumber: '123', accountType: 1 },
  ];
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

  it('renders accounts list correctly', () => {
    render(
      <BrowserRouter>
        <Accounts />
      </BrowserRouter>
    );
    // Use getAllByText and pick the first one
    const checkingLabels = screen.getAllByText('Checking');
    expect(checkingLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/£1,000\.00/i)).toBeInTheDocument();
  });

  it('shows empty state when no accounts exist', () => {
    useQuery.mockReturnValue({ data: [], isLoading: false });
    render(
      <BrowserRouter>
        <Accounts />
      </BrowserRouter>
    );
    expect(screen.getByText(/No accounts yet/i)).toBeInTheDocument();
  });

  it('calls create mutation when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Accounts />
      </BrowserRouter>
    );
    
    // Find button by testid added in mock
    const trigger = screen.getByTestId('dialog-trigger');
    const newBtn = trigger.querySelector('button');
    await user.click(newBtn);
    
    const nameInput = screen.getByLabelText(/Account name/i);
    await user.type(nameInput, 'New Savings');
    
    // Pick the "Create account" button in the dialog area
    const createBtns = screen.getAllByRole('button', { name: /Create account/i });
    await user.click(createBtns[0]);
    expect(mockCreateMutate).toHaveBeenCalled();
  });
});
