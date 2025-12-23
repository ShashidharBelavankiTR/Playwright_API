import { test as base, Page, APIRequestContext } from '@playwright/test';
import { PageManager } from '../pages';
import { APIServices } from '../api';
import { TestDataManager } from '../utils/TestDataManager';
import { logger } from '../utils/Logger';
import * as fs from 'fs';

/**
 * Extended test fixtures for Playwright
 * Provides custom fixtures for pages, API services, and test data
 */

type CustomFixtures = {
  pages: PageManager;
  apiServices: APIServices;
  testData: TestDataManager;
};

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Browser context with auto-accept cookies and permissions
   */
  context: async ({ context }, use) => {
    // Grant permissions
    await context.grantPermissions(['geolocation', 'notifications']);

    // Add initialization script to accept cookies automatically
    await context.addInitScript(() => {
      // Auto-accept cookies logic can be added here
      window.localStorage.setItem('cookiesAccepted', 'true');
      window.localStorage.setItem('popupsAccepted', 'true');
    });

    await use(context);
  },

  /**
   * Page fixture with additional setup and test-specific logging
   */
  page: async ({ page }, use, testInfo) => {
    // Start test-specific logging
    const testName = testInfo.title;
    const testId = testInfo.testId;
    logger.startTestLog(testName, testId);
    
    logger.info(`🚀 Starting test: ${testName}`);
    logger.info(`📂 Test file: ${testInfo.file}`);
    logger.info(`🔖 Project: ${testInfo.project.name}`);

    // Set up page error listeners
    page.on('pageerror', (error) => {
      logger.error(`🔥 Page Error: ${error.message}`);
      if (error.stack) {
        logger.error(`Stack: ${error.stack}`);
      }
    });

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        logger.error(`🖥️ Browser Console Error: ${text}`);
      } else if (type === 'warning') {
        logger.warn(`🖥️ Browser Console Warning: ${text}`);
      } else if (type === 'log' || type === 'info') {
        logger.debug(`🖥️ Browser Console: ${text}`);
      }
    });

    page.on('crash', () => {
      logger.error('💥 Page crashed!');
    });

    page.on('requestfailed', (request) => {
      logger.error(`❌ Request Failed: ${request.url()}`);
      logger.error(`Failure: ${request.failure()?.errorText || 'Unknown error'}`);
    });

    // Run the test
    await use(page);

    // Determine test status and capture errors
    const status = testInfo.status || 'unknown';
    
    // Log test errors if any
    if (testInfo.errors && testInfo.errors.length > 0) {
      logger.error(`❌ Test failed with ${testInfo.errors.length} error(s):`);
      testInfo.errors.forEach((error, index) => {
        logger.error(`\n--- Error ${index + 1} ---`);
        logger.error(`Message: ${error.message || 'No message'}`);
        if (error.stack) {
          logger.error(`Stack Trace:\n${error.stack}`);
        }
        if (error.value) {
          logger.error(`Value: ${error.value}`);
        }
      });
    }

    // Log final status
    if (status === 'failed') {
      logger.error(`❌ Test completed with status: ${status}`);
    } else if (status === 'passed') {
      logger.info(`✅ Test completed with status: ${status}`);
    } else {
      logger.warn(`⚠️ Test completed with status: ${status}`);
    }
    
    // End test logging
    logger.endTestLog(status);

    // Attach log file to the test report
    const logFilePath = logger.getCurrentTestLogFile();
    if (logFilePath && fs.existsSync(logFilePath)) {
      await testInfo.attach('test-log', {
        path: logFilePath,
        contentType: 'text/plain',
      });
    }
  },

  /**
   * Pages fixture - provides access to all page objects
   */
  pages: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  /**
   * API Services fixture - provides access to all API services
   */
  apiServices: async ({ request }, use) => {
    const apiServices = new APIServices(request);
    await use(apiServices);
  },

  /**
   * Test Data fixture - provides access to test data manager
   */
  testData: async ({}, use) => {
    const testDataManager = TestDataManager.getInstance();
    await use(testDataManager);
  },
});

/**
 * Export expect from Playwright for convenience
 */
export { expect } from '@playwright/test';
