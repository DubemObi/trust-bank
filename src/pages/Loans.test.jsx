import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loans from './Loans';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Loans Page', () => {
  const mockLoans = [
    { id: '1', principalAmount: 50000, interestRate: 5, durationInMonths: 24, status: 0, createdAt: new Date().toISOString() },
  ];
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useQuery.mockReturnValue({ data: mockLoans, isLoading: false });
  });

  it('renders loans correctly', () => {
    render(
      <BrowserRouter>
        <Loans />
      </BrowserRouter>
    );
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
    expect(screen.getByText('24 mo')).toBeInTheDocument();
  });

  it('navigates to apply form when button clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Loans />
      </BrowserRouter>
    );
    
    const applyBtns = screen.getAllByText(/Apply/i);
    // There are multiple "Apply" related buttons, let's pick the specific one
    await user.click(applyBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/loans/apply');
  });

  it('shows empty state when no loans exist', () => {
    useQuery.mockReturnValue({ data: [], isLoading: false });
    render(
      <BrowserRouter>
        <Loans />
      </BrowserRouter>
    );
    expect(screen.getByText(/No active loans/i)).toBeInTheDocument();
  });
});
