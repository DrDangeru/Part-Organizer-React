/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig as VitestUserConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['better-sqlite3'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    testTimeout: 10000, // Increase timeout to 10 seconds
    hookTimeout: 10000,
    pool: 'threads',
    maxThreads: 1, // Reduce parallel execution to avoid timeouts
    minThreads: 1
  },
} as UserConfig & VitestUserConfig);
