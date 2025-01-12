import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LocationForm from '../LocationForm';
import { usePartsApi } from '../../api/partsApi'; // Location

// Mock the alert hook
vi.mock('../../../src/hooks/useAlert', () => ({
  default: () => ({
    alertMessage: '',
    setAlertMessage: vi.fn(),
  }),
}));

// Mock the API
vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    addLocation: vi.fn(),
    getLocations: vi.fn().mockResolvedValue([{
      id: 1,
      locationName: 'Test Location',
      container: 'Test Container',
      row: 'A1',
      position: 'Front',
    }]),
  }),
}));

// Mock auth
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
    getToken: () => 'test-token',
    isLoading: false,
  }),
}));

describe('LocationForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders form fields', async () => {
    render(
      <BrowserRouter>
        <LocationForm />
      </BrowserRouter>
    );

    // Check if form fields are present
    expect(screen.getByLabelText(/location name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/container/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/row/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    render(
      <BrowserRouter>
        <LocationForm />
      </BrowserRouter>
    );

    // Submit empty form
    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Check validation message
    await waitFor(() => {
      const alert = screen.getByTestId('alert-message');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toBe('Please fill all required fields');
    }, { timeout: 2000 });
  });

  it('successfully submits form with valid data', async () => {
    const api = usePartsApi();
    const mockAddLocation = vi.fn().mockResolvedValue({});
    const mockGetLocations = vi.fn().mockResolvedValue([]);
    
    vi.mocked(api.addLocation).mockImplementation(mockAddLocation);
    vi.mocked(api.getLocations).mockImplementation(mockGetLocations);

    render(
      <BrowserRouter>
        <LocationForm />
      </BrowserRouter>
    );

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
    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Wait for the API calls to complete
    await waitFor(() => {
      expect(mockAddLocation).toHaveBeenCalledWith({
        locationName: 'Test Location',
        container: 'Test Container',
        row: 'A1',
        position: 'Front',
      });
      expect(mockGetLocations).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Check success message
    await waitFor(() => {
      const alert = screen.getByTestId('alert-message');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toBe('Location added successfully!');
    }, { timeout: 1000 });
  });

  it('handles API error gracefully', async () => {
    const api = usePartsApi();
    const mockAddLocation = vi.fn().mockRejectedValue(new Error('API Error'));
    vi.mocked(api.addLocation).mockImplementation(mockAddLocation);

    render(
      <BrowserRouter>
        <LocationForm />
      </BrowserRouter>
    );

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
    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Wait for error message
    await waitFor(() => {
      const alert = screen.getByTestId('alert-message');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toBe('API Error');
    }, { timeout: 1000 });

    expect(mockAddLocation).toHaveBeenCalledWith({
      locationName: 'Test Location',
      container: 'Test Container',
      row: 'A1',
      position: 'Front',
    });
  });
});
