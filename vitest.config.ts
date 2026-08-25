import "@oddbird/popover-polyfill";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./tests/vitest/setup.ts"],
    globals: true,
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
    exclude: [
      "**/node_modules/**",
      "**/__tests__/**", // Playwright E2E specs live here
      "**/dist/**",
      "**/*.spec.ts",
    ],
    coverage: {
      reporter: ["html", "text", "json", "json-summary"],
    },
  },
});
