import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import PartsList from '../PartsList';
import { renderWithProviders } from '../../test/test-utils';
import type { Part } from '../../api/partsApi';

// Mock API functions
const mockGetParts = vi.fn();
const mockSearchParts = vi.fn();

// Mock the API
vi.mock('../../api/partsApi', () => ({
  usePartsApi: () => ({
    getParts: mockGetParts,
    searchParts: mockSearchParts,
  }),
}));

// Mock the alert hook
vi.mock('../../hooks/useAlert', () => ({
  default: () => ({
    alertMessage: '',
    setAlertMessage: vi.fn(),
  }),
}));

describe('PartsList', () => {
  const mockParts: Part[] = [
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetParts.mockResolvedValue(mockParts);
  });

  it('renders parts list', async () => {
    renderWithProviders(<PartsList />);

    // Wait for and verify part data
    const partName = await screen.findByText('Test Part');
    expect(partName).toBeInTheDocument();

    // Verify other part details are present in the table
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Test Part');
    expect(cells[1]).toHaveTextContent('Test Details');
    expect(cells[2]).toHaveTextContent('Test Location');
    expect(cells[3]).toHaveTextContent('Test Container');
    expect(cells[4]).toHaveTextContent('A1');
    expect(cells[5]).toHaveTextContent('Front');

    // Verify Add New Part button is present
    expect(screen.getByText('Add New Part')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockGetParts.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<PartsList />);

    // Wait for and verify error message
    const errorMessage = await screen.findByTestId('alert-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load parts');
  });

  it('renders empty state when no parts exist', async () => {
    mockGetParts.mockResolvedValue([]);

    renderWithProviders(<PartsList />);

    // Wait for table to be empty
    const table = await screen.findByRole('table');
    const tbody = table.querySelector('tbody');
    expect(tbody?.children.length).toBe(0);

    // Verify empty state message
    const emptyMessage = await screen.findByTestId('empty-message');
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage).toHaveTextContent('No parts found');
  });
});
