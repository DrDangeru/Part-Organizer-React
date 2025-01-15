import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import PartsForm from '../PartsForm';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import type { Part, Location } from '../../api/partsApi';

// Mock API functions
const mockAddPart = vi.fn();
const mockGetParts = vi.fn();
const mockGetLocations = vi.fn();

// Mock the API
vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    addPart: mockAddPart,
    getParts: mockGetParts,
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

describe('PartsForm', () => {
  const mockLocation: Location = {
    id: 1,
    locationName: 'Test Location',
    container: 'Test Container',
    row: 'A1',
    position: 'Front',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    alertMessage = '';
    mockGetLocations.mockResolvedValue([mockLocation]);
    mockGetParts.mockResolvedValue([]);
  });

  it('renders form fields', async () => {
    renderWithProviders(<PartsForm />);

    // Wait for locations to load in the select dropdown
    const locationSelect = await screen.findByLabelText(/location/i);
    expect(locationSelect).toBeInTheDocument();

    // Check if all form fields are present
    expect(screen.getByLabelText(/part name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/part details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/container/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/row/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();

    // Verify location option is present
    expect(screen.getByRole('option', { name: 'Test Location' })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderWithProviders(<PartsForm />);

    // Wait for locations to load
    await screen.findByRole('option', { name: 'Test Location' });

    // Submit the form without filling any fields
    fireEvent.submit(screen.getByRole('form'));

    // Check for validation message
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith('Please fill in all required fields (including location)');
    });
  });

  it('successfully submits form with valid data', async () => {
    const mockPart: Part = {
      id: 1,
      partName: 'Test Part',
      partDetails: 'Test Details',
      locationName: mockLocation.locationName,
      container: mockLocation.container,
      row: mockLocation.row,
      position: mockLocation.position,
    };

    mockAddPart.mockResolvedValueOnce(mockPart);
    renderWithProviders(<PartsForm />);

    // Wait for locations to load
    await screen.findByRole('option', { name: 'Test Location' });

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/part name/i), {
      target: { value: mockPart.partName },
    });
    fireEvent.change(screen.getByLabelText(/part details/i), {
      target: { value: mockPart.partDetails },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: mockPart.locationName },
    });
    fireEvent.change(screen.getByLabelText(/container/i), {
      target: { value: mockPart.container },
    });
    fireEvent.change(screen.getByLabelText(/row/i), {
      target: { value: mockPart.row },
    });
    fireEvent.change(screen.getByLabelText(/position/i), {
      target: { value: mockPart.position },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    // Check if API was called with correct data
    await waitFor(() => {
      expect(mockAddPart).toHaveBeenCalledWith({
        partName: mockPart.partName,
        partDetails: mockPart.partDetails,
        locationName: mockPart.locationName,
        container: mockPart.container,
        row: mockPart.row,
        position: mockPart.position,
      });
    });

    // Check for success message
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith('Part added successfully!');
    });
  });

  it('handles API error gracefully', async () => {
    const errorMessage = 'Failed to add part. Please try again.';
    mockAddPart.mockRejectedValueOnce(new Error(errorMessage));

    renderWithProviders(<PartsForm />);

    // Wait for locations to load
    await screen.findByRole('option', { name: 'Test Location' });

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/part name/i), {
      target: { value: 'Test Part' },
    });
    fireEvent.change(screen.getByLabelText(/part details/i), {
      target: { value: 'Test Details' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText(/container/i), {
      target: { value: 'Test Container' },
    });
    fireEvent.change(screen.getByLabelText(/row/i), {
      target: { value: 'A1' },
    });
    fireEvent.change(screen.getByLabelText(/position/i), {
      target: { value: 'Front' },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    // Check for error message
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith(errorMessage);
    });
  });
});
