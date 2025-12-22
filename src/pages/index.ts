import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';

/**
 * PageManager - Central class to manage all page objects
 * Provides easy access to all pages through a single instance
 * Simplifies imports and exports across the framework
 */
export class PageManager {
  // Page instances
  public readonly loginPage: LoginPage;
  public readonly homePage: HomePage;
  // Add more page instances here as they are created

  constructor(page: Page) {
    // Initialize all page objects
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    // Initialize additional pages here
  }
}

/**
 * Convenience export for all pages
 * Makes it easy to import specific pages if needed
 */
export { LoginPage, HomePage };
