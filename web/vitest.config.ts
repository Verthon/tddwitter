import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          include: ['**/*.unit.spec.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        envPrefix: ['VITE_', 'PUBLIC_'],
        test: {
          include: ['**/*.browser.spec.{ts,tsx}'],
          name: 'browser',
          expect: { poll: { timeout: 5_000 } },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium', sequence: { groupOrder: 1 } },
              { browser: 'webkit', sequence: { groupOrder: 2 } },
            ],
          },
          setupFiles: ['src/test/setup.browser.ts'],
        },
      },
    ],
  },
});
