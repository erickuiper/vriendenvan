import { defineConfig, devices } from '@playwright/test'

/**
 * Run against a running Docker container (e.g. docker run -p 8080:80 erickuiper/vriendenvan).
 * No webServer: container must already be running.
 */
const baseURL = process.env.DOCKER_BASE_URL ?? 'http://localhost:8080'
const timeout = 15000

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'docker.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    actionTimeout: timeout,
    navigationTimeout: timeout,
  },
  timeout,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        isMobile: false,
      },
    },
  ],
})
