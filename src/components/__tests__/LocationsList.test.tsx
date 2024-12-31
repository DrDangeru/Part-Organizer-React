import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LocationsList from '../LocationsList';
import { partsApi } from '../../api/partsApi';

// Mock the API
vi.mock('../../api/partsApi', () => ({
  partsApi: {
    getLocations: vi.fn(),
  },
}));

describe('LocationsList', () => {
  it('renders locations list', async () => {
    // Mock data
    const mockLocations = [
      {
        id: 1,
        locationName: 'Test Location',
        container: 'Test Container',
        row: 'A1',
        position: 'Front',
      },
    ];

    // Setup the mock implementation
    vi.mocked(partsApi.getLocations).mockResolvedValue(mockLocations);

    render(
      <BrowserRouter>
        <LocationsList />
      </BrowserRouter>
    );

    // Assert heading is present
    expect(screen.getByText('Locations')).toBeInTheDocument();

    // Wait for and verify location data
    await waitFor(async () => {
      const locationName = await screen.findByText('Test Location', {}, { timeout: 5000 });
      expect(locationName).toBeInTheDocument();
      expect(screen.getByText('Container: Test Container')).toBeInTheDocument();
      expect(screen.getByText('Row: A1')).toBeInTheDocument();
      expect(screen.getByText('Position: Front')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify Add New Location button is present
    expect(screen.getByText('Add New Location')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    // Setup the mock to reject
    vi.mocked(partsApi.getLocations).mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <LocationsList />
      </BrowserRouter>
    );

    // Wait for and verify error message
    await waitFor(async () => {
      const errorMessage = await screen.findByText('Failed to load locations', {}, { timeout: 5000 });
      expect(errorMessage).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
