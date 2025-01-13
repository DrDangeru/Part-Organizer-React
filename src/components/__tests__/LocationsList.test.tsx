import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import LocationsList from '../LocationsList';
import { renderWithProviders } from '../../test/test-utils';

const mockGetLocations = vi.fn();

// Mock the API
vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    getLocations: mockGetLocations,
  }),
}));

// Add auth mock
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
    getToken: () => 'test-token',
    isLoading: false,
  }),
}));

describe('LocationsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders locations list', async () => {
    mockGetLocations.mockResolvedValue([
      {
        id: 1,
        locationName: 'Test Location',
        container: 'Test Container',
        row: 'A1',
        position: 'Front',
      },
    ]);

    renderWithProviders(<LocationsList />);

    // Assert heading is present
    expect(screen.getByText('Locations')).toBeInTheDocument();

    // Wait for and verify location data
    const locationName = await screen.findByText('Test Location');
    expect(locationName).toBeInTheDocument();

    // Verify table cells
    expect(screen.getByText('Test Container')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('Front')).toBeInTheDocument();

    // Verify Add New Location button is present
    expect(screen.getByText('Add New Location')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockGetLocations.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<LocationsList />);

    // Wait for and verify error message
    const errorMessage = await screen.findByText('Failed to load locations');
    expect(errorMessage).toBeInTheDocument();
  });
});
