import { render, screen } from '@testing-library/react';
import LoanRequests from './LoanRequests';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('LoanRequests Page', () => {
  const mockRequests = [
    { id: '1', principalAmount: 5000, durationInMonths: 12, purpose: 'Car', status: 0, createdAt: new Date().toISOString() },
    { id: '2', principalAmount: 10000, durationInMonths: 24, purpose: 'Home', status: 1, createdAt: new Date().toISOString() },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockReturnValue({ data: mockRequests, isLoading: false });
  });

  it('renders loan requests correctly', () => {
    render(
      <BrowserRouter>
        <LoanRequests />
      </BrowserRouter>
    );
    // £5,000.00
    expect(screen.getByText(/£5,000\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Car/i)).toBeInTheDocument();
    expect(screen.getByText(/£10,000\.00/i)).toBeInTheDocument();
  });

  it('shows empty state when no requests exist', () => {
    useQuery.mockReturnValue({ data: [], isLoading: false });
    render(
      <BrowserRouter>
        <LoanRequests />
      </BrowserRouter>
    );
    expect(screen.getByText(/No applications yet/i)).toBeInTheDocument();
  });
});
