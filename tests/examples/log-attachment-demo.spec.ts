import { test, expect } from '../../src/fixtures/baseFixtures';
import { logger } from '../../src/utils/Logger';

/**
 * Demo Test Suite - Log Attachment to HTML Report
 * Demonstrates how test-specific log files are automatically attached to HTML reports
 */
test.describe('Log Attachment Demo', () => {
  
  test('Demo: Test with comprehensive logging', async ({ page }) => {
    logger.info('Step 1: Navigating to example.com');
    await page.goto('https://example.com');
    
    logger.info('Step 2: Waiting for page to load');
    await page.waitForLoadState('networkidle');
    
    logger.info('Step 3: Verifying page title');
    const title = await page.title();
    logger.info(`Page title: ${title}`);
    expect(title).toBeTruthy();
    
    logger.info('Step 4: Checking page content');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    logger.info('Step 5: Getting heading text');
    const headingText = await heading.textContent();
    logger.info(`Heading text: ${headingText}`);
    
    logger.info('✅ Test completed successfully');
  });

  test('Demo: Test with error handling', async ({ page }) => {
    try {
      logger.info('Attempting to navigate to example.com');
      await page.goto('https://example.com');
      
      logger.info('Looking for a non-existent element (will pass)');
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      logger.info('Test assertions passed');
    } catch (error) {
      logger.error('Test failed with error', { error: (error as Error).message });
      throw error;
    }
  });

  test('Demo: API call with logging', async ({ page }) => {
    logger.info('Starting API call demo test');
    
    logger.logAPIRequest('GET', 'https://example.com', undefined);
    const response = await page.goto('https://example.com');
    
    if (response) {
      logger.logAPIResponse('GET', 'https://example.com', response.status());
      logger.info(`Response status: ${response.status()}`);
      expect(response.status()).toBe(200);
    }
    
    logger.info('API call test completed');
  });
});
