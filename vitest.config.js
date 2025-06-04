import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "tests/**/*.test.js",
      "domain/**/*.test.js",
      "usecases/**/*.test.js",
      "infrastructure/**/*.test.js",
    ],
  },
});
