import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from './AdminDashboard';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
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

describe('AdminDashboard Page', () => {
  const mockUser = { firstName: 'Admin' };
  const mockUsers = [{ id: '1' }, { id: '2' }];
  const mockAccounts = [{ id: 'a1' }];
  const mockCardReqs = [{ id: 'cr1', status: 0 }];
  const mockLoanReqs = [{ id: 'lr1', status: 0, purpose: 'Business' }];
  const mockRoles = [{ id: 'r1' }];
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    useNavigate.mockReturnValue(mockNavigate);
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[1] === 'users') return { data: mockUsers, isLoading: false };
      if (queryKey[1] === 'accounts') return { data: mockAccounts, isLoading: false };
      if (queryKey[1] === 'card-requests') return { data: mockCardReqs, isLoading: false };
      if (queryKey[1] === 'loan-requests') return { data: mockLoanReqs, isLoading: false };
      if (queryKey[1] === 'roles') return { data: mockRoles, isLoading: false };
      return { data: null, isLoading: false };
    });
  });

  it('renders stats correctly', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Total users')).toBeInTheDocument();
    // Use getAllByText for values because '1' might appear multiple times
    expect(screen.getByText('2')).toBeInTheDocument(); 
    expect(screen.getByText('Bank accounts')).toBeInTheDocument();
    const oneElements = screen.getAllByText('1');
    expect(oneElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders pending requests correctly', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/Business/i)).toBeInTheDocument();
    // Check specifically for the text in the list, not the stat label
    const cardReqElements = screen.getAllByText(/Card request/i);
    expect(cardReqElements.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates when stats are clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await user.click(screen.getByText('Total users').closest('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
  });
});
