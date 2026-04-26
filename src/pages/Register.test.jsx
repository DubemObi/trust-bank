import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock hooks
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

describe('Register Page', () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ register: mockRegister });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders register form correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(await screen.findAllByText(/Required/i)).toHaveLength(2); // First name, Last name
    expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
    // Two password fields show the same error
    expect(await screen.findAllByText(/At least 8 characters/i)).toHaveLength(2);
  });

  it('calls register and navigates on success', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValueOnce({});
    
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/First name/i), 'John');
    await user.type(screen.getByLabelText(/Last name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.type(screen.getByTestId('confirm-password-input'), 'password123');
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(mockRegister).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Account created"));
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it('shows error toast on failure', async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValueOnce({ 
        response: { data: { message: 'Registration failed' } } 
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/First name/i), 'John');
    await user.type(screen.getByLabelText(/Last name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.type(screen.getByTestId('confirm-password-input'), 'password123');
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Registration failed"));
  });
});
