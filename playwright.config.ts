import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const localChromium =
  "/home/cism-i-435/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://127.0.0.1:5173",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      ...(existsSync(localChromium) ? { executablePath: localChromium } : {}),
      args: ["--no-sandbox"],
    },
  },
  reporter: "list",
});
