import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      reporter: ["text", "html", "lcov"],
      lines: 95,
      branches: 95,
      functions: 95,
      statements: 95,
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/app/api/**", "src/**/*.d.ts"]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
