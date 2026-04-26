import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminUsers from './AdminUsers';
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

// Mock Select and Dialog
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }) => (
    <select data-testid="role-select" value={value} onChange={(e) => onValueChange(e.target.value)}>
      <option value="">Select</option>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }) => <>{children}</>,
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
  SelectValue: ({ placeholder }) => <option disabled value="">{placeholder}</option>,
}));

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

describe('AdminUsers Page', () => {
  const mockUsers = [
    { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', roles: ['Admin'] },
    { id: '2', firstName: 'Plain', lastName: 'User', email: 'plain@example.com', roles: [] },
  ];
  const mockRoles = [{ id: 'r1', name: 'Manager' }];
  const mockAssignMutate = vi.fn();
  const mockRemoveMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[1] === 'users') return { data: mockUsers, isLoading: false };
      if (queryKey[1] === 'roles') return { data: mockRoles, isLoading: false };
      return { data: null, isLoading: false };
    });
    useMutation.mockImplementation(({ mutationFn }) => {
        // Distinguish between assign and remove based on context if needed
        return {
            mutate: mutationFn.name === 'mutationFn' ? mockRemoveMutate : mockAssignMutate,
            isPending: false,
        };
    });
    // Simpler mock for testing just trigger
    useMutation.mockReturnValue({
        mutate: mockAssignMutate,
        isPending: false,
    });
  });

  it('renders users list correctly', () => {
    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    );
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('plain@example.com')).toBeInTheDocument();
  });

  it('calls assign mutation when role is picked and button clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminUsers />
      </BrowserRouter>
    );
    
    const selects = screen.getAllByTestId('role-select');
    await user.selectOptions(selects[1], 'Manager'); // Second user (index 1)
    
    const assignBtns = screen.getAllByRole('button', { name: /Assign/i });
    await user.click(assignBtns[1]);
    
    expect(mockAssignMutate).toHaveBeenCalled();
  });
});
