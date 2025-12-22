import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  
  /* Maximum time one test can run for */
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: Number(process.env.RETRIES) || (process.env.CI ? 2 : 0),
  
  /* Opt out of parallel tests on CI */
  workers: Number(process.env.PARALLEL_WORKERS) || (process.env.CI ? 1 : undefined),
  
  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['list'],
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://example.com',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot settings */
    screenshot: process.env.SCREENSHOT_ON_FAILURE === 'true' ? 'only-on-failure' : 'off',
    
    /* Video settings */
    video: process.env.VIDEO_ON_FAILURE === 'retain-on-failure' ? 'retain-on-failure' : 'off',
    
    /* Maximum time each action can take */
    actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,
    
    /* Navigation timeout */
    navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 60000,
    
    /* Viewport size */
    viewport: {
      width: Number(process.env.VIEWPORT_WIDTH) || 1920,
      height: Number(process.env.VIEWPORT_HEIGHT) || 1080,
    },
    
    /* Emulate browser locale and timezone */
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        headless: process.env.HEADLESS === 'true',
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        headless: process.env.HEADLESS === 'true',
      },
    },

    /* Test against branded browsers */
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        headless: process.env.HEADLESS === 'true',
      },
    },
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        headless: process.env.HEADLESS === 'true',
      },
    },
  ],

  /* Global setup and teardown */
  // globalSetup: require.resolve('./src/config/global-setup'),
  // globalTeardown: require.resolve('./src/config/global-teardown'),
});
