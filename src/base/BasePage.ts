import { Page, Locator, test } from '@playwright/test';
import { logger } from '../utils/Logger';
import { WaitHelper } from '../helpers/WaitHelper';
import {
  ClickOptions,
  ElementNotFoundException,
  TimeoutException,
} from '../types';

export type ModifierKey = 'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface FillFormField {
  locator: Locator | string;
  value: string;
  /**
   * Optional: controls how the field is filled.
   * - fill: uses locator.fill()
   * - type: uses locator.pressSequentially()
   */
  mode?: 'fill' | 'type';
  /** Optional delay between keystrokes (only when mode === 'type') */
  delayMs?: number;
}

export interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'None' | 'Strict';
}

export interface AlertResult {
  message: string;
}

export interface PromptResult {
  message: string;
}
import * as fs from 'fs';
import * as path from 'path';

/**
 * BasePage - Base class for all page objects
 * Contains reusable web action methods with comprehensive error handling and logging
 */
export class BasePage {
  protected readonly page: Page;
  protected readonly screenshotDir: string = 'screenshots';

  constructor(page: Page) {
    this.page = page;
    this.ensureScreenshotDirectoryExists();
  }

  /**
   * Ensure screenshot directory exists
   */
  private ensureScreenshotDirectoryExists(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  /**
   * Resolve locator from string or Locator object
   * @param locator Locator or string selector
   * @returns Locator object
   */
  private resolveLocator(locator: Locator | string): Locator {
    return typeof locator === 'string' ? this.page.locator(locator) : locator;
  }

  /**
   * Get timestamp for file naming
   * @returns Formatted timestamp string
   */
  private getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to a URL
   * @param url URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await test.step(`Navigate to: ${url}`, async () => {
      try {
        logger.logAction('Navigate', url);
        await WaitHelper.retryWithBackoff(async () => {
          await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        }, 2, 1000);
        logger.info(`Successfully navigated to: ${url}`);
      } catch (error) {
        logger.error(`Failed to navigate to ${url}: ${(error as Error).message}`);
        await this.takeScreenshot(`navigation-error-${this.getTimestamp()}`);
        throw new Error(`Navigation failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await test.step('Reload page', async () => {
      try {
        logger.logAction('Reload page');
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        logger.info('Page reloaded successfully');
      } catch (error) {
        logger.error(`Failed to reload page: ${(error as Error).message}`);
        throw new Error(`Reload failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Navigate back in browser history
   */
  async goBack(): Promise<void> {
    await test.step('Navigate back', async () => {
      try {
        logger.logAction('Go back');
        await this.page.goBack({ waitUntil: 'domcontentloaded' });
        logger.info('Navigated back successfully');
      } catch (error) {
        logger.error(`Failed to go back: ${(error as Error).message}`);
        throw new Error(`Go back failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Navigate forward in browser history
   */
  async goForward(): Promise<void> {
    await test.step('Navigate forward', async () => {
      try {
        logger.logAction('Go forward');
        await this.page.goForward({ waitUntil: 'domcontentloaded' });
        logger.info('Navigated forward successfully');
      } catch (error) {
        logger.error(`Failed to go forward: ${(error as Error).message}`);
        throw new Error(`Go forward failed: ${(error as Error).message}`);
      }
    });
  }

  // ==================== INTERACTION METHODS ====================

  /**
   * Click on an element
   * @param locator Element locator or selector
   * @param options Click options
   */
  async click(locator: Locator | string, options?: ClickOptions): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Click on: ${selector}`, async () => {
      try {
        logger.logAction('Click', selector);
        const element = this.resolveLocator(locator);
        await WaitHelper.retryWithBackoff(async () => {
          // Wait for element to be visible and attached
          await element.waitFor({ state: 'visible', timeout: 10000 });
          // Wait for element to be enabled
          await element.waitFor({ state: 'attached', timeout: 5000 });
          // Additional check for enabled state
          const isEnabled = await element.isEnabled();
          if (!isEnabled) {
            throw new Error(`Element ${selector} is not enabled`);
          }
          await element.click(options);
        }, 2, 500);
        logger.info(`Clicked on element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to click on ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`click-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Click failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Double click on an element
   * @param locator Element locator or selector
   */
  async doubleClick(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Double click on: ${selector}`, async () => {
      try {
        logger.logAction('Double click', selector);
        const element = this.resolveLocator(locator);
        await WaitHelper.retryWithBackoff(async () => {
          // Wait for element to be visible and enabled
          await element.waitFor({ state: 'visible', timeout: 10000 });
          const isEnabled = await element.isEnabled();
          if (!isEnabled) {
            throw new Error(`Element ${selector} is not enabled for double click`);
          }
          await element.dblclick();
        }, 2, 500);
        logger.info(`Double clicked on element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to double click on ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`doubleclick-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Double click failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Right click on an element
   * @param locator Element locator or selector
   */
  async rightClick(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Right click on: ${selector}`, async () => {
      try {
        logger.logAction('Right click', selector);
        const element = this.resolveLocator(locator);
        // Wait for element to be visible and enabled
        await element.waitFor({ state: 'visible', timeout: 10000 });
        const isEnabled = await element.isEnabled();
        if (!isEnabled) {
          throw new Error(`Element ${selector} is not enabled for right click`);
        }
        await element.click({ button: 'right' });
        logger.info(`Right clicked on element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to right click on ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`rightclick-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Right click failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Fill an input field
   * @param locator Element locator or selector
   * @param text Text to fill
   */
  async fill(locator: Locator | string, text: string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Fill "${text}" into: ${selector}`, async () => {
      try {
        logger.logAction(`Fill text: ${text}`, selector);
        const element = this.resolveLocator(locator);
        await WaitHelper.retryWithBackoff(async () => {
          await element.waitFor({ state: 'visible', timeout: 10000 });
          await WaitHelper.waitForCondition(async () => {
            return await element.isEnabled();
          }, 5000, 200);
          await element.fill(text);
        }, 2, 500);
        logger.info(`Filled text into element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to fill text in ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`fill-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Fill failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Clear an input field
   * @param locator Element locator or selector
   */
  async clear(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Clear: ${selector}`, async () => {
      try {
        logger.logAction('Clear', selector);
        const element = this.resolveLocator(locator);
        // Wait for element to be visible and editable
        await element.waitFor({ state: 'visible', timeout: 10000 });
        const isEditable = await element.isEditable();
        if (!isEditable) {
          throw new Error(`Element ${selector} is not editable`);
        }
        await element.clear();
        logger.info(`Cleared element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to clear ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`clear-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Clear failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Select option from dropdown
   * @param locator Element locator or selector
   * @param value Value(s) to select
   */
  async selectOption(
    locator: Locator | string,
    value: string | string[]
  ): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Select option "${value}" in: ${selector}`, async () => {
      try {
        logger.logAction(`Select option: ${value}`, selector);
        const element = this.resolveLocator(locator);
        await WaitHelper.retryWithBackoff(async () => {
          // Wait for element to be visible and enabled
          await element.waitFor({ state: 'visible', timeout: 10000 });
          const isEnabled = await element.isEnabled();
          if (!isEnabled) {
            throw new Error(`Element ${selector} is not enabled`);
          }
          await element.selectOption(value);
        }, 2, 500);
        logger.info(`Selected option in element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to select option in ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`select-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Select option failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Check a checkbox or radio button
   * @param locator Element locator or selector
   */
  async check(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Check: ${selector}`, async () => {
      try {
        logger.logAction('Check', selector);
        const element = this.resolveLocator(locator);
        // Wait for element to be visible and enabled
        await element.waitFor({ state: 'visible', timeout: 10000 });
        const isEnabled = await element.isEnabled();
        if (!isEnabled) {
          throw new Error(`Element ${selector} is not enabled`);
        }
        await element.check();
        logger.info(`Checked element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to check ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`check-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Check failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Uncheck a checkbox
   * @param locator Element locator or selector
   */
  async uncheck(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Uncheck: ${selector}`, async () => {
      try {
        logger.logAction('Uncheck', selector);
        const element = this.resolveLocator(locator);
        // Wait for element to be visible and enabled
        await element.waitFor({ state: 'visible', timeout: 10000 });
        const isEnabled = await element.isEnabled();
        if (!isEnabled) {
          throw new Error(`Element ${selector} is not enabled`);
        }
        await element.uncheck();
        logger.info(`Unchecked element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to uncheck ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`uncheck-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Uncheck failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Hover over an element
   * @param locator Element locator or selector
   */
  async hover(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Hover over: ${selector}`, async () => {
      try {
        logger.logAction('Hover', selector);
        const element = this.resolveLocator(locator);
        // Wait for element to be visible
        await element.waitFor({ state: 'visible', timeout: 10000 });
        await element.hover();
        logger.info(`Hovered over element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to hover over ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`hover-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Hover failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Focus on an element
   * @param locator Element locator or selector
   */
  async focus(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Focus on: ${selector}`, async () => {
      try {
        logger.logAction('Focus', selector);
        const element = this.resolveLocator(locator);
        // Wait for element to be visible and attached
        await element.waitFor({ state: 'visible', timeout: 10000 });
        await element.focus();
        logger.info(`Focused on element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to focus on ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`focus-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Focus failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Remove focus from an element
   * @param locator Element locator or selector
   */
  async blur(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Blur: ${selector}`, async () => {
      try {
        logger.logAction('Blur', selector);
        const element = this.resolveLocator(locator);
        await element.blur();
        logger.info(`Blurred element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to blur ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`blur-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Blur failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Drag and drop an element
   * @param source Source element
   * @param target Target element
   */
  async dragAndDrop(
    source: Locator | string,
    target: Locator | string
  ): Promise<void> {
    const sourceSelector = typeof source === 'string' ? source : 'source';
    const targetSelector = typeof target === 'string' ? target : 'target';
    await test.step(`Drag ${sourceSelector} to ${targetSelector}`, async () => {
      try {
        logger.logAction(`Drag and drop from ${sourceSelector} to ${targetSelector}`);
        const sourceElement = this.resolveLocator(source);
        const targetElement = this.resolveLocator(target);
        
        await WaitHelper.retryWithBackoff(async () => {
          // Wait for source element to be visible and enabled
          await sourceElement.waitFor({ state: 'visible', timeout: 10000 });
          await WaitHelper.waitForCondition(async () => {
            return await sourceElement.isEnabled();
          }, 5000, 200);
          
          // Wait for target element to be visible
          await targetElement.waitFor({ state: 'visible', timeout: 10000 });
          
          await sourceElement.dragTo(targetElement);
        }, 2, 500);
        
        logger.info(`Dragged element from ${sourceSelector} to ${targetSelector}`);
      } catch (error) {
        logger.error(`Failed to drag and drop: ${(error as Error).message}`);
        await this.takeScreenshot(`drag-drop-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Drag and drop failed: ${(error as Error).message}`
        );
      }
    });
  }

  // ==================== SCROLL METHODS ====================

  /**
   * Scroll element into view
   * @param locator Element locator or selector
   */
  async scrollIntoView(locator: Locator | string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Scroll ${selector} into view`, async () => {
      try {
        logger.logAction('Scroll into view', selector);
        const element = this.resolveLocator(locator);
        await element.scrollIntoViewIfNeeded();
        logger.info(`Scrolled element into view: ${selector}`);
      } catch (error) {
        logger.error(`Failed to scroll ${selector} into view: ${(error as Error).message}`);
        await this.takeScreenshot(`scrollintoview-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Scroll into view failed for ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Scroll page by offsets
   * @param xOffset Horizontal offset
   * @param yOffset Vertical offset
   */
  async scrollBy(xOffset: number, yOffset: number): Promise<void> {
    await test.step(`Scroll page by x:${xOffset}, y:${yOffset}`, async () => {
      try {
        logger.logAction('Scroll by offset', `x:${xOffset}, y:${yOffset}`);
        await this.page.evaluate(
          ([x, y]) => {
            window.scrollBy(x, y);
          },
          [xOffset, yOffset]
        );
        logger.info(`Scrolled page by x:${xOffset}, y:${yOffset}`);
      } catch (error) {
        logger.error(`Failed to scroll by offsets: ${(error as Error).message}`);
        await this.takeScreenshot(`scrollby-error-${this.getTimestamp()}`);
        throw new Error(`Scroll by failed: ${(error as Error).message}`);
      }
    });
  }

  // ==================== UPLOAD/DOWNLOAD METHODS ====================

  /**
   * Upload a file
   * @param locator File input locator
   * @param filePath Path to file to upload
   */
  async uploadFile(locator: Locator | string, filePath: string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Upload file to: ${selector}`, async () => {
      try {
        logger.logAction(`Upload file: ${filePath}`, selector);
        const element = this.resolveLocator(locator);
        await WaitHelper.retryWithBackoff(async () => {
          // Wait for element to be visible and attached
          await element.waitFor({ state: 'visible', timeout: 10000 });
          await element.waitFor({ state: 'attached', timeout: 10000 });
          
          // Verify element is enabled before attempting upload
          await WaitHelper.waitForCondition(async () => {
            return await element.isEnabled();
          }, 5000, 200);
          
          await element.setInputFiles(filePath);
        }, 2, 500);
        logger.info(`Uploaded file to element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to upload file to ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`upload-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Upload failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Download a file
   * @param locator Element that triggers download
   * @returns Path to downloaded file
   */
  async downloadFile(locator: Locator | string): Promise<string> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Download file by clicking: ${selector}`, async () => {
      try {
        logger.logAction('Download file', selector);
        const element = this.resolveLocator(locator);

        return await WaitHelper.retryWithBackoff(async () => {
          await element.waitFor({ state: 'visible', timeout: 10000 });
          const [download] = await Promise.all([
            this.page.waitForEvent('download', { timeout: 30000 }),
            element.click(),
          ]);

          const downloadPath = path.join(
            'downloads',
            `${this.getTimestamp()}-${download.suggestedFilename()}`
          );
          await download.saveAs(downloadPath);
          logger.info(`Downloaded file to: ${downloadPath}`);
          return downloadPath;
        }, 2, 1000);
      } catch (error) {
        logger.error(`Failed to download file: ${(error as Error).message}`);
        await this.takeScreenshot(`download-error-${this.getTimestamp()}`);
        throw new Error(`Download failed: ${(error as Error).message}`);
      }
    });
  }

  // ==================== WAIT METHODS ====================

  /**
   * Wait for element to be in specific state
   * @param locator Element locator or selector
   * @param state State to wait for
   */
  async waitForElement(
    locator: Locator | string,
    state: 'visible' | 'hidden' | 'attached' = 'visible'
  ): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Wait for element ${selector} to be ${state}`, async () => {
      try {
        logger.logAction(`Wait for element to be ${state}`, selector);
        const element = this.resolveLocator(locator);
        const success = await WaitHelper.waitForCondition(async () => {
          try {
            await element.waitFor({ state, timeout: 2000 });
            return true;
          } catch {
            return false;
          }
        }, 30000, 500);
        
        if (!success) {
          throw new Error(`Element did not reach ${state} state within timeout`);
        }
        logger.info(`Element ${selector} is ${state}`);
      } catch (error) {
        logger.error(
          `Element ${selector} did not reach ${state} state: ${(error as Error).message}`
        );
        await this.takeScreenshot(`wait-error-${this.getTimestamp()}`);
        throw new TimeoutException(
          `Element ${selector} not ${state}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Wait for URL
   * @param url URL or RegExp to wait for
   */
  async waitForURL(url: string | RegExp): Promise<void> {
    await test.step(`Wait for URL: ${url}`, async () => {
      try {
        logger.logAction(`Wait for URL: ${url}`);
        await this.page.waitForURL(url);
        logger.info(`URL matched: ${url}`);
      } catch (error) {
        logger.error(`URL wait failed: ${(error as Error).message}`);
        throw new TimeoutException(`URL wait failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Wait for page load state
   * @param state Load state to wait for
   */
  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
  ): Promise<void> {
    await test.step(`Wait for page to reach ${state} state`, async () => {
      try {
        logger.logAction(`Wait for ${state}`);
        await this.page.waitForLoadState(state);
        logger.info(`Page reached ${state} state`);
      } catch (error) {
        logger.error(`Failed to wait for ${state}: ${(error as Error).message}`);
        throw new TimeoutException(
          `Wait for ${state} failed: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Wait for specified timeout
   * @param duration Duration in milliseconds
   */
  async waitForTimeout(duration: number): Promise<void> {
    await test.step(`Wait for ${duration}ms`, async () => {
      try {
        logger.logAction('Wait timeout', `${duration}ms`);
        await this.page.waitForTimeout(duration);
        logger.info(`Waited for ${duration}ms`);
      } catch (error) {
        logger.error(`Failed while waiting ${duration}ms: ${(error as Error).message}`);
        throw new TimeoutException(
          `Wait timeout failed: ${(error as Error).message}`
        );
      }
    });
  }

  // ==================== ASSERTION/GETTER METHODS ====================

  /**
   * Check if element is visible
   * @param locator Element locator or selector
   * @returns true if visible, false otherwise
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Check if ${selector} is visible`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const visible = await element.isVisible();
        logger.info(`Element ${selector} visibility: ${visible}`);
        return visible;
      } catch (error) {
        logger.error(`Failed to check visibility of ${selector}: ${(error as Error).message}`);
        return false;
      }
    });
  }

  /**
   * Check if element is enabled
   * @param locator Element locator or selector
   * @returns true if enabled, false otherwise
   */
  async isEnabled(locator: Locator | string): Promise<boolean> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Check if ${selector} is enabled`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const enabled = await element.isEnabled();
        logger.info(`Element ${selector} enabled: ${enabled}`);
        return enabled;
      } catch (error) {
        logger.error(`Failed to check if ${selector} is enabled: ${(error as Error).message}`);
        return false;
      }
    });
  }

  /**
   * Check if checkbox/radio is checked
   * @param locator Element locator or selector
   * @returns true if checked, false otherwise
   */
  async isChecked(locator: Locator | string): Promise<boolean> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Check if ${selector} is checked`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const checked = await element.isChecked();
        logger.info(`Element ${selector} checked: ${checked}`);
        return checked;
      } catch (error) {
        logger.error(`Failed to check if ${selector} is checked: ${(error as Error).message}`);
        return false;
      }
    });
  }

  /**
   * Get text content (innerText)
   * @param locator Element locator or selector
   * @returns Element text
   */
  async getText(locator: Locator | string): Promise<string> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get text from: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const text = await element.innerText();
        logger.info(`Got text from ${selector}: ${text}`);
        return text;
      } catch (error) {
        logger.error(`Failed to get text from ${selector}: ${(error as Error).message}`);
        throw new ElementNotFoundException(
          `Get text failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Get text content (textContent)
   * @param locator Element locator or selector
   * @returns Element text content
   */
  async getTextContent(locator: Locator | string): Promise<string | null> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get text content from: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const textContent = await element.textContent();
        logger.info(`Got text content from ${selector}: ${textContent}`);
        return textContent;
      } catch (error) {
        logger.error(`Failed to get text content from ${selector}: ${(error as Error).message}`);
        throw new ElementNotFoundException(
          `Get text content failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Get attribute value
   * @param locator Element locator or selector
   * @param name Attribute name
   * @returns Attribute value
   */
  async getAttribute(locator: Locator | string, name: string): Promise<string | null> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get attribute "${name}" from: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const value = await element.getAttribute(name);
        logger.info(`Got attribute ${name} from ${selector}: ${value}`);
        return value;
      } catch (error) {
        logger.error(
          `Failed to get attribute ${name} from ${selector}: ${(error as Error).message}`
        );
        throw new ElementNotFoundException(
          `Get attribute failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Get current input value
   * @param locator Element locator or selector
   * @returns Input value string
   */
  async getInputValue(locator: Locator | string): Promise<string> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get input value from: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const value = await element.inputValue();
        logger.info(`Got input value from ${selector}: ${value}`);
        return value;
      } catch (error) {
        logger.error(`Failed to get input value from ${selector}: ${(error as Error).message}`);
        throw new ElementNotFoundException(
          `Get input value failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Get element count
   * @param locator Element locator or selector
   * @returns Number of matching elements
   */
  async getElementCount(locator: Locator | string): Promise<number> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get element count for: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const count = await element.count();
        logger.info(`Element count for ${selector}: ${count}`);
        return count;
      } catch (error) {
        logger.error(`Failed to get element count for ${selector}: ${(error as Error).message}`);
        return 0;
      }
    });
  }

  // ==================== SCREENSHOT METHODS ====================

  /**
   * Take page screenshot
   * @param name Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await test.step(`Take screenshot: ${name}`, async () => {
      try {
        const screenshotPath = path.join(
          this.screenshotDir,
          `${name}-${this.getTimestamp()}.png`
        );
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        logger.info(`Screenshot saved: ${screenshotPath}`);
      } catch (error) {
        logger.error(`Failed to take screenshot: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Take element screenshot
   * @param locator Element locator or selector
   * @param name Screenshot name
   */
  async takeElementScreenshot(locator: Locator | string, name: string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Take element screenshot: ${name}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        const screenshotPath = path.join(
          this.screenshotDir,
          `${name}-${this.getTimestamp()}.png`
        );
        await element.screenshot({ path: screenshotPath });
        logger.info(`Element screenshot saved: ${screenshotPath}`);
      } catch (error) {
        logger.error(
          `Failed to take element screenshot for ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  // ==================== JAVASCRIPT EXECUTION ====================

  /**
   * Execute JavaScript in the page context
   * @param script JavaScript code to execute
   * @param args Arguments to pass to the script
   * @returns Script execution result
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await test.step('Execute JavaScript', async () => {
      try {
        logger.logAction('Execute script', script);
        const result = await this.page.evaluate(script, ...args);
        logger.info('Script executed successfully');
        return result;
      } catch (error) {
        logger.error(`Failed to execute script: ${(error as Error).message}`);
        throw new Error(`Script execution failed: ${(error as Error).message}`);
      }
    });
  }

  // ==================== FRAME/WINDOW METHODS ====================

  /**
   * Switch to iframe
   * @param frameLocator Frame locator or selector
   */
  async switchToFrame(frameLocator: Locator | string): Promise<void> {
    const selector = typeof frameLocator === 'string' ? frameLocator : 'frame';
    await test.step(`Switch to frame: ${selector}`, async () => {
      try {
        logger.logAction('Switch to frame', selector);
        // Frame switching is handled through frameLocator in Playwright
        logger.info(`Switched to frame: ${selector}`);
      } catch (error) {
        logger.error(`Failed to switch to frame ${selector}: ${(error as Error).message}`);
        throw new Error(`Frame switch failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Switch to window by index
   * @param index Window index
   */
  async switchToWindow(index: number): Promise<void> {
    await test.step(`Switch to window: ${index}`, async () => {
      try {
        logger.logAction(`Switch to window ${index}`);
        const pages = this.page.context().pages();
        if (index < pages.length) {
          await pages[index].bringToFront();
          logger.info(`Switched to window index: ${index}`);
        } else {
          throw new Error(`Window index ${index} out of bounds`);
        }
      } catch (error) {
        logger.error(`Failed to switch to window ${index}: ${(error as Error).message}`);
        throw new Error(`Window switch failed: ${(error as Error).message}`);
      }
    });
  }

  // ==================== KEYBOARD/MOUSE METHODS ====================

  /**
   * Press keyboard key
   * @param key Key to press
   */
  async pressKey(key: string): Promise<void> {
    await test.step(`Press key: ${key}`, async () => {
      try {
        logger.logAction(`Press key: ${key}`);
        await this.page.keyboard.press(key);
        logger.info(`Pressed key: ${key}`);
      } catch (error) {
        logger.error(`Failed to press key ${key}: ${(error as Error).message}`);
        throw new Error(`Key press failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Type text with delay
   * @param locator Element locator or selector
   * @param text Text to type
   * @param delay Delay between keystrokes in ms
   */
  async type(locator: Locator | string, text: string, delay: number = 50): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Type "${text}" into: ${selector}`, async () => {
      try {
        logger.logAction(`Type text: ${text}`, selector);
        const element = this.resolveLocator(locator);
        await WaitHelper.retryWithBackoff(async () => {
          await element.waitFor({ state: 'visible', timeout: 10000 });
          await WaitHelper.waitForCondition(async () => {
            return await element.isEnabled();
          }, 5000, 200);
          await element.pressSequentially(text, { delay });
        }, 2, 500);
        logger.info(`Typed text into element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to type in ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`type-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Type failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  // ==================== ENHANCEMENTS: ADVANCED ELEMENT INTERACTIONS ====================

  /**
   * Click at exact page coordinates
   */
  async clickWithCoordinates(x: number, y: number): Promise<void> {
    await test.step(`Click with coordinates x:${x}, y:${y}`, async () => {
      try {
        logger.logAction('Click with coordinates', `x:${x}, y:${y}`);
        await this.page.mouse.click(x, y);
        logger.info(`Clicked at coordinates x:${x}, y:${y}`);
      } catch (error) {
        logger.error(`Failed to click at coordinates: ${(error as Error).message}`);
        await this.takeScreenshot(`click-coordinates-error-${this.getTimestamp()}`);
        throw new Error(`Click with coordinates failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Click an element multiple times
   */
  async multiClick(locator: Locator | string, count: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Multi click (${count}x) on: ${selector}`, async () => {
      try {
        logger.logAction(`Multi click (${count}x)`, selector);
        const element = this.resolveLocator(locator);

        await WaitHelper.retryWithBackoff(async () => {
          await element.waitFor({ state: 'visible', timeout: 10000 });
          for (let i = 0; i < count; i++) {
            await element.click();
          }
        }, 2, 500);

        logger.info(`Multi clicked (${count}x) on element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to multi click on ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`multiclick-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Multi click failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Click an element with a modifier key pressed (Ctrl/Shift/Alt/etc.)
   */
  async clickWithModifier(
    locator: Locator | string,
    modifier: ModifierKey,
    options?: ClickOptions
  ): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Click on ${selector} with modifier: ${modifier}`, async () => {
      try {
        logger.logAction('Click with modifier', `${selector} + ${modifier}`);
        const element = this.resolveLocator(locator);

        await WaitHelper.retryWithBackoff(async () => {
          await element.waitFor({ state: 'visible', timeout: 10000 });
          await element.click({ ...options, modifiers: [modifier] });
        }, 2, 500);

        logger.info(`Clicked on element ${selector} with modifier ${modifier}`);
      } catch (error) {
        logger.error(
          `Failed to click with modifier on ${selector}: ${(error as Error).message}`
        );
        await this.takeScreenshot(`click-modifier-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Click with modifier failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Swipe/flick on an element using mouse drag (works best on touch-like UIs in desktop context)
   */
  async swipe(
    locator: Locator | string,
    direction: SwipeDirection,
    distance: number = 200
  ): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Swipe ${direction} on: ${selector} (distance: ${distance})`, async () => {
      try {
        logger.logAction('Swipe', `${selector} ${direction} ${distance}`);
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'visible', timeout: 10000 });

        const box = await element.boundingBox();
        if (!box) throw new Error('Element bounding box not available');

        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        let endX = startX;
        let endY = startY;

        switch (direction) {
          case 'left':
            endX = startX - distance;
            break;
          case 'right':
            endX = startX + distance;
            break;
          case 'up':
            endY = startY - distance;
            break;
          case 'down':
            endY = startY + distance;
            break;
        }

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, endY, { steps: 10 });
        await this.page.mouse.up();

        logger.info(`Swiped ${direction} on ${selector}`);
      } catch (error) {
        logger.error(`Failed to swipe on ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`swipe-error-${this.getTimestamp()}`);
        throw new Error(`Swipe failed on ${selector}: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Run a keyboard shortcut like 'Control+A', 'ControlOrMeta+S', etc.
   */
  async keyboardShortcut(keys: string): Promise<void> {
    await test.step(`Keyboard shortcut: ${keys}`, async () => {
      try {
        logger.logAction('Keyboard shortcut', keys);
        await this.page.keyboard.press(keys);
        logger.info(`Executed keyboard shortcut: ${keys}`);
      } catch (error) {
        logger.error(`Failed to execute keyboard shortcut ${keys}: ${(error as Error).message}`);
        throw new Error(`Keyboard shortcut failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Type and optionally pause afterwards
   */
  async typeWithPause(
    locator: Locator | string,
    text: string,
    pauseAfterMs: number = 0,
    delayMs: number = 50
  ): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Type with pause into: ${selector}`, async () => {
      await this.type(locator, text, delayMs);
      if (pauseAfterMs > 0) {
        logger.info(`Pausing for ${pauseAfterMs}ms after typing into ${selector}`);
        await this.page.waitForTimeout(pauseAfterMs);
      }
    });
  }

  // ==================== ENHANCEMENTS: FORM & INPUT ====================

  /**
   * Clear an input and fill a value
   */
  async clearAndFill(locator: Locator | string, text: string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Clear and fill "${text}" into: ${selector}`, async () => {
      await this.clear(locator);
      await this.fill(locator, text);
    });
  }

  /**
   * Fill multiple fields (locators + values) in one call
   */
  async fillForm(fields: FillFormField[]): Promise<void> {
    await test.step(`Fill form with ${fields.length} field(s)`, async () => {
      try {
        logger.logAction('Fill form', `${fields.length} fields`);
        for (const field of fields) {
          const element = this.resolveLocator(field.locator);
          const mode = field.mode ?? 'fill';

          if (mode === 'type') {
            const delay = field.delayMs ?? 50;
            await element.waitFor({ state: 'visible', timeout: 10000 });
            await element.pressSequentially(field.value, { delay });
          } else {
            await this.fill(field.locator, field.value);
          }
        }
        logger.info('Form filled successfully');
      } catch (error) {
        logger.error(`Failed to fill form: ${(error as Error).message}`);
        await this.takeScreenshot(`fillform-error-${this.getTimestamp()}`);
        throw new Error(`Fill form failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Extract all input/select/textarea values from a form element
   */
  async getFormData(formLocator: Locator | string): Promise<Record<string, string>> {
    const selector = typeof formLocator === 'string' ? formLocator : 'form';
    return await test.step(`Get form data from: ${selector}`, async () => {
      try {
        logger.logAction('Get form data', selector);
        const form = this.resolveLocator(formLocator);

        const data = await form.evaluate((root) => {
          const values: Record<string, string> = {};
          const elements = root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            'input, select, textarea'
          );

          for (const el of Array.from(elements)) {
            const name = el.getAttribute('name') || el.getAttribute('id') || el.getAttribute('data-testid');
            if (!name) continue;

            if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
              values[name] = String(el.checked);
            } else {
              values[name] = (el as any).value ?? '';
            }
          }
          return values;
        });

        logger.info(`Extracted form data keys: ${Object.keys(data).join(', ')}`);
        return data;
      } catch (error) {
        logger.error(`Failed to get form data from ${selector}: ${(error as Error).message}`);
        throw new Error(`Get form data failed: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Select option(s) by visible label
   */
  async selectByLabel(locator: Locator | string, label: string | string[]): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Select by label "${label}" in: ${selector}`, async () => {
      try {
        logger.logAction('Select by label', `${selector} -> ${label}`);
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'visible', timeout: 10000 });

        const labels = Array.isArray(label) ? label : [label];
        await element.selectOption(labels.map((l) => ({ label: l })));

        logger.info(`Selected by label in element: ${selector}`);
      } catch (error) {
        logger.error(`Failed to select by label in ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`selectbylabel-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Select by label failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Select option(s) by value
   */
  async selectByValue(locator: Locator | string, value: string | string[]): Promise<void> {
    await this.selectOption(locator, value);
  }

  /**
   * Handle date picker by filling an <input type="date"> or similar date input
   * Date format depends on the control (often YYYY-MM-DD).
   */
  async handleDatePicker(locator: Locator | string, date: string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Handle date picker "${date}" in: ${selector}`, async () => {
      try {
        logger.logAction('Handle date picker', `${selector} -> ${date}`);
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'visible', timeout: 10000 });
        await element.fill(date);
        logger.info(`Date set in ${selector}: ${date}`);
      } catch (error) {
        logger.error(`Failed to handle date picker in ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`datepicker-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Date picker failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  /**
   * Handle time picker by filling an <input type="time"> or similar time input
   */
  async handleTimePicker(locator: Locator | string, time: string): Promise<void> {
    const selector = typeof locator === 'string' ? locator : 'element';
    await test.step(`Handle time picker "${time}" in: ${selector}`, async () => {
      try {
        logger.logAction('Handle time picker', `${selector} -> ${time}`);
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'visible', timeout: 10000 });
        await element.fill(time);
        logger.info(`Time set in ${selector}: ${time}`);
      } catch (error) {
        logger.error(`Failed to handle time picker in ${selector}: ${(error as Error).message}`);
        await this.takeScreenshot(`timepicker-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Time picker failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  // ==================== ENHANCEMENTS: DOM & ELEMENT UTILITIES ====================

  async getComputedStyle(locator: Locator | string, property: string): Promise<string> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get computed style "${property}" from: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'attached', timeout: 10000 });
        const value = await element.evaluate(
          (el, prop) => window.getComputedStyle(el as Element).getPropertyValue(prop as string),
          property
        );
        logger.info(`Computed style ${property} for ${selector}: ${value}`);
        return value;
      } catch (error) {
        logger.error(`Failed to get computed style for ${selector}: ${(error as Error).message}`);
        throw new ElementNotFoundException(
          `Get computed style failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  async getElementBoundingBox(
    locator: Locator | string
  ): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get bounding box for: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'attached', timeout: 10000 });
        const box = await element.boundingBox();
        logger.info(`Bounding box for ${selector}: ${JSON.stringify(box)}`);
        return box;
      } catch (error) {
        logger.error(`Failed to get bounding box for ${selector}: ${(error as Error).message}`);
        return null;
      }
    });
  }

  async getParentElement(locator: Locator | string): Promise<Locator> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get parent element of: ${selector}`, async () => {
      const element = this.resolveLocator(locator);
      return element.locator('xpath=..');
    });
  }

  async getSiblingElements(locator: Locator | string): Promise<Locator> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get sibling elements of: ${selector}`, async () => {
      const element = this.resolveLocator(locator);
      return element.locator('xpath=../*');
    });
  }

  async getChildElements(locator: Locator | string): Promise<Locator> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get child elements of: ${selector}`, async () => {
      const element = this.resolveLocator(locator);
      return element.locator(':scope > *');
    });
  }

  async isElementInViewport(locator: Locator | string): Promise<boolean> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Check if ${selector} is in viewport`, async () => {
      try {
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'attached', timeout: 10000 });
        const inViewport = await element.evaluate((el) => {
          const r = (el as Element).getBoundingClientRect();
          return (
            r.top >= 0 &&
            r.left >= 0 &&
            r.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            r.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        });
        logger.info(`Element ${selector} in viewport: ${inViewport}`);
        return inViewport;
      } catch (error) {
        logger.error(`Failed viewport check for ${selector}: ${(error as Error).message}`);
        return false;
      }
    });
  }

  async getElementTagName(locator: Locator | string): Promise<string> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get tag name for: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'attached', timeout: 10000 });
        const tagName = await element.evaluate((el) => (el as Element).tagName.toLowerCase());
        logger.info(`Tag name for ${selector}: ${tagName}`);
        return tagName;
      } catch (error) {
        logger.error(`Failed to get tag name for ${selector}: ${(error as Error).message}`);
        throw new ElementNotFoundException(
          `Get tag name failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  async hasClass(locator: Locator | string, className: string): Promise<boolean> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Check if ${selector} has class "${className}"`, async () => {
      try {
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'attached', timeout: 10000 });
        const has = await element.evaluate((el, cls) => (el as Element).classList.contains(cls as string), className);
        logger.info(`Element ${selector} has class "${className}": ${has}`);
        return has;
      } catch (error) {
        logger.error(`Failed class check for ${selector}: ${(error as Error).message}`);
        return false;
      }
    });
  }

  async getAllAttributes(locator: Locator | string): Promise<Record<string, string>> {
    const selector = typeof locator === 'string' ? locator : 'element';
    return await test.step(`Get all attributes for: ${selector}`, async () => {
      try {
        const element = this.resolveLocator(locator);
        await element.waitFor({ state: 'attached', timeout: 10000 });
        const attrs = await element.evaluate((el) => {
          const out: Record<string, string> = {};
          for (const attr of Array.from((el as Element).attributes)) {
            out[attr.name] = attr.value;
          }
          return out;
        });
        logger.info(`Got ${Object.keys(attrs).length} attributes for ${selector}`);
        return attrs;
      } catch (error) {
        logger.error(`Failed to get attributes for ${selector}: ${(error as Error).message}`);
        throw new ElementNotFoundException(
          `Get all attributes failed on ${selector}: ${(error as Error).message}`
        );
      }
    });
  }

  // ==================== ENHANCEMENTS: BROWSER INTERACTIONS ====================

  async handleAlert(action: 'accept' | 'dismiss' | 'getText' = 'accept'): Promise<AlertResult> {
    return await test.step(`Handle alert: ${action}`, async () => {
      let message = '';
      const handler = async (dialog: any) => {
        message = dialog.message();
        if (action === 'dismiss') await dialog.dismiss();
        else await dialog.accept();
      };

      try {
        this.page.once('dialog', handler);
        logger.logAction('Handle alert', action);
        logger.info('Alert handler attached (will trigger on next dialog)');
        return { message };
      } catch (error) {
        logger.error(`Failed to handle alert: ${(error as Error).message}`);
        throw new Error(`Handle alert failed: ${(error as Error).message}`);
      }
    });
  }

  async handlePrompt(
    action: 'accept' | 'dismiss' | 'getText' = 'accept',
    text?: string
  ): Promise<PromptResult> {
    return await test.step(`Handle prompt: ${action}`, async () => {
      let message = '';
      const handler = async (dialog: any) => {
        message = dialog.message();
        if (action === 'dismiss') {
          await dialog.dismiss();
        } else {
          await dialog.accept(text);
        }
      };

      try {
        this.page.once('dialog', handler);
        logger.logAction('Handle prompt', `${action}${text ? ` (${text})` : ''}`);
        logger.info('Prompt handler attached (will trigger on next dialog)');
        return { message };
      } catch (error) {
        logger.error(`Failed to handle prompt: ${(error as Error).message}`);
        throw new Error(`Handle prompt failed: ${(error as Error).message}`);
      }
    });
  }

  async setCookie(name: string, value: string, options: CookieOptions = {}): Promise<void> {
    await test.step(`Set cookie: ${name}`, async () => {
      try {
        logger.logAction('Set cookie', name);
        await this.page.context().addCookies([
          {
            name,
            value,
            url: options.domain ? undefined : this.page.url(),
            domain: options.domain,
            path: options.path,
            expires: options.expires,
            httpOnly: options.httpOnly,
            secure: options.secure,
            sameSite: options.sameSite,
          },
        ]);
        logger.info(`Cookie set: ${name}`);
      } catch (error) {
        logger.error(`Failed to set cookie ${name}: ${(error as Error).message}`);
        throw new Error(`Set cookie failed: ${(error as Error).message}`);
      }
    });
  }

  async getCookie(name: string): Promise<string | undefined> {
    return await test.step(`Get cookie: ${name}`, async () => {
      try {
        logger.logAction('Get cookie', name);
        const cookies = await this.page.context().cookies();
        const cookie = cookies.find((c) => c.name === name);
        logger.info(`Cookie ${name} value: ${cookie?.value}`);
        return cookie?.value;
      } catch (error) {
        logger.error(`Failed to get cookie ${name}: ${(error as Error).message}`);
        return undefined;
      }
    });
  }

  async deleteCookie(name: string): Promise<void> {
    await test.step(`Delete cookie: ${name}`, async () => {
      try {
        logger.logAction('Delete cookie', name);
        const cookies = await this.page.context().cookies();
        const target = cookies.find((c) => c.name === name);
        if (!target) return;

        await this.page.context().addCookies([
          {
            name,
            value: '',
            url: target.domain ? undefined : this.page.url(),
            domain: target.domain || undefined,
            path: target.path || '/',
            expires: 0,
          },
        ]);

        logger.info(`Cookie deleted: ${name}`);
      } catch (error) {
        logger.error(`Failed to delete cookie ${name}: ${(error as Error).message}`);
        throw new Error(`Delete cookie failed: ${(error as Error).message}`);
      }
    });
  }

  async getAllCookies(): Promise<Array<{ name: string; value: string }>> {
    return await test.step('Get all cookies', async () => {
      try {
        logger.logAction('Get all cookies');
        const cookies = await this.page.context().cookies();
        logger.info(`Got ${cookies.length} cookies`);
        return cookies.map((c) => ({ name: c.name, value: c.value }));
      } catch (error) {
        logger.error(`Failed to get all cookies: ${(error as Error).message}`);
        return [];
      }
    });
  }

  async setLocalStorage(key: string, value: string): Promise<void> {
    await test.step(`Set localStorage: ${key}`, async () => {
      try {
        logger.logAction('Set localStorage', key);
        await this.page.evaluate(
          ([k, v]) => {
            window.localStorage.setItem(k, v);
          },
          [key, value]
        );
        logger.info(`localStorage set: ${key}`);
      } catch (error) {
        logger.error(`Failed to set localStorage ${key}: ${(error as Error).message}`);
        throw new Error(`Set localStorage failed: ${(error as Error).message}`);
      }
    });
  }

  async getLocalStorage(key: string): Promise<string | null> {
    return await test.step(`Get localStorage: ${key}`, async () => {
      try {
        logger.logAction('Get localStorage', key);
        const value = await this.page.evaluate((k) => window.localStorage.getItem(k), key);
        logger.info(`localStorage ${key} value: ${value}`);
        return value;
      } catch (error) {
        logger.error(`Failed to get localStorage ${key}: ${(error as Error).message}`);
        return null;
      }
    });
  }

  async setSessionStorage(key: string, value: string): Promise<void> {
    await test.step(`Set sessionStorage: ${key}`, async () => {
      try {
        logger.logAction('Set sessionStorage', key);
        await this.page.evaluate(
          ([k, v]) => {
            window.sessionStorage.setItem(k, v);
          },
          [key, value]
        );
        logger.info(`sessionStorage set: ${key}`);
      } catch (error) {
        logger.error(`Failed to set sessionStorage ${key}: ${(error as Error).message}`);
        throw new Error(`Set sessionStorage failed: ${(error as Error).message}`);
      }
    });
  }

  async getSessionStorage(key: string): Promise<string | null> {
    return await test.step(`Get sessionStorage: ${key}`, async () => {
      try {
        logger.logAction('Get sessionStorage', key);
        const value = await this.page.evaluate((k) => window.sessionStorage.getItem(k), key);
        logger.info(`sessionStorage ${key} value: ${value}`);
        return value;
      } catch (error) {
        logger.error(`Failed to get sessionStorage ${key}: ${(error as Error).message}`);
        return null;
      }
    });
  }

  async clearStorage(): Promise<void> {
    await test.step('Clear storage', async () => {
      try {
        logger.logAction('Clear storage');
        await this.page.evaluate(() => {
          window.localStorage.clear();
          window.sessionStorage.clear();
        });
        logger.info('Storage cleared');
      } catch (error) {
        logger.error(`Failed to clear storage: ${(error as Error).message}`);
        throw new Error(`Clear storage failed: ${(error as Error).message}`);
      }
    });
  }

  async getPageTitle(): Promise<string> {
    return await test.step('Get page title', async () => {
      try {
        const title = await this.page.title();
        logger.info(`Page title: ${title}`);
        return title;
      } catch (error) {
        logger.error(`Failed to get page title: ${(error as Error).message}`);
        throw new Error(`Get page title failed: ${(error as Error).message}`);
      }
    });
  }

  async getCurrentURL(): Promise<string> {
    return await test.step('Get current URL', async () => {
      try {
        const url = this.page.url();
        logger.info(`Current URL: ${url}`);
        return url;
      } catch (error) {
        logger.error(`Failed to get current URL: ${(error as Error).message}`);
        throw new Error(`Get current URL failed: ${(error as Error).message}`);
      }
    });
  }

  // ==================== ENHANCEMENTS: SHADOW DOM & COMPLEX SELECTORS ====================

  /**
   * Find an element inside a shadow root
   */
  async findInShadowDOM(shadowHost: Locator | string, selector: string): Promise<Locator> {
    const hostName = typeof shadowHost === 'string' ? shadowHost : 'shadowHost';
    return await test.step(`Find in shadow DOM: ${hostName} -> ${selector}`, async () => {
      const host = this.resolveLocator(shadowHost);
      return host.locator(`css=:scope >> shadow=${selector}`);
    });
  }

  async clickInShadowDOM(shadowHost: Locator | string, selector: string): Promise<void> {
    const hostName = typeof shadowHost === 'string' ? shadowHost : 'shadowHost';
    await test.step(`Click in shadow DOM: ${hostName} -> ${selector}`, async () => {
      try {
        const el = await this.findInShadowDOM(shadowHost, selector);
        await el.click();
        logger.info(`Clicked in shadow DOM: ${selector}`);
      } catch (error) {
        logger.error(`Failed to click in shadow DOM: ${(error as Error).message}`);
        await this.takeScreenshot(`shadowdom-click-error-${this.getTimestamp()}`);
        throw new ElementNotFoundException(
          `Click in shadow DOM failed: ${(error as Error).message}`
        );
      }
    });
  }

  async getShadowDOMElement(shadowHost: Locator | string, selector: string): Promise<Locator> {
    return await this.findInShadowDOM(shadowHost, selector);
  }

  /**
   * Traverse to element by chaining locators (selectors array).
   * This is useful for deeply nested DOMs (not shadow DOM).
   */
  async traverseToElement(pathSelectors: Array<string>): Promise<Locator> {
    return await test.step(`Traverse to element: ${pathSelectors.join(' -> ')}`, async () => {
      if (pathSelectors.length === 0) throw new Error('pathSelectors cannot be empty');

      let current: Locator = this.page.locator(pathSelectors[0]);
      for (let i = 1; i < pathSelectors.length; i++) {
        current = current.locator(pathSelectors[i]);
      }
      return current;
    });
  }

  async findByXPath(xpath: string): Promise<Locator> {
    return await test.step(`Find by XPath: ${xpath}`, async () => {
      return this.page.locator(`xpath=${xpath}`);
    });
  }

  async findByTestId(testId: string): Promise<Locator> {
    return await test.step(`Find by test id: ${testId}`, async () => {
      return this.page.getByTestId(testId);
    });
  }

  async getAllElementsMatching(
    selector: string
  ): Promise<Array<{ index: number; text: string | null; visible: boolean }>> {
    return await test.step(`Get all elements matching: ${selector}`, async () => {
      const loc = this.page.locator(selector);
      const count = await loc.count();
      const results: Array<{ index: number; text: string | null; visible: boolean }> = [];
      for (let i = 0; i < count; i++) {
        const nth = loc.nth(i);
        results.push({
          index: i,
          text: await nth.textContent(),
          visible: await nth.isVisible(),
        });
      }
      logger.info(`Matched ${count} elements for selector: ${selector}`);
      return results;
    });
  }
}
