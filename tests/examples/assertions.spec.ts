import { test } from '../../src/fixtures/baseFixtures';
import { assert } from '../../src/utils/Assertions';
import { config } from '../../src/config/ConfigManager';

/**
 * Example Test Suite - Demonstrating Assertions Utility Usage
 * Shows comprehensive examples of all assertion methods with detailed logging
 */
test.describe('Assertions Utility Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(config.getBaseUrl());
  });

  test('Example: Element Visibility Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    // Assert element is visible
    const usernameField = page.locator('#username');
    await assert.toBeVisible(usernameField, 'Username field should be visible');

    // Assert element is hidden
    const errorMessage = page.locator('.error-message');
    await assert.toBeHidden(errorMessage, 'Error message should be hidden initially');

    // Assert element is attached to DOM
    await assert.toBeAttached(usernameField, 'Username field should be in DOM');
  });

  test('Example: Element State Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const loginButton = page.locator('button[type="submit"]');
    const usernameInput = page.locator('#username');

    // Assert element is enabled
    await assert.toBeEnabled(loginButton, 'Login button should be enabled');

    // Assert element is editable
    await assert.toBeEditable(usernameInput, 'Username input should be editable');

    // Example with checkbox
    const rememberMeCheckbox = page.locator('#remember-me');
    await assert.toBeUnchecked(rememberMeCheckbox, 'Remember me should be unchecked by default');

    // Click checkbox and verify
    await rememberMeCheckbox.click();
    await assert.toBeChecked(rememberMeCheckbox, 'Remember me should be checked after click');
  });

  test('Example: Text Content Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const pageTitle = page.locator('h1');

    // Assert element contains text
    await assert.toContainText(pageTitle, 'Login', 'Page title should contain Login');

    // Assert element has exact text
    await assert.toHaveText(pageTitle, 'Login to Your Account', 'Page title should have exact text');

    // Assert with regex
    await assert.toContainText(pageTitle, /login/i, 'Page title should match login pattern');
  });

  test('Example: Attribute Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const usernameInput = page.locator('#username');

    // Assert element has attribute with specific value
    await assert.toHaveAttribute(usernameInput, 'type', 'text', 'Username should be text input');
    await assert.toHaveAttribute(usernameInput, 'placeholder', 'Enter your username', 'Should have placeholder');

    // Assert element has specific class
    await assert.toHaveClass(usernameInput, 'form-control', 'Should have form-control class');

    // Assert element has specific ID
    await assert.toHaveId(usernameInput, 'username', 'Should have username ID');
  });

  test('Example: Value Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const usernameInput = page.locator('#username');
    const emailInput = page.locator('#email');

    // Fill input and verify value
    await usernameInput.fill('testuser');
    await assert.toHaveValue(usernameInput, 'testuser', 'Username should be set correctly');

    // Verify empty value
    await assert.toHaveValue(emailInput, '', 'Email should be empty initially');

    // Example with regex
    await emailInput.fill('test@example.com');
    await assert.toHaveValue(emailInput, /@example\.com$/, 'Email should match domain pattern');
  });

  test('Example: Count Assertions', async ({ page }) => {
    await page.goto('/products'); // Example products page

    const productCards = page.locator('.product-card');

    // Assert element count
    await assert.toHaveCount(productCards, 12, 'Should display 12 products');

    // Assert no elements
    const noResults = page.locator('.no-results');
    await assert.toHaveCount(noResults, 0, 'Should not show no-results message');
  });

  test('Example: URL and Title Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    // Assert page URL
    await assert.toHaveURL(page, /\/login/, 'Should be on login page');

    // Assert page title
    await assert.toHaveTitle(page, /Login/, 'Page title should contain Login');

    // Navigate and verify
    await pages.homePage.goto();
    await assert.toHaveURL(page, config.getBaseUrl(), 'Should be on home page');
  });

  test('Example: API Response Assertions', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();

    // Assert status code
    await assert.toHaveStatusCode(response, 200, 'Should return 200 OK');

    // Assert response is OK
    await assert.toBeOK(response, 'Response should be successful');

    // Assert response contains data
    const expectedData = { data: [] };
    await assert.toContainResponseData(response, expectedData, 'Response should have data array');
  });

  test('Example: CSS Style Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const loginButton = page.locator('button[type="submit"]');

    // Assert CSS properties
    await assert.toHaveCSS(loginButton, 'background-color', 'rgb(0, 123, 255)', 'Button should be blue');
    await assert.toHaveCSS(loginButton, 'display', 'inline-block', 'Button should be inline-block');
  });

  test('Example: Custom Generic Assertions', async ({ page, pages, testData }) => {
    await pages.loginPage.goto();

    // Assert custom condition
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/login');
    await assert.assertCondition(isLoginPage, 'User is on login page', 'Expected to be on login page', {
      currentUrl,
    });

    // Assert equality
    const userData = testData.getData('testData', 'users.validUser');
    await assert.assertEqual(userData.email, 'test@example.com', 'User email should match', { userData });

    // Assert truthy/falsy
    await assert.assertTruthy(userData, 'User data should exist');
    await assert.assertFalsy(undefined, 'Undefined value should be falsy');

    // Assert null checks
    const nullValue = null;
    await assert.assertNull(nullValue, 'Value should be null');

    const definedValue = 'something';
    await assert.assertNotNull(definedValue, 'Value should not be null');

    // Assert undefined checks
    let undefinedValue;
    await assert.assertUndefined(undefinedValue, 'Value should be undefined');
    await assert.assertDefined(definedValue, 'Value should be defined');
  });

  test('Example: Array and Object Assertions', async ({ testData }) => {
    const userData = testData.getData('testData', 'users');

    // Assert array contains
    const userRoles = ['admin', 'user', 'moderator'];
    await assert.assertArrayContains(userRoles, 'admin', 'Roles should include admin', { userRoles });

    // Assert object has property
    await assert.assertHasProperty(userData, 'validUser', 'Users object should have validUser', { userData });

    // Assert deep equality
    const expectedUser = { name: 'Test User', role: 'admin' };
    const actualUser = { name: 'Test User', role: 'admin' };
    await assert.assertDeepEqual(actualUser, expectedUser, 'User objects should match exactly');
  });

  test('Example: String Assertions', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const pageContent = await page.textContent('body');

    // Assert string contains
    await assert.assertStringContains(
      pageContent || '',
      'Login',
      'Page should contain Login text',
      { pageContent }
    );

    // Assert string matches regex
    await assert.assertStringMatches(
      pageContent || '',
      /login.*account/i,
      'Page should match login account pattern'
    );
  });

  test('Example: Number Assertions', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();
    const users = await response.json();

    const userCount = Array.isArray(users) ? users.length : 0;

    // Assert greater than
    await assert.assertGreaterThan(userCount, 0, 'Should have at least one user', { userCount });

    // Assert less than
    await assert.assertLessThan(userCount, 1000, 'Should not exceed 1000 users', { userCount });
  });

  test('Example: Soft Assertions (Non-blocking)', async ({ page, pages }) => {
    await pages.loginPage.goto();

    const usernameField = page.locator('#username');
    const passwordField = page.locator('#password');
    const nonExistentField = page.locator('#non-existent');

    // Soft assertions won't stop test execution on failure
    await assert.softAssert(usernameField, 'toBeVisible', undefined, 'Username field visibility check');
    await assert.softAssert(passwordField, 'toBeVisible', undefined, 'Password field visibility check');

    // This will fail but won't stop the test
    await assert.softAssert(nonExistentField, 'toBeVisible', undefined, 'Non-existent field check');

    // Test continues even after soft assertion failure
    await usernameField.fill('testuser');
    await assert.toHaveValue(usernameField, 'testuser', 'Username should be filled');
  });

  test('Example: Complex Test Scenario with Multiple Assertions', async ({ page, pages, testData }) => {
    // Step 1: Navigate and verify
    await pages.loginPage.goto();
    await assert.toHaveURL(page, /\/login/, 'Should navigate to login page');
    await assert.toHaveTitle(page, /Login/, 'Should have correct page title');

    // Step 2: Verify form elements
    const usernameField = page.locator('#username');
    const passwordField = page.locator('#password');
    const loginButton = page.locator('button[type="submit"]');

    await assert.toBeVisible(usernameField, 'Username field should be visible');
    await assert.toBeVisible(passwordField, 'Password field should be visible');
    await assert.toBeEnabled(loginButton, 'Login button should be enabled');

    // Step 3: Fill form and verify values
    const userData = testData.getData('testData', 'users.validUser');
    await usernameField.fill(userData.email);
    await passwordField.fill(userData.password);

    await assert.toHaveValue(usernameField, userData.email, 'Username should be filled');
    await assert.toHaveValue(passwordField, userData.password, 'Password should be filled');

    // Step 4: Submit and verify navigation
    await loginButton.click();
    await page.waitForURL(/\/home/);
    await assert.toHaveURL(page, /\/home/, 'Should navigate to home after login');

    // Step 5: Verify logged in state
    const userMenu = page.locator('.user-menu');
    await assert.toBeVisible(userMenu, 'User menu should be visible after login');
    await assert.toContainText(userMenu, userData.email.split('@')[0], 'Should display username');
  });
});
