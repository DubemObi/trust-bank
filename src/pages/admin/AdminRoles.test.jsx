import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminRoles from './AdminRoles';
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

// Mock Dialog
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

describe('AdminRoles Page', () => {
  const mockRoles = [{ id: '1', name: 'Admin' }, { id: '2', name: 'Manager' }];
  const mockCreateMutate = vi.fn();
  const mockRemoveMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockReturnValue({ data: mockRoles, isLoading: false });
    useMutation.mockImplementation(({ mutationFn }) => {
        return {
            mutate: mutationFn.name === 'mutationFn' ? mockRemoveMutate : mockCreateMutate,
            isPending: false,
        };
    });
    // Simplified for trigger test
    useMutation.mockReturnValue({
        mutate: mockCreateMutate,
        isPending: false,
    });
  });

  it('renders roles list correctly', () => {
    render(
      <BrowserRouter>
        <AdminRoles />
      </BrowserRouter>
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('calls create mutation on form submit', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminRoles />
      </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText(/New role name/i);
    await user.type(input, 'Superuser');
    
    await user.click(screen.getByRole('button', { name: /Add/i }));
    expect(mockCreateMutate).toHaveBeenCalled();
  });
});
