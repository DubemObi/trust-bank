import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLoanRequests from './AdminLoanRequests';
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

describe('AdminLoanRequests Page', () => {
  const mockRequests = [
    { id: '1', principalAmount: 5000, durationInMonths: 12, status: 0, createdAt: new Date().toISOString() },
    { id: '2', principalAmount: 10000, durationInMonths: 24, status: 1, createdAt: new Date().toISOString() },
  ];
  const mockApproveMutate = vi.fn();
  const mockRejectMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockReturnValue({ data: mockRequests, isLoading: false });
    useMutation.mockImplementation(() => ({
        mutate: vi.fn(),
        isPending: false,
    }));
    useMutation.mockReturnValueOnce({ mutate: mockApproveMutate, isPending: false })
               .mockReturnValueOnce({ mutate: mockRejectMutate, isPending: false });
  });

  it('renders requests correctly', () => {
    render(
      <BrowserRouter>
        <AdminLoanRequests />
      </BrowserRouter>
    );
    expect(screen.getByText(/5,000/i)).toBeInTheDocument();
    expect(screen.getByText(/10,000/i)).toBeInTheDocument();
  });

  it('calls approve mutation when approve is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminLoanRequests />
      </BrowserRouter>
    );
    
    // Only pending requests (status 0) have buttons.
    await user.click(screen.getByRole('button', { name: /Approve/i }));
    expect(mockApproveMutate).toHaveBeenCalledWith('1');
  });
});
