import { render, screen, waitFor } from '@testing-library/react';
import VerifyEmail from './VerifyEmail';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { authApi } from '@/lib/endpoints';
import { BrowserRouter } from 'react-router-dom';

// Mock authApi
vi.mock('@/lib/endpoints', () => ({
  authApi: {
    verifyEmail: vi.fn(),
  },
}));

// Mock useSearchParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams({ token: 'test-token' })]),
  };
});

describe('VerifyEmail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows success message when verification succeeds', async () => {
    authApi.verifyEmail.mockResolvedValueOnce({});
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Verifying email/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Your email is verified/i)).toBeInTheDocument());
  });

  it('shows error message when verification fails', async () => {
    authApi.verifyEmail.mockRejectedValueOnce({ 
        response: { data: { message: 'Invalid token' } } 
    });
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    await waitFor(() => expect(screen.getByText(/Invalid token/i)).toBeInTheDocument());
  });
});
