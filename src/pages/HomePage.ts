import { Page, test } from '@playwright/test';
import { BasePage } from '../base/BasePage';

/**
 * HomePage - Page Object for Home/Dashboard functionality
 */
export class HomePage extends BasePage {
  // Locators
  private readonly welcomeMessage = 'h1.welcome';
  private readonly userProfileMenu = '#user-profile';
  private readonly logoutButton = 'button#logout';
  private readonly searchInput = 'input[type="search"]';
  private readonly navigationMenu = 'nav.main-menu';
  private readonly notificationBell = '#notifications';
  private readonly settingsIcon = '#settings';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await test.step('Navigate to home page', async () => {
      await this.navigateTo('/');
    });
  }

  /**
   * Get welcome message
   * @returns Welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await test.step('Get welcome message', async () => {
      return await this.getText(this.welcomeMessage);
    });
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    await test.step('Logout user', async () => {
      await this.click(this.userProfileMenu);
      await this.click(this.logoutButton);
    });
  }

  /**
   * Search for content
   * @param query Search query
   */
  async search(query: string): Promise<void> {
    await test.step(`Search for: ${query}`, async () => {
      await this.fill(this.searchInput, query);
      await this.pressKey('Enter');
    });
  }

  /**
   * Click notifications
   */
  async clickNotifications(): Promise<void> {
    await test.step('Click notifications', async () => {
      await this.click(this.notificationBell);
    });
  }

  /**
   * Navigate to settings
   */
  async navigateToSettings(): Promise<void> {
    await test.step('Navigate to settings', async () => {
      await this.click(this.settingsIcon);
    });
  }

  /**
   * Verify home page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await test.step('Verify home page loaded', async () => {
      await this.waitForElement(this.welcomeMessage, 'visible');
      await this.waitForElement(this.navigationMenu, 'visible');
    });
  }

  /**
   * Check if user is logged in
   * @returns true if logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.userProfileMenu);
  }
}
