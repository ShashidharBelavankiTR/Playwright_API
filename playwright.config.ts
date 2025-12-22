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
    screenshot: process.env.SCREENSHOT_ON_FAILURE === 'true' 
      ? 'only-on-failure' 
      : process.env.SCREENSHOT_ON_SUCCESS === 'true' 
        ? 'on' 
        : 'off',
    
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
    
    /* Slow down actions */
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO) || 0,
    },
    
    /* Emulate browser locale and timezone */
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  /* Configure projects for major browsers */
  projects: (process.env.BROWSER 
    ? [
        // Use the browser specified in .env
        ...(process.env.BROWSER === 'chromium' ? [{
          name: 'chromium',
          use: { 
            ...devices['Desktop Chrome'],
            headless: process.env.HEADLESS === 'true',
          },
        }] : []),
        ...(process.env.BROWSER === 'firefox' ? [{
          name: 'firefox',
          use: { 
            ...devices['Desktop Firefox'],
            headless: process.env.HEADLESS === 'true',
          },
        }] : []),
        ...(process.env.BROWSER === 'webkit' ? [{
          name: 'webkit',
          use: { 
            ...devices['Desktop Safari'],
            headless: process.env.HEADLESS === 'true',
          },
        }] : []),
      ]
    : [
        // Default to all browsers if BROWSER is not specified
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
      ]
  ),

  /* Global setup and teardown */
  globalSetup: require.resolve('./src/config/global-setup'),
  globalTeardown: require.resolve('./src/config/global-teardown'),
});
