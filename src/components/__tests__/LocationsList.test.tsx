import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import LocationsList from '../LocationsList';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const mockGetLocations = vi.fn();

vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    getLocations: mockGetLocations,
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

describe('LocationsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    alertMessage = '';
  });

  const renderWithContext = (ui: React.ReactElement) => {
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

    renderWithContext(<LocationsList />);

    // Assert heading is present
    expect(screen.getByText('Locations')).toBeInTheDocument();

    // Wait for and verify location data
    const locationName = await screen.findByText('Test Location');
    expect(locationName).toBeInTheDocument();

    // Verify other location details are present in the table
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Test Location');
    expect(cells[1]).toHaveTextContent('Test Container');
    expect(cells[2]).toHaveTextContent('A1');
    expect(cells[3]).toHaveTextContent('Front');

    // Verify Add New Location button is present
    expect(screen.getByText('Add New Location')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockGetLocations.mockRejectedValue(new Error('API Error'));

    renderWithContext(<LocationsList />);

    // Wait for error message in alert
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith('Failed to fetch locations');
    });
  });
});
