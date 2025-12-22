import { test, expect } from '../../src/fixtures/baseFixtures';
import { config } from '../../src/config/ConfigManager';

/**
 * Sample UI Test Suite - Login Functionality
 * Demonstrates UI testing with the framework
 */
test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to base URL before each test
    await page.goto(config.getBaseUrl());
  });

  test('Should successfully login with valid credentials', async ({ pages, testData }) => {
    // Get test data
    const userData = testData.getData('testData', 'users.validUser');

    // Navigate to login page
    await pages.loginPage.goto();

    // Verify login page is loaded
    await pages.loginPage.verifyPageLoaded();

    // Perform login
    await pages.loginPage.login(userData.email, userData.password);

    // Verify home page is loaded after login
    await pages.homePage.verifyPageLoaded();

    // Verify user is logged in
    const isLoggedIn = await pages.homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('Should show error message with invalid credentials', async ({ pages, testData }) => {
    // Get invalid user data
    const invalidUser = testData.getData('testData', 'users.invalidUser');

    // Navigate to login page
    await pages.loginPage.goto();

    // Attempt login with invalid credentials
    await pages.loginPage.login(invalidUser.email, invalidUser.password);

    // Verify error message is displayed
    const errorDisplayed = await pages.loginPage.isErrorDisplayed();
    expect(errorDisplayed).toBeTruthy();
  });

  test('Should remember user when "Remember Me" is checked', async ({ pages, testData }) => {
    const userData = testData.getData('testData', 'users.validUser');

    await pages.loginPage.goto();
    await pages.loginPage.loginWithRememberMe(userData.email, userData.password);

    // Verify successful login
    await pages.homePage.verifyPageLoaded();
  });

  test('Should navigate to forgot password page', async ({ pages }) => {
    await pages.loginPage.goto();
    await pages.loginPage.clickForgotPassword();

    // Verify navigation to forgot password page
    // Add assertion based on actual URL/page
  });

  test('Should navigate to sign up page', async ({ pages }) => {
    await pages.loginPage.goto();
    await pages.loginPage.clickSignUp();

    // Verify navigation to sign up page
    // Add assertion based on actual URL/page
  });
});

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page, pages, testData }) => {
    // Login before each test
    const userData = testData.getData('testData', 'users.validUser');
    await pages.loginPage.goto();
    await pages.loginPage.login(userData.email, userData.password);
    await pages.homePage.verifyPageLoaded();
  });

  test('Should display welcome message', async ({ pages }) => {
    const welcomeMessage = await pages.homePage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.length).toBeGreaterThan(0);
  });

  test('Should perform search', async ({ pages, testData }) => {
    const searchTerms = testData.getData<string[]>('testData', 'searchTerms');
    const searchQuery = searchTerms[0];

    await pages.homePage.search(searchQuery);

    // Add assertions for search results
  });

  test('Should logout successfully', async ({ pages }) => {
    await pages.homePage.logout();

    // Verify redirect to login page
    await pages.loginPage.verifyPageLoaded();
  });
});

/**
 * Data-driven test example
 */
test.describe('Data-Driven Login Tests', () => {
  const testCases = [
    { email: 'user1@example.com', password: 'Pass123!', shouldSucceed: true },
    { email: 'user2@example.com', password: 'Pass456!', shouldSucceed: true },
    { email: 'invalid@example.com', password: 'wrong', shouldSucceed: false },
  ];

  testCases.forEach(({ email, password, shouldSucceed }) => {
    test(`Login test for ${email}`, async ({ pages }) => {
      await pages.loginPage.goto();
      await pages.loginPage.login(email, password);

      if (shouldSucceed) {
        await pages.homePage.verifyPageLoaded();
        expect(await pages.homePage.isUserLoggedIn()).toBeTruthy();
      } else {
        expect(await pages.loginPage.isErrorDisplayed()).toBeTruthy();
      }
    });
  });
});
