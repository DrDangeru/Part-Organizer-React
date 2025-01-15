import { vi } from 'vitest';

let alertMessage = '';
const mockSetAlertMessage = vi.fn((message: string) => {
  alertMessage = message;
});

export const mockUseAlert = () => ({
  alertMessage,
  setAlertMessage: mockSetAlertMessage,
});
