import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { playwright } from '@vitest/browser-playwright'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.vitest.json")],
      loose: true,
    }),
    react(),
  ],
  test: {
    projects: [
      {
        test: {
          include: ["**/*.unit.spec.ts"],
          name: "unit",
          environment: "node",
        },
      },
      {
        envPrefix: ["VITE_", "PUBLIC_"],
        test: {
          alias: [
            {
              find: /^src($|\/)/,
              replacement: `${resolve(__dirname, "src")}/`,
            },
          ],
          include: ["**/*.browser.spec.{ts,tsx}"],
          name: "browser",
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: "chromium" },
              { browser: "webkit" },
            ],
          },
          setupFiles: ["src/test/setup.browser.ts"],
        },
      },
    ],
  },
});
