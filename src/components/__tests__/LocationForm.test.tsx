import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
//import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LocationForm from '../LocationForm';
import { partsApi, Location } from '../../api/partsApi';

// Mock the API
vi.mock('../../api/partsApi', () => ({
  partsApi: {
    addLocation: vi.fn(),
    getLocations: vi.fn(),
  },
}));

describe('LocationForm', () => {
  const mockLocation: Location = {
    id: 1,
    locationName: 'Test Location',
    container: 'Test Container',
    row: 'A1',
    position: 'Front'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Setup default mock implementations
    vi.mocked(partsApi.getLocations).mockResolvedValue([mockLocation]);
  });

  it('renders form fields', async () => {
    render(
      <BrowserRouter>
        <LocationForm />
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Check if all form fields are present
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

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Get form and submit
    const form = screen.getByRole('form');
    
    // Submit the form
    await act(async () => {
      fireEvent.submit(form);
    });

    // Wait for and check the validation message
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Please fill all required fields');
      expect(alert).toHaveClass('bg-yellow-100');
    }, { timeout: 2000 });
  });

  it('successfully submits form with valid data', async () => {
    // Setup success mock
    const newLocation: Location = {
      id: 2,
      locationName: 'New Test Location',
      container: 'New Container',
      row: 'B2',
      position: 'Back'
    };
    vi.mocked(partsApi.addLocation).mockResolvedValue(newLocation);
    vi.mocked(partsApi.getLocations).mockResolvedValue([mockLocation, newLocation]);

    render(
      <BrowserRouter>
        <LocationForm />
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Fill in form fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/location name/i), { target: { value: newLocation.locationName } });
      fireEvent.change(screen.getByLabelText(/container/i), { target: { value: newLocation.container } });
      fireEvent.change(screen.getByLabelText(/row/i), { target: { value: newLocation.row } });
      fireEvent.change(screen.getByLabelText(/position/i), { target: { value: newLocation.position } });
    });

    // Submit form using the submit button
    const submitButton = screen.getByRole('button', { name: /add location/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for API call
    await waitFor(() => {
      expect(partsApi.addLocation).toHaveBeenCalledWith({
        locationName: newLocation.locationName,
        container: newLocation.container,
        row: newLocation.row,
        position: newLocation.position,
      });
    }, { timeout: 5000 });

    // Check success message
    const alert = await screen.findByText('Location added successfully!', {}, { timeout: 5000 });
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass('bg-yellow-100');

    // Verify the new location appears in the list
    await waitFor(() => {
      expect(screen.getByText(newLocation.locationName)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Mock API to throw error
    const errorMessage = 'Failed to add location. Please try again.';
    vi.mocked(partsApi.addLocation).mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <LocationForm/>
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Fill in form fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/location name/i), { target: { value: 'New Location' } });
      fireEvent.change(screen.getByLabelText(/container/i), { target: { value: 'New Container' } });
      fireEvent.change(screen.getByLabelText(/row/i), { target: { value: 'B2' } });
      fireEvent.change(screen.getByLabelText(/position/i), { target: { value: 'Back' } });
    });

    // Submit form using the submit button
    const submitButton = screen.getByRole('button', { name: /add location/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check error message
    const alert = await screen.findByText(errorMessage, {}, { timeout: 5000 });
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass('bg-yellow-100');
  });
});
