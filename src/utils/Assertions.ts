import { Page, Locator, expect, test, APIResponse } from '@playwright/test';
import { logger } from './Logger';

/**
 * Assertions - Comprehensive assertion utility class with detailed logging
 * Provides wrapper methods around Playwright assertions with enhanced logging and reporting
 */
export class Assertions {
  private static stepCounter = 0;

  /**
   * Generate unique step ID for tracking
   */
  private static generateStepId(): string {
    return `STEP_${++this.stepCounter}_${Date.now()}`;
  }

  /**
   * Log assertion start
   */
  private static logAssertionStart(assertionName: string, details: any = {}): string {
    const stepId = this.generateStepId();
    logger.info(`🔍 [${stepId}] Starting assertion: ${assertionName}`, details);
    return stepId;
  }

  /**
   * Log assertion success
   */
  private static logAssertionSuccess(stepId: string, assertionName: string, details: any = {}): void {
    logger.info(`✅ [${stepId}] Assertion PASSED: ${assertionName}`, details);
    logger.logStep(assertionName, 'PASSED');
  }

  /**
   * Log assertion failure
   */
  private static logAssertionFailure(stepId: string, assertionName: string, error: Error, details: any = {}): void {
    logger.error(`❌ [${stepId}] Assertion FAILED: ${assertionName}`, { error: error.message, ...details });
    logger.logStep(assertionName, 'FAILED');
  }

  // ==================== Element Visibility Assertions ====================

  /**
   * Assert that element is visible
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeVisible(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be visible', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is visible: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeVisible({ timeout });
        this.logAssertionSuccess(stepId, 'Element is visible', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is visible', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that element is hidden/not visible
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeHidden(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be hidden', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is hidden: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeHidden({ timeout });
        this.logAssertionSuccess(stepId, 'Element is hidden', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is hidden', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that element is attached to DOM
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeAttached(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be attached', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is attached: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeAttached({ timeout });
        this.logAssertionSuccess(stepId, 'Element is attached', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is attached', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  // ==================== Element State Assertions ====================

  /**
   * Assert that element is enabled
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeEnabled(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be enabled', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is enabled: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeEnabled({ timeout });
        this.logAssertionSuccess(stepId, 'Element is enabled', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is enabled', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that element is disabled
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeDisabled(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be disabled', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is disabled: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeDisabled({ timeout });
        this.logAssertionSuccess(stepId, 'Element is disabled', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is disabled', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that checkbox/radio is checked
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeChecked(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be checked', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is checked: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeChecked({ timeout });
        this.logAssertionSuccess(stepId, 'Element is checked', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is checked', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that checkbox/radio is not checked
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeUnchecked(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be unchecked', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is unchecked: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).not.toBeChecked({ timeout });
        this.logAssertionSuccess(stepId, 'Element is unchecked', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is unchecked', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that element is editable
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeEditable(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be editable', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is editable: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeEditable({ timeout });
        this.logAssertionSuccess(stepId, 'Element is editable', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is editable', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  /**
   * Assert that element is focused
   * @param locator Playwright locator
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toBeFocused(locator: Locator, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to be focused', {
      selector: locator.toString(),
      message,
      timeout,
    });

    await test.step(`Assert element is focused: ${message || locator.toString()}`, async () => {
      try {
        await expect(locator).toBeFocused({ timeout });
        this.logAssertionSuccess(stepId, 'Element is focused', { selector: locator.toString() });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element is focused', error as Error, { selector: locator.toString() });
        throw error;
      }
    });
  }

  // ==================== Text Content Assertions ====================

  /**
   * Assert that element contains text
   * @param locator Playwright locator
   * @param expectedText Expected text or regex
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toContainText(
    locator: Locator,
    expectedText: string | RegExp | Array<string | RegExp>,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to contain text', {
      selector: locator.toString(),
      expectedText,
      message,
      timeout,
    });

    await test.step(`Assert element contains text: ${message || expectedText}`, async () => {
      try {
        await expect(locator).toContainText(expectedText, { timeout });
        this.logAssertionSuccess(stepId, 'Element contains text', {
          selector: locator.toString(),
          expectedText,
        });
      } catch (error) {
        const actualText = await locator.textContent().catch(() => 'Unable to get text');
        this.logAssertionFailure(stepId, 'Element contains text', error as Error, {
          selector: locator.toString(),
          expectedText,
          actualText,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that element has exact text
   * @param locator Playwright locator
   * @param expectedText Expected text or regex
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveText(
    locator: Locator,
    expectedText: string | RegExp | Array<string | RegExp>,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to have text', {
      selector: locator.toString(),
      expectedText,
      message,
      timeout,
    });

    await test.step(`Assert element has text: ${message || expectedText}`, async () => {
      try {
        await expect(locator).toHaveText(expectedText, { timeout });
        this.logAssertionSuccess(stepId, 'Element has text', {
          selector: locator.toString(),
          expectedText,
        });
      } catch (error) {
        const actualText = await locator.textContent().catch(() => 'Unable to get text');
        this.logAssertionFailure(stepId, 'Element has text', error as Error, {
          selector: locator.toString(),
          expectedText,
          actualText,
        });
        throw error;
      }
    });
  }

  // ==================== Attribute Assertions ====================

  /**
   * Assert that element has specific attribute with value
   * @param locator Playwright locator
   * @param attributeName Attribute name
   * @param expectedValue Expected attribute value
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveAttribute(
    locator: Locator,
    attributeName: string,
    expectedValue: string | RegExp,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to have attribute', {
      selector: locator.toString(),
      attributeName,
      expectedValue,
      message,
      timeout,
    });

    await test.step(`Assert element has attribute ${attributeName}: ${message || expectedValue}`, async () => {
      try {
        await expect(locator).toHaveAttribute(attributeName, expectedValue, { timeout });
        this.logAssertionSuccess(stepId, 'Element has attribute', {
          selector: locator.toString(),
          attributeName,
          expectedValue,
        });
      } catch (error) {
        const actualValue = await locator.getAttribute(attributeName).catch(() => 'null');
        this.logAssertionFailure(stepId, 'Element has attribute', error as Error, {
          selector: locator.toString(),
          attributeName,
          expectedValue,
          actualValue,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that element has specific CSS class
   * @param locator Playwright locator
   * @param className Expected class name
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveClass(
    locator: Locator,
    className: string | RegExp | Array<string | RegExp>,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to have class', {
      selector: locator.toString(),
      className,
      message,
      timeout,
    });

    await test.step(`Assert element has class: ${message || className}`, async () => {
      try {
        await expect(locator).toHaveClass(className, { timeout });
        this.logAssertionSuccess(stepId, 'Element has class', {
          selector: locator.toString(),
          className,
        });
      } catch (error) {
        const actualClass = await locator.getAttribute('class').catch(() => 'null');
        this.logAssertionFailure(stepId, 'Element has class', error as Error, {
          selector: locator.toString(),
          expectedClass: className,
          actualClass,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that element has specific ID
   * @param locator Playwright locator
   * @param id Expected ID
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveId(locator: Locator, id: string | RegExp, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Element to have ID', {
      selector: locator.toString(),
      id,
      message,
      timeout,
    });

    await test.step(`Assert element has ID: ${message || id}`, async () => {
      try {
        await expect(locator).toHaveId(id, { timeout });
        this.logAssertionSuccess(stepId, 'Element has ID', {
          selector: locator.toString(),
          id,
        });
      } catch (error) {
        const actualId = await locator.getAttribute('id').catch(() => 'null');
        this.logAssertionFailure(stepId, 'Element has ID', error as Error, {
          selector: locator.toString(),
          expectedId: id,
          actualId,
        });
        throw error;
      }
    });
  }

  // ==================== Value Assertions ====================

  /**
   * Assert that input element has specific value
   * @param locator Playwright locator
   * @param expectedValue Expected value
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveValue(
    locator: Locator,
    expectedValue: string | RegExp,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to have value', {
      selector: locator.toString(),
      expectedValue,
      message,
      timeout,
    });

    await test.step(`Assert element has value: ${message || expectedValue}`, async () => {
      try {
        await expect(locator).toHaveValue(expectedValue, { timeout });
        this.logAssertionSuccess(stepId, 'Element has value', {
          selector: locator.toString(),
          expectedValue,
        });
      } catch (error) {
        const actualValue = await locator.inputValue().catch(() => 'Unable to get value');
        this.logAssertionFailure(stepId, 'Element has value', error as Error, {
          selector: locator.toString(),
          expectedValue,
          actualValue,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that input element has specific values (for multi-select)
   * @param locator Playwright locator
   * @param expectedValues Expected values
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveValues(
    locator: Locator,
    expectedValues: Array<string | RegExp>,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to have values', {
      selector: locator.toString(),
      expectedValues,
      message,
      timeout,
    });

    await test.step(`Assert element has values: ${message || expectedValues}`, async () => {
      try {
        await expect(locator).toHaveValues(expectedValues, { timeout });
        this.logAssertionSuccess(stepId, 'Element has values', {
          selector: locator.toString(),
          expectedValues,
        });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element has values', error as Error, {
          selector: locator.toString(),
          expectedValues,
        });
        throw error;
      }
    });
  }

  // ==================== Count Assertions ====================

  /**
   * Assert element count
   * @param locator Playwright locator
   * @param expectedCount Expected count
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveCount(locator: Locator, expectedCount: number, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Elements to have count', {
      selector: locator.toString(),
      expectedCount,
      message,
      timeout,
    });

    await test.step(`Assert elements count: ${message || expectedCount}`, async () => {
      try {
        await expect(locator).toHaveCount(expectedCount, { timeout });
        this.logAssertionSuccess(stepId, 'Elements have count', {
          selector: locator.toString(),
          expectedCount,
        });
      } catch (error) {
        const actualCount = await locator.count();
        this.logAssertionFailure(stepId, 'Elements have count', error as Error, {
          selector: locator.toString(),
          expectedCount,
          actualCount,
        });
        throw error;
      }
    });
  }

  // ==================== URL Assertions ====================

  /**
   * Assert page URL
   * @param page Playwright page
   * @param expectedUrl Expected URL or regex
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveURL(page: Page, expectedUrl: string | RegExp, message?: string, timeout?: number): Promise<void> {
    const stepId = this.logAssertionStart('Page to have URL', {
      expectedUrl,
      message,
      timeout,
    });

    await test.step(`Assert page has URL: ${message || expectedUrl}`, async () => {
      try {
        await expect(page).toHaveURL(expectedUrl, { timeout });
        this.logAssertionSuccess(stepId, 'Page has URL', { expectedUrl });
      } catch (error) {
        const actualUrl = page.url();
        this.logAssertionFailure(stepId, 'Page has URL', error as Error, {
          expectedUrl,
          actualUrl,
        });
        throw error;
      }
    });
  }

  /**
   * Assert page title
   * @param page Playwright page
   * @param expectedTitle Expected title or regex
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveTitle(
    page: Page,
    expectedTitle: string | RegExp,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Page to have title', {
      expectedTitle,
      message,
      timeout,
    });

    await test.step(`Assert page has title: ${message || expectedTitle}`, async () => {
      try {
        await expect(page).toHaveTitle(expectedTitle, { timeout });
        this.logAssertionSuccess(stepId, 'Page has title', { expectedTitle });
      } catch (error) {
        const actualTitle = await page.title();
        this.logAssertionFailure(stepId, 'Page has title', error as Error, {
          expectedTitle,
          actualTitle,
        });
        throw error;
      }
    });
  }

  // ==================== API Response Assertions ====================

  /**
   * Assert API response status code
   * @param response API response
   * @param expectedStatus Expected status code
   * @param message Custom assertion message
   */
  static async toHaveStatusCode(response: APIResponse, expectedStatus: number, message?: string): Promise<void> {
    const stepId = this.logAssertionStart('Response to have status code', {
      expectedStatus,
      message,
    });

    await test.step(`Assert response status: ${message || expectedStatus}`, async () => {
      try {
        expect(response.status()).toBe(expectedStatus);
        this.logAssertionSuccess(stepId, 'Response has status code', {
          expectedStatus,
          actualStatus: response.status(),
        });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Response has status code', error as Error, {
          expectedStatus,
          actualStatus: response.status(),
          url: response.url(),
        });
        throw error;
      }
    });
  }

  /**
   * Assert API response is OK (200-299)
   * @param response API response
   * @param message Custom assertion message
   */
  static async toBeOK(response: APIResponse, message?: string): Promise<void> {
    const stepId = this.logAssertionStart('Response to be OK', { message });

    await test.step(`Assert response is OK: ${message || 'Status 200-299'}`, async () => {
      try {
        expect(response.ok()).toBeTruthy();
        this.logAssertionSuccess(stepId, 'Response is OK', {
          status: response.status(),
          statusText: response.statusText(),
        });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Response is OK', error as Error, {
          status: response.status(),
          statusText: response.statusText(),
          url: response.url(),
        });
        throw error;
      }
    });
  }

  /**
   * Assert API response body contains expected data
   * @param response API response
   * @param expectedData Expected data in response body
   * @param message Custom assertion message
   */
  static async toContainResponseData(response: APIResponse, expectedData: any, message?: string): Promise<void> {
    const stepId = this.logAssertionStart('Response to contain data', {
      expectedData,
      message,
    });

    await test.step(`Assert response contains data: ${message || JSON.stringify(expectedData)}`, async () => {
      try {
        const responseBody = await response.json();
        expect(responseBody).toMatchObject(expectedData);
        this.logAssertionSuccess(stepId, 'Response contains data', { expectedData });
      } catch (error) {
        const responseBody = await response.text();
        this.logAssertionFailure(stepId, 'Response contains data', error as Error, {
          expectedData,
          responseBody,
        });
        throw error;
      }
    });
  }

  // ==================== CSS Style Assertions ====================

  /**
   * Assert element has specific CSS property value
   * @param locator Playwright locator
   * @param propertyName CSS property name
   * @param expectedValue Expected CSS value
   * @param message Custom assertion message
   * @param timeout Optional timeout
   */
  static async toHaveCSS(
    locator: Locator,
    propertyName: string,
    expectedValue: string | RegExp,
    message?: string,
    timeout?: number
  ): Promise<void> {
    const stepId = this.logAssertionStart('Element to have CSS', {
      selector: locator.toString(),
      propertyName,
      expectedValue,
      message,
      timeout,
    });

    await test.step(`Assert element has CSS ${propertyName}: ${message || expectedValue}`, async () => {
      try {
        await expect(locator).toHaveCSS(propertyName, expectedValue, { timeout });
        this.logAssertionSuccess(stepId, 'Element has CSS', {
          selector: locator.toString(),
          propertyName,
          expectedValue,
        });
      } catch (error) {
        this.logAssertionFailure(stepId, 'Element has CSS', error as Error, {
          selector: locator.toString(),
          propertyName,
          expectedValue,
        });
        throw error;
      }
    });
  }

  // ==================== Custom Generic Assertions ====================

  /**
   * Assert with custom condition and message
   * @param condition Condition to assert
   * @param assertionName Assertion name
   * @param errorMessage Error message if condition fails
   * @param details Additional details to log
   */
  static async assertCondition(
    condition: boolean,
    assertionName: string,
    errorMessage: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, details);

    await test.step(`Assert: ${assertionName}`, async () => {
      try {
        expect(condition).toBeTruthy();
        this.logAssertionSuccess(stepId, assertionName, details);
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, new Error(errorMessage), details);
        throw new Error(errorMessage);
      }
    });
  }

  /**
   * Assert equality with detailed logging
   * @param actual Actual value
   * @param expected Expected value
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertEqual<T>(actual: T, expected: T, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { actual, expected, ...details });

    await test.step(`Assert equal: ${assertionName}`, async () => {
      try {
        // Use JSON comparison for objects and arrays, toBe for primitives
        if (typeof actual === 'object' && actual !== null && typeof expected === 'object' && expected !== null) {
          const actualStr = JSON.stringify(actual);
          const expectedStr = JSON.stringify(expected);
          expect(actualStr).toBe(expectedStr);
        } else {
          expect(actual).toBe(expected);
        }
        this.logAssertionSuccess(stepId, assertionName, { actual, expected, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          actual,
          expected,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert deep equality with detailed logging
   * @param actual Actual value
   * @param expected Expected value
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertDeepEqual<T>(actual: T, expected: T, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { actual, expected, ...details });

    await test.step(`Assert deep equal: ${assertionName}`, async () => {
      try {
        // Deep comparison using JSON serialization for Playwright compatibility
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        expect(actualStr).toBe(expectedStr);
        this.logAssertionSuccess(stepId, assertionName, { actual, expected, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          actual,
          expected,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that value is truthy
   * @param value Value to check
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertTruthy(value: any, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { value, ...details });

    await test.step(`Assert truthy: ${assertionName}`, async () => {
      try {
        expect(value).toBeTruthy();
        this.logAssertionSuccess(stepId, assertionName, { value, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          value,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that value is falsy
   * @param value Value to check
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertFalsy(value: any, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { value, ...details });

    await test.step(`Assert falsy: ${assertionName}`, async () => {
      try {
        expect(value).toBeFalsy();
        this.logAssertionSuccess(stepId, assertionName, { value, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          value,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that value is null
   * @param value Value to check
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertNull(value: any, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { value, ...details });

    await test.step(`Assert null: ${assertionName}`, async () => {
      try {
        expect(value).toBeNull();
        this.logAssertionSuccess(stepId, assertionName, { value, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          value,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that value is not null
   * @param value Value to check
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertNotNull(value: any, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { value, ...details });

    await test.step(`Assert not null: ${assertionName}`, async () => {
      try {
        expect(value).not.toBeNull();
        this.logAssertionSuccess(stepId, assertionName, { value, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          value,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that value is undefined
   * @param value Value to check
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertUndefined(value: any, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { value, ...details });

    await test.step(`Assert undefined: ${assertionName}`, async () => {
      try {
        expect(value).toBeUndefined();
        this.logAssertionSuccess(stepId, assertionName, { value, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          value,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that value is defined
   * @param value Value to check
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertDefined(value: any, assertionName: string, details: any = {}): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { value, ...details });

    await test.step(`Assert defined: ${assertionName}`, async () => {
      try {
        expect(value).toBeDefined();
        this.logAssertionSuccess(stepId, assertionName, { value, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          value,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that array contains value
   * @param array Array to check
   * @param expectedValue Expected value in array
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertArrayContains<T>(
    array: T[],
    expectedValue: T,
    assertionName: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { array, expectedValue, ...details });

    await test.step(`Assert array contains: ${assertionName}`, async () => {
      try {
        expect(array).toContain(expectedValue);
        this.logAssertionSuccess(stepId, assertionName, { array, expectedValue, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          array,
          expectedValue,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert that object has property
   * @param obj Object to check
   * @param propertyName Property name
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertHasProperty(
    obj: any,
    propertyName: string,
    assertionName: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { obj, propertyName, ...details });

    await test.step(`Assert has property: ${assertionName}`, async () => {
      try {
        expect(obj).toHaveProperty(propertyName);
        this.logAssertionSuccess(stepId, assertionName, { obj, propertyName, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          obj,
          propertyName,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert string contains substring
   * @param text Text to check
   * @param substring Expected substring
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertStringContains(
    text: string,
    substring: string,
    assertionName: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { text, substring, ...details });

    await test.step(`Assert string contains: ${assertionName}`, async () => {
      try {
        expect(text).toContain(substring);
        this.logAssertionSuccess(stepId, assertionName, { text, substring, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          text,
          substring,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert string matches regex
   * @param text Text to check
   * @param pattern Regex pattern
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertStringMatches(
    text: string,
    pattern: RegExp,
    assertionName: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { text, pattern, ...details });

    await test.step(`Assert string matches: ${assertionName}`, async () => {
      try {
        expect(text).toMatch(pattern);
        this.logAssertionSuccess(stepId, assertionName, { text, pattern, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          text,
          pattern,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert number is greater than
   * @param actual Actual value
   * @param expected Expected value to be greater than
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertGreaterThan(
    actual: number,
    expected: number,
    assertionName: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { actual, expected, ...details });

    await test.step(`Assert greater than: ${assertionName}`, async () => {
      try {
        expect(actual).toBeGreaterThan(expected);
        this.logAssertionSuccess(stepId, assertionName, { actual, expected, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          actual,
          expected,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Assert number is less than
   * @param actual Actual value
   * @param expected Expected value to be less than
   * @param assertionName Assertion name
   * @param details Additional details
   */
  static async assertLessThan(
    actual: number,
    expected: number,
    assertionName: string,
    details: any = {}
  ): Promise<void> {
    const stepId = this.logAssertionStart(assertionName, { actual, expected, ...details });

    await test.step(`Assert less than: ${assertionName}`, async () => {
      try {
        expect(actual).toBeLessThan(expected);
        this.logAssertionSuccess(stepId, assertionName, { actual, expected, ...details });
      } catch (error) {
        this.logAssertionFailure(stepId, assertionName, error as Error, {
          actual,
          expected,
          ...details,
        });
        throw error;
      }
    });
  }

  /**
   * Soft assertion - doesn't throw error immediately
   * @param locator Playwright locator
   * @param assertion Assertion type
   * @param expected Expected value
   * @param message Custom message
   */
  static async softAssert(
    locator: Locator,
    assertion: 'toBeVisible' | 'toHaveText' | 'toContainText',
    expected?: any,
    message?: string
  ): Promise<void> {
    const stepId = this.logAssertionStart(`Soft ${assertion}`, {
      selector: locator.toString(),
      expected,
      message,
    });

    await test.step(`Soft assert ${assertion}: ${message || expected}`, async () => {
      try {
        switch (assertion) {
          case 'toBeVisible':
            await expect.soft(locator).toBeVisible();
            break;
          case 'toHaveText':
            await expect.soft(locator).toHaveText(expected);
            break;
          case 'toContainText':
            await expect.soft(locator).toContainText(expected);
            break;
        }
        this.logAssertionSuccess(stepId, `Soft ${assertion}`, { selector: locator.toString(), expected });
      } catch (error) {
        this.logAssertionFailure(stepId, `Soft ${assertion}`, error as Error, {
          selector: locator.toString(),
          expected,
        });
        // Soft assertion: log but don't throw
      }
    });
  }
}

// Export singleton-like instance for convenience
export const assert = Assertions;
