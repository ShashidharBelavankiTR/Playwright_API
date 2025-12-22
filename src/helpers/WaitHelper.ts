import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/Logger';

/**
 * WaitHelper - Custom wait utilities
 */
export class WaitHelper {
  /**
   * Wait for specific duration
   * @param milliseconds Duration in milliseconds
   */
  static async wait(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Wait for condition to be true
   * @param condition Condition function
   * @param timeout Timeout in milliseconds
   * @param pollInterval Poll interval in milliseconds
   * @returns true if condition met, false if timeout
   */
  static async waitForCondition(
    condition: () => boolean | Promise<boolean>,
    timeout: number = 30000,
    pollInterval: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const result = await condition();
        if (result) {
          logger.info('Wait condition met');
          return true;
        }
      } catch (error) {
        // Continue polling
      }
      await this.wait(pollInterval);
    }

    logger.warn('Wait condition timeout');
    return false;
  }

  /**
   * Poll until element count matches
   * @param page Page object
   * @param selector Element selector
   * @param expectedCount Expected count
   * @param timeout Timeout in milliseconds
   * @returns true if count matches
   */
  static async waitForElementCount(
    page: Page,
    selector: string,
    expectedCount: number,
    timeout: number = 30000
  ): Promise<boolean> {
    return await this.waitForCondition(
      async () => {
        const count = await page.locator(selector).count();
        return count === expectedCount;
      },
      timeout
    );
  }

  /**
   * Wait for text to appear in element
   * @param locator Element locator
   * @param expectedText Expected text
   * @param timeout Timeout in milliseconds
   * @returns true if text found
   */
  static async waitForText(
    locator: Locator,
    expectedText: string,
    timeout: number = 30000
  ): Promise<boolean> {
    return await this.waitForCondition(
      async () => {
        try {
          const text = await locator.innerText();
          return text.includes(expectedText);
        } catch {
          return false;
        }
      },
      timeout
    );
  }

  /**
   * Wait for element attribute value
   * @param locator Element locator
   * @param attribute Attribute name
   * @param expectedValue Expected value
   * @param timeout Timeout in milliseconds
   * @returns true if value matches
   */
  static async waitForAttributeValue(
    locator: Locator,
    attribute: string,
    expectedValue: string,
    timeout: number = 30000
  ): Promise<boolean> {
    return await this.waitForCondition(
      async () => {
        try {
          const value = await locator.getAttribute(attribute);
          return value === expectedValue;
        } catch {
          return false;
        }
      },
      timeout
    );
  }

  /**
   * Retry action with exponential backoff
   * @param action Action function to retry
   * @param maxRetries Maximum number of retries
   * @param initialDelay Initial delay in milliseconds
   * @returns Action result
   */
  static async retryWithBackoff<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`Attempt ${attempt} of ${maxRetries}`);
        return await action();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Attempt ${attempt} failed: ${lastError.message}`);

        if (attempt < maxRetries) {
          logger.info(`Retrying in ${delay}ms...`);
          await this.wait(delay);
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw new Error(
      `Action failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }
}
