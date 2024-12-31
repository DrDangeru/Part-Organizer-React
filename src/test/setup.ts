import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Mock React's act
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    act: async (callback: () => Promise<void>) => {
      await callback();
    },
  };
});

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});
