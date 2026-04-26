import { render, screen } from '@testing-library/react';
import CardRequests from './CardRequests';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('CardRequests Page', () => {
  const mockRequests = [
    { id: '1', cardType: 'Debit', status: 0, createdAt: new Date().toISOString() },
    { id: '2', cardType: 'Credit', status: 1, createdAt: new Date().toISOString() },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useQuery.mockReturnValue({ data: mockRequests, isLoading: false });
  });

  it('renders card requests correctly', () => {
    render(
      <BrowserRouter>
        <CardRequests />
      </BrowserRouter>
    );
    expect(screen.getByText('Debit request')).toBeInTheDocument();
    expect(screen.getByText('Credit request')).toBeInTheDocument();
  });

  it('shows empty state when no requests exist', () => {
    useQuery.mockReturnValue({ data: [], isLoading: false });
    render(
      <BrowserRouter>
        <CardRequests />
      </BrowserRouter>
    );
    expect(screen.getByText(/No card requests/i)).toBeInTheDocument();
  });
});
