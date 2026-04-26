import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cards from './Cards';
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

describe('Cards Page', () => {
  const mockCards = [
    { id: '1', cardNumber: '1234567812345678', cardType: 'Credit', cardHolderName: 'John Doe', expiryDate: '12/25' },
  ];
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: '1' } });
    useNavigate.mockReturnValue(mockNavigate);
    useQuery.mockReturnValue({ data: mockCards, isLoading: false });
  });

  it('renders cards correctly', () => {
    render(
      <BrowserRouter>
        <Cards />
      </BrowserRouter>
    );
    // Find Credit specifically in the card type span
    expect(screen.getByText('Credit', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/12\/25/)).toBeInTheDocument();
  });

  it('navigates to request form when button clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Cards />
      </BrowserRouter>
    );
    
    // There are two "Request card" buttons (Header and EmptyState if empty)
    // We pick by text
    const reqBtns = screen.getAllByText(/Request card/i);
    await user.click(reqBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/cards/request');
  });

  it('shows empty state when no cards exist', () => {
    useQuery.mockReturnValue({ data: [], isLoading: false });
    render(
      <BrowserRouter>
        <Cards />
      </BrowserRouter>
    );
    expect(screen.getByText(/No cards yet/i)).toBeInTheDocument();
  });
});
