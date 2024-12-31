import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PartsList from '../PartsList';
import { partsApi } from '../../api/partsApi';

// Mock the API
vi.mock('../../api/partsApi', () => ({
  partsApi: {
    getParts: vi.fn(),
  },
}));

describe('PartsList', () => {
  it('renders parts list', async () => {
    // Mock data
    const mockParts = [
      {
        id: 1,
        partName: 'Test Part',
        partDetails: 'Test Details',
        locationName: 'Test Location',
        container: 'Test Container',
        row: 'A1',
        position: 'Front',
      },
    ];

    // Setup the mock implementation
    vi.mocked(partsApi.getParts).mockResolvedValue(mockParts);

    render(
      <BrowserRouter>
        <PartsList />
      </BrowserRouter>
    );

    // Assert heading is present
    expect(screen.getByText('Parts Inventory')).toBeInTheDocument();

    // Wait for and verify part data
    await waitFor(async () => {
      const partName = await screen.findByText('Test Part', {}, { timeout: 5000 });
      expect(partName).toBeInTheDocument();
      expect(screen.getByText('Details: Test Details')).toBeInTheDocument();
      expect(screen.getByText('Location: Test Location')).toBeInTheDocument();
      expect(screen.getByText('Container: Test Container')).toBeInTheDocument();
      expect(screen.getByText('Row: A1')).toBeInTheDocument();
      expect(screen.getByText('Position: Front')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify Add New Part button is present
    expect(screen.getByText('Add New Part')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    // Setup the mock to reject
    vi.mocked(partsApi.getParts).mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <PartsList />
      </BrowserRouter>
    );

    // Wait for and verify error message
    await waitFor(async () => {
      const errorMessage = await screen.findByText('Failed to load parts', {}, { timeout: 5000 });
      expect(errorMessage).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders empty state when no parts exist', async () => {
    // Setup the mock to return empty array
    vi.mocked(partsApi.getParts).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <PartsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Verify the heading is still present
      expect(screen.getByText('Parts Inventory')).toBeInTheDocument();
      
      // Verify Add New Part button is present
      expect(screen.getByText('Add New Part')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
