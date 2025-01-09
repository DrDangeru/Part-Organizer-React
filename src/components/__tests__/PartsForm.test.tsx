import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
//import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PartsForm from '../PartsForm';
import { partsApi, Part, Location } from '../../api/partsApi';

// Mock the API
vi.mock('../../api/partsApi', () => ({
  partsApi: {
    addPart: vi.fn(),
    getParts: vi.fn(),
    getLocations: vi.fn(),
  },
}));

describe('PartsForm', () => {
  const mockLocation: Location = {
    id: 1,
    locationName: 'Test Location',
    container: 'Test Container',
    row: 'A1',
    position: 'Front',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Setup default mock implementations
    vi.mocked(partsApi.getLocations).mockResolvedValue([mockLocation]);
    vi.mocked(partsApi.getParts).mockResolvedValue([]);
  });

  it('renders form fields', async () => {
    render(
      <BrowserRouter>
        <PartsForm />
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Check if all form fields are present
    expect(screen.getByLabelText(/part name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/part details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/container/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/row/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    render(
      <BrowserRouter>
        <PartsForm />
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Get the form and submit button
    const form = screen.getByRole('form');

    // Submit the form without filling any fields
    await act(async () => {
      fireEvent.submit(form);
    });

    // Check for validation message
    const alert = await screen.findByText(
      'Please fill in all required fields (including location)',
      {},
      { timeout: 5000 }
    );
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass('bg-yellow-100');
  });

  it('successfully submits form with valid data', async () => {
    // Setup success mock with proper Part interface
    const mockPart: Part = {
      id: 1,
      partName: 'Test Part',
      partDetails: 'Test Details',
      locationName: mockLocation.locationName,
      container: mockLocation.container,
      row: mockLocation.row,
      position: mockLocation.position,
    };
    vi.mocked(partsApi.addPart).mockResolvedValue(mockPart);
    vi.mocked(partsApi.getParts).mockResolvedValue([mockPart]);

    render(
      <BrowserRouter>
        <PartsForm />
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Fill in form fields
    await act(async () => {
      // Fill in part name and details
      fireEvent.change(screen.getByLabelText(/part name/i), {
        target: { value: mockPart.partName },
      });
      fireEvent.change(screen.getByLabelText(/part details/i), {
        target: { value: mockPart.partDetails },
      });

      // Select location from dropdown
      const locationSelect = screen.getByLabelText(/location/i);
      fireEvent.change(locationSelect, {
        target: { value: mockPart.locationName },
      });

      // Fill in container, row, and position
      fireEvent.change(screen.getByLabelText(/container/i), {
        target: { value: mockPart.container },
      });
      fireEvent.change(screen.getByLabelText(/row/i), {
        target: { value: mockPart.row },
      });
      fireEvent.change(screen.getByLabelText(/position/i), {
        target: { value: mockPart.position },
      });
    });

    // Submit form
    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Wait for API call
    await waitFor(
      () => {
        expect(partsApi.addPart).toHaveBeenCalledWith({
          partName: mockPart.partName,
          partDetails: mockPart.partDetails,
          locationName: mockPart.locationName,
          container: mockPart.container,
          row: mockPart.row,
          position: mockPart.position,
        });
      },
      { timeout: 5000 }
    );

    // Check success message
    const alert = await screen.findByText(
      'Part added successfully!',
      {},
      { timeout: 5000 }
    );
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass('bg-yellow-100');
  });

  it('handles API error gracefully', async () => {
    // Mock API to throw error
    const errorMessage = 'Failed to add part. Please try again.';
    vi.mocked(partsApi.addPart).mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <PartsForm />
      </BrowserRouter>
    );

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    // Fill in form fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/part name/i), {
        target: { value: 'Test Part' },
      });

      // Select location from dropdown
      const locationSelect = screen.getByLabelText(/location/i);
      fireEvent.change(locationSelect, {
        target: { value: mockLocation.locationName },
      });

      fireEvent.change(screen.getByLabelText(/container/i), {
        target: { value: mockLocation.container },
      });
      fireEvent.change(screen.getByLabelText(/row/i), {
        target: { value: mockLocation.row },
      });
      fireEvent.change(screen.getByLabelText(/position/i), {
        target: { value: mockLocation.position },
      });
    });

    // Submit form
    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Check error message
    const alert = await screen.findByText(errorMessage, {}, { timeout: 5000 });
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass('bg-yellow-100');
  });
});
