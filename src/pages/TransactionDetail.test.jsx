import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionDetail from './TransactionDetail';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

describe('TransactionDetail Page', () => {
  const mockTx = {
    id: 'TX123',
    type: 'Transfer',
    amount: -100,
    description: 'Rent',
    createdAt: new Date().toISOString(),
    status: 'Completed',
    fromAccountId: 'ACC1',
    toAccountId: 'ACC2',
  };
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: 'TX123' });
    useQuery.mockReturnValue({ data: mockTx, isLoading: false });
  });

  it('renders transaction details correctly', () => {
    render(
      <BrowserRouter>
        <TransactionDetail />
      </BrowserRouter>
    );
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText(/-£100\.00/i)).toBeInTheDocument();
    expect(screen.getByText('TX123')).toBeInTheDocument();
  });

  it('calls navigate(-1) when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TransactionDetail />
      </BrowserRouter>
    );
    
    await user.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('shows not found message when transaction is missing', () => {
    useQuery.mockReturnValue({ data: null, isLoading: false });
    render(
      <BrowserRouter>
        <TransactionDetail />
      </BrowserRouter>
    );
    expect(screen.getByText(/Transaction not found/i)).toBeInTheDocument();
  });
});
