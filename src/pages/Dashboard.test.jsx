import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('Dashboard Page', () => {
  const mockUser = { firstName: 'John' };
  const mockAccounts = [{ id: 1, accountName: 'Primary', accountBalance: 1000, accountNumber: '123', accountType: 1 }];
  const mockTransactions = [{ id: 1, type: 'Deposit', amount: 500, description: 'Bonus', createdAt: new Date().toISOString() }];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    
    // Default implementation for useQuery
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'accounts') return { data: mockAccounts, isLoading: false };
      if (queryKey[0] === 'transactions') return { data: mockTransactions, isLoading: false };
      return { data: null, isLoading: false };
    });
  });

  it('renders welcome message with user name', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/Hi, John/i)).toBeInTheDocument();
  });

  it('renders total balance correctly', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    // £1,000.00 appears in both the primary account card and the total balance summary
    const balances = screen.getAllByText(/£1,000\.00/i);
    expect(balances.length).toBeGreaterThanOrEqual(1);
    expect(balances[0]).toBeInTheDocument();
  });

  it('renders recent transactions', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Bonus')).toBeInTheDocument();
  });
});
