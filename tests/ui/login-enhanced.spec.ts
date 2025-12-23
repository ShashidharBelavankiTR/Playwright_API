import { test } from '../../src/fixtures/baseFixtures';
import { assert } from '../../src/utils/Assertions';
import { config } from '../../src/config/ConfigManager';

/**
 * Enhanced Login Test Suite - Using Assertions Utility
 * Demonstrates comprehensive assertion usage with detailed logging
 */
test.describe('Enhanced Login Tests with Assertions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to base URL before each test
    await page.goto(config.getBaseUrl());
  });

  test('Should successfully login with valid credentials - Enhanced', async ({ page, pages, testData }) => {
    // Get test data
    const userData = testData.getData('testData', 'users.validUser');

    // Navigate to login page
    await pages.loginPage.goto();
    await assert.toHaveURL(page, /\/login/, 'Should navigate to login page');

    // Verify login page elements are visible
    const usernameField = page.locator('#username, #email, input[type="email"]').first();
    const passwordField = page.locator('#password, input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-button').first();

    await assert.toBeVisible(usernameField, 'Username field should be visible');
    await assert.toBeVisible(passwordField, 'Password field should be visible');
    await assert.toBeVisible(loginButton, 'Login button should be visible');
    await assert.toBeEnabled(loginButton, 'Login button should be enabled');

    // Perform login
    await pages.loginPage.login(userData.email, userData.password);

    // Verify successful navigation
    await assert.toHaveURL(page, /\/(home|dashboard)/, 'Should navigate to home/dashboard after login');

    // Verify user is logged in
    const isLoggedIn = await pages.homePage.isUserLoggedIn();
    await assert.assertTruthy(isLoggedIn, 'User should be logged in', { 
      email: userData.email 
    });
  });

  test('Should show error message with invalid credentials - Enhanced', async ({ page, pages, testData }) => {
    // Get invalid user data
    const invalidUser = testData.getData('testData', 'users.invalidUser');

    // Navigate to login page
    await pages.loginPage.goto();
    await assert.toHaveURL(page, /\/login/, 'Should be on login page');

    // Verify initial state - no error message
    const errorMessage = page.locator('.error, .alert-danger, .error-message').first();
    await assert.toHaveCount(errorMessage, 0, 'Should not show error initially');

    // Attempt login with invalid credentials
    await pages.loginPage.login(invalidUser.email, invalidUser.password);

    // Verify error message is displayed
    const errorDisplayed = await pages.loginPage.isErrorDisplayed();
    await assert.assertTruthy(errorDisplayed, 'Error message should be displayed', {
      email: invalidUser.email
    });

    // Verify still on login page
    await assert.toHaveURL(page, /\/login/, 'Should remain on login page after failed login');
  });

  test('Should validate form fields - Enhanced', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const usernameField = page.locator('#username, #email, input[type="email"]').first();
    const passwordField = page.locator('#password, input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], .login-button').first();

    // Verify fields are editable
    await assert.toBeEditable(usernameField, 'Username field should be editable');
    await assert.toBeEditable(passwordField, 'Password field should be editable');

    // Test empty form submission
    await submitButton.click();

    // Verify form validation (if implemented)
    // Check if required attribute validation works
    const usernameRequired = await usernameField.getAttribute('required');
    await assert.assertNotNull(usernameRequired, 'Username field should be required', {
      required: usernameRequired
    });
  });

  test('Should remember user when "Remember Me" is checked - Enhanced', async ({ page, pages, testData }) => {
    const userData = testData.getData('testData', 'users.validUser');

    await pages.loginPage.goto();

    const rememberMeCheckbox = page.locator('#remember, input[name="remember"]').first();
    
    // Verify checkbox is unchecked by default
    if (await rememberMeCheckbox.count() > 0) {
      await assert.toBeUnchecked(rememberMeCheckbox, 'Remember me should be unchecked by default');
      
      // Login with remember me checked
      await pages.loginPage.loginWithRememberMe(userData.email, userData.password);

      // Verify checkbox was checked
      await assert.toBeChecked(rememberMeCheckbox, 'Remember me should be checked');
    } else {
      // If checkbox doesn't exist, just login normally
      await pages.loginPage.login(userData.email, userData.password);
    }

    // Verify successful login
    await assert.toHaveURL(page, /\/(home|dashboard)/, 'Should navigate after login');
  });

  test('Should display proper page title and heading - Enhanced', async ({ page, pages }) => {
    await pages.loginPage.goto();

    // Verify page title
    await assert.toHaveTitle(page, /Login|Sign In/i, 'Page title should contain Login or Sign In');

    // Verify page heading
    const heading = page.locator('h1, h2').first();
    await assert.toBeVisible(heading, 'Page heading should be visible');
    await assert.toContainText(heading, /Login|Sign In/i, 'Heading should contain Login or Sign In');
  });

  test('Should have proper form attributes - Enhanced', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const loginForm = page.locator('form').first();
    const usernameField = page.locator('#username, #email, input[type="email"]').first();
    const passwordField = page.locator('#password, input[type="password"]').first();

    // Verify form attributes
    await assert.toBeAttached(loginForm, 'Login form should be in DOM');

    // Verify input types
    await assert.toHaveAttribute(passwordField, 'type', 'password', 'Password field should have type password');

    // Verify password field properties
    const passwordFieldValue = await passwordField.inputValue();
    await assert.assertEqual(passwordFieldValue, '', 'Password field should be empty initially');
  });
});

test.describe('Enhanced Home Page Tests with Assertions', () => {
  test.beforeEach(async ({ page, pages, testData }) => {
    // Login before each test
    const userData = testData.getData('testData', 'users.validUser');
    await pages.loginPage.goto();
    await pages.loginPage.login(userData.email, userData.password);
    await pages.homePage.verifyPageLoaded();
  });

  test('Should display welcome message - Enhanced', async ({ page, pages }) => {
    const welcomeMessage = await pages.homePage.getWelcomeMessage();
    
    await assert.assertTruthy(welcomeMessage, 'Welcome message should exist');
    await assert.assertGreaterThan(welcomeMessage.length, 0, 'Welcome message should not be empty', {
      messageLength: welcomeMessage.length
    });

    // Verify welcome element is visible
    const welcomeElement = page.locator('.welcome, .greeting, h1').first();
    await assert.toBeVisible(welcomeElement, 'Welcome element should be visible');
  });

  test('Should display user menu - Enhanced', async ({ page }) => {
    const userMenu = page.locator('.user-menu, .profile-menu, .account-menu').first();
    
    await assert.toBeVisible(userMenu, 'User menu should be visible');
    await assert.toBeEnabled(userMenu, 'User menu should be enabled');
  });

  test('Should perform search - Enhanced', async ({ page, pages, testData }) => {
    const searchTerms = testData.getData<string[]>('testData', 'searchTerms');
    const searchQuery = searchTerms[0];

    const searchInput = page.locator('input[type="search"], .search-input').first();
    
    if (await searchInput.count() > 0) {
      // Verify search input is visible and editable
      await assert.toBeVisible(searchInput, 'Search input should be visible');
      await assert.toBeEditable(searchInput, 'Search input should be editable');

      // Perform search
      await pages.homePage.search(searchQuery);

      // Verify search was performed
      await assert.toHaveValue(searchInput, searchQuery, 'Search input should contain search query');
    }
  });

  test('Should logout successfully - Enhanced', async ({ page, pages }) => {
    // Verify user is logged in first
    const isLoggedIn = await pages.homePage.isUserLoggedIn();
    await assert.assertTruthy(isLoggedIn, 'User should be logged in before logout');

    // Perform logout
    await pages.homePage.logout();

    // Verify redirect to login page
    await assert.toHaveURL(page, /\/login/, 'Should redirect to login page after logout');
    await pages.loginPage.verifyPageLoaded();

    // Verify login form is visible
    const loginForm = page.locator('form, .login-form').first();
    await assert.toBeVisible(loginForm, 'Login form should be visible after logout');
  });

  test('Should display page elements correctly - Enhanced', async ({ page }) => {
    // Verify multiple page elements
    const navigation = page.locator('nav, .navigation').first();
    const footer = page.locator('footer').first();
    const mainContent = page.locator('main, .content, .main-content').first();

    await assert.toBeVisible(navigation, 'Navigation should be visible');
    await assert.toBeVisible(mainContent, 'Main content should be visible');
    
    if (await footer.count() > 0) {
      await assert.toBeVisible(footer, 'Footer should be visible');
    }
  });
});

/**
 * Enhanced Data-Driven Login Tests with Assertions
 */
test.describe('Enhanced Data-Driven Login Tests', () => {
  const testCases = [
    { 
      email: 'user1@example.com', 
      password: 'Pass123!', 
      shouldSucceed: true,
      description: 'Valid user 1'
    },
    { 
      email: 'user2@example.com', 
      password: 'Pass456!', 
      shouldSucceed: true,
      description: 'Valid user 2'
    },
    { 
      email: 'invalid@example.com', 
      password: 'wrong', 
      shouldSucceed: false,
      description: 'Invalid credentials'
    },
    { 
      email: '', 
      password: '', 
      shouldSucceed: false,
      description: 'Empty credentials'
    },
  ];

  testCases.forEach(({ email, password, shouldSucceed, description }) => {
    test(`Login test: ${description} (${email})`, async ({ page, pages }) => {
      await pages.loginPage.goto();
      await assert.toHaveURL(page, /\/login/, 'Should be on login page');

      await pages.loginPage.login(email, password);

      if (shouldSucceed) {
        // Verify successful login
        await assert.toHaveURL(page, /\/(home|dashboard)/, 'Should navigate to home after successful login');
        
        const isLoggedIn = await pages.homePage.isUserLoggedIn();
        await assert.assertTruthy(isLoggedIn, 'User should be logged in', { 
          email,
          description 
        });
      } else {
        // Verify login failure
        await assert.toHaveURL(page, /\/login/, 'Should remain on login page after failed login');
        
        const errorDisplayed = await pages.loginPage.isErrorDisplayed();
        await assert.assertTruthy(errorDisplayed, 'Error should be displayed for invalid credentials', {
          email,
          description
        });
      }
    });
  });
});

/**
 * Enhanced Accessibility Tests
 */
test.describe('Enhanced Accessibility Tests', () => {
  test('Login form should have proper ARIA labels', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const usernameField = page.locator('#username, #email, input[type="email"]').first();
    const passwordField = page.locator('#password, input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Check for labels or aria-labels
    const usernameLabel = await usernameField.getAttribute('aria-label') || 
                          await usernameField.getAttribute('placeholder');
    await assert.assertDefined(usernameLabel, 'Username field should have label or placeholder', {
      label: usernameLabel
    });

    const passwordLabel = await passwordField.getAttribute('aria-label') || 
                          await passwordField.getAttribute('placeholder');
    await assert.assertDefined(passwordLabel, 'Password field should have label or placeholder', {
      label: passwordLabel
    });

    // Verify button has accessible text
    const buttonText = await submitButton.textContent();
    await assert.assertDefined(buttonText, 'Submit button should have text');
    await assert.assertGreaterThan(buttonText?.length || 0, 0, 'Button text should not be empty');
  });
});
