import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from './Profile';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
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

describe('Profile Page', () => {
  const mockUser = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phoneNumber: '123' };
  const mockLogout = vi.fn();
  const mockRefreshUser = vi.fn();
  const mockNavigate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout, refreshUser: mockRefreshUser });
    useNavigate.mockReturnValue(mockNavigate);
    useMutation.mockImplementation(({ mutationFn }) => ({
        mutate: mutationFn.name === 'mutationFn' ? mockUpdateMutate : vi.fn(),
        isPending: false,
    }));
    // Simplified mutation mock for testing trigger
    useMutation.mockReturnValue({
        mutate: mockUpdateMutate,
        isPending: false,
    });
  });

  it('renders profile information correctly', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls update mutation on form submit', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    const firstNameInput = screen.getByDisplayValue('John');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    
    await user.click(screen.getByRole('button', { name: /Save changes/i }));
    expect(mockUpdateMutate).toHaveBeenCalled();
  });

  it('calls logout when sign out button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await user.click(screen.getByRole('button', { name: /Sign out/i }));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
