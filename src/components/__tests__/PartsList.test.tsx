import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import PartsList from '../PartsList';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import type { Part } from '../../api/partsApi';

// Mock API functions
const mockGetParts = vi.fn();

vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    getParts: mockGetParts,
  }),
}));

// Mock the alert hook
let alertMessage = '';
const mockSetAlertMessage = vi.fn((message: string) => {
  alertMessage = message;
});

vi.mock('../../hooks/useAlert', () => ({
  default: () => ({
    alertMessage,
    setAlertMessage: mockSetAlertMessage,
  }),
}));

// Test wrapper component
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{
        user: { id: 1, username: 'testuser' },
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        getToken: () => 'test-token',
      }}>
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('PartsList', () => {
  const mockParts: Part[] = [
    {
      id: 1,
      partName: 'Test Part 1',
      partDetails: 'Details 1',
      locationName: 'Location 1',
      container: 'Container 1',
      row: 'A1',
      position: 'Front',
    },
    {
      id: 2,
      partName: 'Test Part 2',
      partDetails: 'Details 2',
      locationName: 'Location 2',
      container: 'Container 2',
      row: 'B2',
      position: 'Back',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    alertMessage = '';
    mockGetParts.mockResolvedValue(mockParts);
  });

  it('renders list of parts', async () => {
    renderWithProviders(<PartsList />);

    // Wait for parts to load
    await waitFor(() => {
      expect(screen.getByText('Test Part 1')).toBeInTheDocument();
      expect(screen.getByText('Test Part 2')).toBeInTheDocument();
    });

    // Verify part details are displayed
    expect(screen.getByText('Details 1')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Container 1')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('Front')).toBeInTheDocument();
  });

  it('filters parts based on search input', async () => {
    renderWithProviders(<PartsList />);

    // Wait for initial parts to load
    await waitFor(() => {
      expect(screen.getByText('Test Part 1')).toBeInTheDocument();
      expect(screen.getByText('Test Part 2')).toBeInTheDocument();
    });

    // Find and fill search input
    const searchInput = screen.getByPlaceholderText(/search parts/i);
    fireEvent.change(searchInput, { target: { value: 'Test Part 1' } });

    // Verify only matching part is shown (client-side filtering)
    expect(screen.getByText('Test Part 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Part 2')).not.toBeInTheDocument();

    // Test search by other fields
    fireEvent.change(searchInput, { target: { value: 'Details 2' } });
    expect(screen.queryByText('Test Part 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Part 2')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Location 1' } });
    expect(screen.getByText('Test Part 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Part 2')).not.toBeInTheDocument();
  });
});
