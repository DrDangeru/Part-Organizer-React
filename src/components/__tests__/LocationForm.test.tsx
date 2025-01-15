import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import LocationForm from '../LocationForm';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the API
const mockAddLocation = vi.fn();
const mockGetLocations = vi.fn();

vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    addLocation: mockAddLocation,
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

describe('LocationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    alertMessage = '';
    mockGetLocations.mockResolvedValue([]);
  });

  it('renders form fields', () => {
    renderWithProviders(<LocationForm />);

    expect(screen.getByLabelText(/location name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/container/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/row/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderWithProviders(<LocationForm />);

    // Submit empty form
    fireEvent.submit(screen.getByRole('form'));

    // Wait for alert to appear
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith('Please fill all required fields');
    });
  });

  it('successfully submits form with valid data', async () => {
    mockAddLocation.mockResolvedValueOnce({});
    renderWithProviders(<LocationForm />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/location name/i), {
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

    // Submit form
    fireEvent.submit(screen.getByRole('form'));

    // Check if API was called with correct data
    await waitFor(() => {
      expect(mockAddLocation).toHaveBeenCalledWith({
        locationName: 'Test Location',
        container: 'Test Container',
        row: 'A1',
        position: 'Front',
      });
    });

    // Check for success message
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith('Location added successfully!');
    });
  });

  it('handles API error gracefully', async () => {
    const errorMessage = 'API Error';
    mockAddLocation.mockRejectedValueOnce(new Error(errorMessage));
    renderWithProviders(<LocationForm />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/location name/i), {
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

    // Submit form
    fireEvent.submit(screen.getByRole('form'));

    // Check for error message
    await waitFor(() => {
      expect(mockSetAlertMessage).toHaveBeenCalledWith(errorMessage);
    });
  });
});
