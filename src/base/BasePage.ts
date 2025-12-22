import { Page, Locator, test, Download } from '@playwright/test';
import { logger } from '../utils/Logger';
import {
  ClickOptions,
  ElementNotFoundException,
  TimeoutException,
} from '../types';
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
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
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
        await element.click(options);
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
        await element.dblclick();
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
        await element.fill(text);
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
        await element.selectOption(value);
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
        await sourceElement.dragTo(targetElement);
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
        await element.setInputFiles(filePath);
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

        const [download] = await Promise.all([
          this.page.waitForEvent('download'),
          element.click(),
        ]);

        const downloadPath = path.join(
          'downloads',
          `${this.getTimestamp()}-${download.suggestedFilename()}`
        );
        await download.saveAs(downloadPath);
        logger.info(`Downloaded file to: ${downloadPath}`);
        return downloadPath;
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
        await element.waitFor({ state });
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
        await element.pressSequentially(text, { delay });
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
}
