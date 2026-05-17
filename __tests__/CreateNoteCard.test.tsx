import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateNoteCard } from '@/components/CreateNoteCard';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      refresh: vi.fn(),
    };
  },
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ note: { id: '123' } }),
  })
) as unknown as typeof fetch;

describe('CreateNoteCard', () => {
  it('renders the create button', () => {
    render(<CreateNoteCard />);
    expect(screen.getByText('Create New Note')).toBeInTheDocument();
  });

  it('shows loading state and calls API when clicked', async () => {
    render(<CreateNoteCard />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('/api/notes', expect.any(Object));
  });
});
