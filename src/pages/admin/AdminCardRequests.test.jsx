import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminCardRequests from './AdminCardRequests';
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

describe('AdminCardRequests Page', () => {
  const mockRequests = [
    { id: '1', cardType: 0, status: 0, createdAt: new Date().toISOString() },
    { id: '2', cardType: 1, status: 1, createdAt: new Date().toISOString() },
  ];
  const mockApproveMutate = vi.fn();
  const mockRejectMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockReturnValue({ data: mockRequests, isLoading: false });
    // This implementation is a bit tricky since we use multiple useMutation calls
    useMutation.mockImplementation(() => ({
        mutate: vi.fn(),
        isPending: false,
    }));
    // Special setup for finding specific mutations
    // For the test below, we just mock the return once
    useMutation.mockReturnValueOnce({ mutate: mockApproveMutate, isPending: false }) // first call is approve
               .mockReturnValueOnce({ mutate: mockRejectMutate, isPending: false }); // second is reject
  });

  it('renders requests correctly', () => {
    render(
      <BrowserRouter>
        <AdminCardRequests />
      </BrowserRouter>
    );
    expect(screen.getByText('Debit card request')).toBeInTheDocument();
    expect(screen.getByText('Credit card request')).toBeInTheDocument();
  });

  it('calls approve mutation when approve is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminCardRequests />
      </BrowserRouter>
    );
    
    // Only pending requests (status 0) have buttons. Request 1 is pending.
    await user.click(screen.getByRole('button', { name: /Approve/i }));
    expect(mockApproveMutate).toHaveBeenCalledWith('1');
  });
});
