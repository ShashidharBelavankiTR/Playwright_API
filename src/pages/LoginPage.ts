import { Page, test } from '@playwright/test';
import { BasePage } from '../base/BasePage';

/**
 * LoginPage - Page Object for Login functionality
 * Demonstrates POM pattern with locators and actions
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput = '#email';
  private readonly passwordInput = '#password';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.error-message';
  private readonly rememberMeCheckbox = '#remember-me';
  private readonly forgotPasswordLink = 'a[href*="forgot-password"]';
  private readonly signUpLink = 'a[href*="signup"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await test.step('Navigate to login page', async () => {
      await this.navigateTo('/login');
    });
  }

  /**
   * Perform login action
   * @param email User email
   * @param password User password
   */
  async login(email: string, password: string): Promise<void> {
    await test.step(`Login with email: ${email}`, async () => {
      await this.fill(this.emailInput, email);
      await this.fill(this.passwordInput, password);
      await this.click(this.loginButton);
      await this.waitForLoadState('networkidle');
    });
  }

  /**
   * Login with remember me option
   * @param email User email
   * @param password User password
   */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await test.step('Login with remember me', async () => {
      await this.fill(this.emailInput, email);
      await this.fill(this.passwordInput, password);
      await this.check(this.rememberMeCheckbox);
      await this.click(this.loginButton);
    });
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await test.step('Click forgot password', async () => {
      await this.click(this.forgotPasswordLink);
    });
  }

  /**
   * Click sign up link
   */
  async clickSignUp(): Promise<void> {
    await test.step('Click sign up', async () => {
      await this.click(this.signUpLink);
    });
  }

  /**
   * Get error message text
   * @returns Error message
   */
  async getErrorMessage(): Promise<string> {
    return await test.step('Get error message', async () => {
      return await this.getText(this.errorMessage);
    });
  }

  /**
   * Verify login page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await test.step('Verify login page loaded', async () => {
      await this.waitForElement(this.loginButton, 'visible');
      await this.waitForElement(this.emailInput, 'visible');
    });
  }

  /**
   * Check if error message is displayed
   * @returns true if error is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
