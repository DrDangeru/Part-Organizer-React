import { describe, it, expect, vi, beforeEach,} from 'vitest';
import { screen, fireEvent , waitFor } from '@testing-library/react';
import LocationForm from '../LocationForm';
import { renderWithProviders } from '../../test/test-utils';

// Mock the alert hook
vi.mock('../../../src/hooks/useAlert', () => ({
  default: () => ({
    alertMessage: '',
    setAlertMessage: vi.fn(),
  }),
}));

// Mock the API
const mockAddLocation = vi.fn();
const mockGetLocations = vi.fn();

vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    addLocation: mockAddLocation,
    getLocations: mockGetLocations,
  }),
}));

describe('LocationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    const alert = await screen.findByTestId('alert-message');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toBe('Please fill all required fields');
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

    // Wait for API call
    await waitFor(() => {
      expect(mockAddLocation).toHaveBeenCalledWith({
        locationName: 'Test Location',
        container: 'Test Container',
        row: 'A1',
        position: 'Front',
      });
    });

    // Wait for alert to appear
    const alert = await screen.findByTestId('alert-message');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toBe('Location added successfully!');
  });

  it('handles API error gracefully', async () => {
    mockAddLocation.mockRejectedValueOnce(new Error('API Error'));

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

    // Wait for alert to appear
    const alert = await screen.findByTestId('alert-message');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toBe('API Error');

    expect(mockAddLocation).toHaveBeenCalledWith({
      locationName: 'Test Location',
      container: 'Test Container',
      row: 'A1',
      position: 'Front',
    });
  });
});
