import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext, type User, type AuthContextType } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Mock user for testing
export const mockUser: User = {
  id: 1,
  username: 'testuser',
};

// Mock auth context values
export const mockAuthContext: AuthContextType = {
  user: mockUser,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  getToken: () => 'test-token',
};

// Wrapper component with all necessary providers
export function TestWrapper({ children }: { children: ReactElement }) {
  return (
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

// Custom render function that includes providers
export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: TestWrapper });
}
