import { test as base, Page, APIRequestContext } from '@playwright/test';
import { PageManager } from '../pages';
import { APIServices } from '../api';
import { TestDataManager } from '../utils/TestDataManager';

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
   * Page fixture with additional setup
   */
  page: async ({ page }, use) => {
    // Page-level setup can be added here
    await use(page);
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
