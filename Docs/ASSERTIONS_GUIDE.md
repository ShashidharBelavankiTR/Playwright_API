# Assertions Utility - Comprehensive Guide

## Overview

The Assertions utility class provides a comprehensive set of assertion methods with enhanced logging, Playwright step integration, and detailed error reporting. All assertions are wrapped in Playwright test steps for better test reports and include detailed logging for debugging.

## Features

- ✅ **Detailed Logging**: Every assertion logs start, success, and failure with contextual information
- 📊 **Playwright Steps**: All assertions appear as steps in Playwright reports
- 🔍 **Enhanced Error Details**: Failures include actual vs expected values
- 🎯 **Type-Safe**: Full TypeScript support with proper types
- 📝 **Unique Step IDs**: Each assertion gets a unique ID for tracking
- 🔄 **Soft Assertions**: Support for non-blocking assertions

## Installation

The Assertions utility is located at `src/utils/Assertions.ts` and can be imported in your tests:

```typescript
import { assert } from '../../src/utils/Assertions';
// or
import { Assertions } from '../../src/utils/Assertions';
```

## Usage

### Basic Import

```typescript
import { test } from '../../src/fixtures/baseFixtures';
import { assert } from '../../src/utils/Assertions';
```

## Assertion Categories

### 1. Element Visibility Assertions

#### `toBeVisible`
Assert that an element is visible on the page.

```typescript
await assert.toBeVisible(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const loginButton = page.locator('#login-btn');
await assert.toBeVisible(loginButton, 'Login button should be visible');
```

**Logs:**
- Start: `🔍 [STEP_1_xxx] Starting assertion: Element to be visible`
- Success: `✅ [STEP_1_xxx] Assertion PASSED: Element is visible`
- Failure: `❌ [STEP_1_xxx] Assertion FAILED: Element is visible`

---

#### `toBeHidden`
Assert that an element is hidden or not visible.

```typescript
await assert.toBeHidden(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const errorMessage = page.locator('.error');
await assert.toBeHidden(errorMessage, 'Error should be hidden initially');
```

---

#### `toBeAttached`
Assert that an element is attached to the DOM.

```typescript
await assert.toBeAttached(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const formElement = page.locator('#registration-form');
await assert.toBeAttached(formElement, 'Form should be in DOM');
```

---

### 2. Element State Assertions

#### `toBeEnabled`
Assert that an element is enabled and can be interacted with.

```typescript
await assert.toBeEnabled(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const submitButton = page.locator('button[type="submit"]');
await assert.toBeEnabled(submitButton, 'Submit button should be enabled');
```

---

#### `toBeDisabled`
Assert that an element is disabled.

```typescript
await assert.toBeDisabled(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const submitButton = page.locator('button[type="submit"]');
await assert.toBeDisabled(submitButton, 'Button should be disabled without input');
```

---

#### `toBeChecked`
Assert that a checkbox or radio button is checked.

```typescript
await assert.toBeChecked(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const termsCheckbox = page.locator('#terms');
await termsCheckbox.check();
await assert.toBeChecked(termsCheckbox, 'Terms should be checked');
```

---

#### `toBeUnchecked`
Assert that a checkbox or radio button is not checked.

```typescript
await assert.toBeUnchecked(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const newsletterCheckbox = page.locator('#newsletter');
await assert.toBeUnchecked(newsletterCheckbox, 'Newsletter unchecked by default');
```

---

#### `toBeEditable`
Assert that an element is editable (typically input fields).

```typescript
await assert.toBeEditable(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const nameField = page.locator('#name');
await assert.toBeEditable(nameField, 'Name field should be editable');
```

---

#### `toBeFocused`
Assert that an element has focus.

```typescript
await assert.toBeFocused(locator, 'Custom message', timeout);
```

**Example:**
```typescript
const searchInput = page.locator('#search');
await searchInput.focus();
await assert.toBeFocused(searchInput, 'Search should have focus');
```

---

### 3. Text Content Assertions

#### `toContainText`
Assert that an element contains specific text (partial match).

```typescript
await assert.toContainText(locator, expectedText, 'Custom message', timeout);
```

**Example:**
```typescript
const heading = page.locator('h1');
await assert.toContainText(heading, 'Welcome', 'Heading should contain Welcome');

// With regex
await assert.toContainText(heading, /welcome/i, 'Case-insensitive match');

// Multiple texts
await assert.toContainText(page.locator('.items'), ['Item 1', 'Item 2']);
```

**Logs include actual text on failure:**
```
❌ [STEP_2_xxx] Assertion FAILED: Element contains text
  Expected: "Welcome"
  Actual: "Hello"
```

---

#### `toHaveText`
Assert that an element has exact text.

```typescript
await assert.toHaveText(locator, expectedText, 'Custom message', timeout);
```

**Example:**
```typescript
const status = page.locator('.status');
await assert.toHaveText(status, 'Active', 'Status should be exactly Active');

// With regex
await assert.toHaveText(status, /^Active$/, 'Exact match with regex');
```

---

### 4. Attribute Assertions

#### `toHaveAttribute`
Assert that an element has a specific attribute with expected value.

```typescript
await assert.toHaveAttribute(locator, attributeName, expectedValue, 'Custom message', timeout);
```

**Example:**
```typescript
const link = page.locator('a.external');
await assert.toHaveAttribute(link, 'href', 'https://example.com', 'Should link to example.com');
await assert.toHaveAttribute(link, 'target', '_blank', 'Should open in new tab');

// With regex
await assert.toHaveAttribute(link, 'href', /^https:/, 'Should be HTTPS link');
```

**Logs include actual attribute value on failure:**
```
❌ [STEP_3_xxx] Assertion FAILED: Element has attribute
  Attribute: "href"
  Expected: "https://example.com"
  Actual: "http://example.com"
```

---

#### `toHaveClass`
Assert that an element has specific CSS class(es).

```typescript
await assert.toHaveClass(locator, className, 'Custom message', timeout);
```

**Example:**
```typescript
const button = page.locator('.btn');
await assert.toHaveClass(button, 'btn-primary', 'Should have primary button class');

// Multiple classes
await assert.toHaveClass(button, ['btn', 'btn-primary', 'active']);

// With regex
await assert.toHaveClass(button, /btn-/, 'Should have btn- prefix class');
```

---

#### `toHaveId`
Assert that an element has specific ID.

```typescript
await assert.toHaveId(locator, id, 'Custom message', timeout);
```

**Example:**
```typescript
const modal = page.locator('.modal');
await assert.toHaveId(modal, 'login-modal', 'Modal should have correct ID');

// With regex
await assert.toHaveId(modal, /modal/, 'ID should contain modal');
```

---

### 5. Value Assertions

#### `toHaveValue`
Assert that an input element has specific value.

```typescript
await assert.toHaveValue(locator, expectedValue, 'Custom message', timeout);
```

**Example:**
```typescript
const emailInput = page.locator('#email');
await emailInput.fill('test@example.com');
await assert.toHaveValue(emailInput, 'test@example.com', 'Email should be set');

// With regex
await assert.toHaveValue(emailInput, /@example\.com$/, 'Should be example.com email');
```

**Logs include actual value on failure:**
```
❌ [STEP_4_xxx] Assertion FAILED: Element has value
  Expected: "test@example.com"
  Actual: "test@test.com"
```

---

#### `toHaveValues`
Assert that a multi-select element has specific values.

```typescript
await assert.toHaveValues(locator, expectedValues, 'Custom message', timeout);
```

**Example:**
```typescript
const multiSelect = page.locator('select[multiple]');
await assert.toHaveValues(multiSelect, ['option1', 'option2'], 'Should have selected values');
```

---

### 6. Count Assertions

#### `toHaveCount`
Assert the number of elements matching the locator.

```typescript
await assert.toHaveCount(locator, expectedCount, 'Custom message', timeout);
```

**Example:**
```typescript
const listItems = page.locator('li');
await assert.toHaveCount(listItems, 5, 'Should have 5 list items');

const emptyResults = page.locator('.no-results');
await assert.toHaveCount(emptyResults, 0, 'Should not show no-results');
```

**Logs include actual count on failure:**
```
❌ [STEP_5_xxx] Assertion FAILED: Elements have count
  Expected: 5
  Actual: 3
```

---

### 7. URL and Title Assertions

#### `toHaveURL`
Assert page URL matches expected value or pattern.

```typescript
await assert.toHaveURL(page, expectedUrl, 'Custom message', timeout);
```

**Example:**
```typescript
await assert.toHaveURL(page, 'https://example.com/login', 'Should be on login page');

// With regex
await assert.toHaveURL(page, /\/dashboard/, 'Should be on dashboard');
await assert.toHaveURL(page, /\?search=/, 'Should have search parameter');
```

**Logs include actual URL on failure:**
```
❌ [STEP_6_xxx] Assertion FAILED: Page has URL
  Expected: /\/dashboard/
  Actual: "https://example.com/home"
```

---

#### `toHaveTitle`
Assert page title matches expected value or pattern.

```typescript
await assert.toHaveTitle(page, expectedTitle, 'Custom message', timeout);
```

**Example:**
```typescript
await assert.toHaveTitle(page, 'Login - MyApp', 'Should have login title');

// With regex
await assert.toHaveTitle(page, /Dashboard/, 'Title should contain Dashboard');
```

---

### 8. API Response Assertions

#### `toHaveStatusCode`
Assert API response has expected status code.

```typescript
await assert.toHaveStatusCode(response, expectedStatus, 'Custom message');
```

**Example:**
```typescript
const response = await apiServices.userService.getAllUsers();
await assert.toHaveStatusCode(response, 200, 'Should return 200 OK');
await assert.toHaveStatusCode(response, 201, 'Should return 201 Created');
await assert.toHaveStatusCode(response, 404, 'Should return 404 Not Found');
```

**Logs include actual status on failure:**
```
❌ [STEP_7_xxx] Assertion FAILED: Response has status code
  Expected: 200
  Actual: 404
  URL: "https://api.example.com/users"
```

---

#### `toBeOK`
Assert API response is successful (status 200-299).

```typescript
await assert.toBeOK(response, 'Custom message');
```

**Example:**
```typescript
const response = await apiServices.userService.createUser(userData);
await assert.toBeOK(response, 'User creation should succeed');
```

---

#### `toContainResponseData`
Assert API response body contains expected data.

```typescript
await assert.toContainResponseData(response, expectedData, 'Custom message');
```

**Example:**
```typescript
const response = await apiServices.userService.getUserById('123');
await assert.toContainResponseData(
  response,
  { id: '123', name: 'John Doe' },
  'Response should contain user data'
);
```

---

### 9. CSS Style Assertions

#### `toHaveCSS`
Assert element has specific CSS property value.

```typescript
await assert.toHaveCSS(locator, propertyName, expectedValue, 'Custom message', timeout);
```

**Example:**
```typescript
const button = page.locator('.btn-primary');
await assert.toHaveCSS(button, 'background-color', 'rgb(0, 123, 255)', 'Should be blue');
await assert.toHaveCSS(button, 'display', 'inline-block', 'Should be inline-block');

// With regex
await assert.toHaveCSS(button, 'font-size', /16px|1rem/, 'Should have standard font size');
```

---

### 10. Custom Generic Assertions

#### `assertCondition`
Assert a custom boolean condition with custom message.

```typescript
await assert.assertCondition(condition, assertionName, errorMessage, details);
```

**Example:**
```typescript
const isLoggedIn = await page.evaluate(() => !!localStorage.getItem('token'));
await assert.assertCondition(
  isLoggedIn,
  'User is logged in',
  'Expected user to be logged in',
  { hasToken: isLoggedIn }
);
```

---

#### `assertEqual`
Assert equality between two values.

```typescript
await assert.assertEqual(actual, expected, assertionName, details);
```

**Example:**
```typescript
const userData = await getUserData();
await assert.assertEqual(
  userData.email,
  'test@example.com',
  'User email should match',
  { userData }
);
```

---

#### `assertDeepEqual`
Assert deep equality (strict equality check).

```typescript
await assert.assertDeepEqual(actual, expected, assertionName, details);
```

**Example:**
```typescript
const expectedUser = { name: 'John', age: 30, role: 'admin' };
const actualUser = await getUser();
await assert.assertDeepEqual(actualUser, expectedUser, 'User object should match exactly');
```

---

#### `assertTruthy` / `assertFalsy`
Assert value is truthy or falsy.

```typescript
await assert.assertTruthy(value, assertionName, details);
await assert.assertFalsy(value, assertionName, details);
```

**Example:**
```typescript
const userData = await getUser();
await assert.assertTruthy(userData, 'User data should exist');

const error = await getError();
await assert.assertFalsy(error, 'Should not have error');
```

---

#### `assertNull` / `assertNotNull`
Assert value is null or not null.

```typescript
await assert.assertNull(value, assertionName, details);
await assert.assertNotNull(value, assertionName, details);
```

**Example:**
```typescript
const deletedUser = await deleteUser();
await assert.assertNull(deletedUser, 'Deleted user should be null');

const activeUser = await getActiveUser();
await assert.assertNotNull(activeUser, 'Active user should not be null');
```

---

#### `assertUndefined` / `assertDefined`
Assert value is undefined or defined.

```typescript
await assert.assertUndefined(value, assertionName, details);
await assert.assertDefined(value, assertionName, details);
```

**Example:**
```typescript
let uninitializedVar;
await assert.assertUndefined(uninitializedVar, 'Variable should be undefined');

const initializedVar = 'value';
await assert.assertDefined(initializedVar, 'Variable should be defined');
```

---

#### `assertArrayContains`
Assert array contains specific value.

```typescript
await assert.assertArrayContains(array, expectedValue, assertionName, details);
```

**Example:**
```typescript
const userRoles = ['admin', 'user', 'moderator'];
await assert.assertArrayContains(userRoles, 'admin', 'Should have admin role');
```

---

#### `assertHasProperty`
Assert object has specific property.

```typescript
await assert.assertHasProperty(obj, propertyName, assertionName, details);
```

**Example:**
```typescript
const userResponse = await getUser();
await assert.assertHasProperty(userResponse, 'id', 'Response should have ID property');
await assert.assertHasProperty(userResponse, 'email', 'Response should have email property');
```

---

#### `assertStringContains`
Assert string contains substring.

```typescript
await assert.assertStringContains(text, substring, assertionName, details);
```

**Example:**
```typescript
const pageContent = await page.textContent('body');
await assert.assertStringContains(pageContent || '', 'Welcome', 'Page should contain Welcome');
```

---

#### `assertStringMatches`
Assert string matches regex pattern.

```typescript
await assert.assertStringMatches(text, pattern, assertionName, details);
```

**Example:**
```typescript
const email = 'test@example.com';
await assert.assertStringMatches(email, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Valid email format');
```

---

#### `assertGreaterThan` / `assertLessThan`
Assert numeric comparisons.

```typescript
await assert.assertGreaterThan(actual, expected, assertionName, details);
await assert.assertLessThan(actual, expected, assertionName, details);
```

**Example:**
```typescript
const userCount = await getUserCount();
await assert.assertGreaterThan(userCount, 0, 'Should have at least one user');
await assert.assertLessThan(userCount, 1000, 'Should not exceed 1000 users');
```

---

### 11. Soft Assertions

#### `softAssert`
Perform non-blocking assertion that logs failure but doesn't stop test execution.

```typescript
await assert.softAssert(locator, assertion, expected, message);
```

**Example:**
```typescript
// These won't stop test even if they fail
await assert.softAssert(element1, 'toBeVisible', undefined, 'Element 1 check');
await assert.softAssert(element2, 'toBeVisible', undefined, 'Element 2 check');
await assert.softAssert(element3, 'toHaveText', 'Expected Text', 'Element 3 text check');

// Test continues even if soft assertions fail
await page.click('.next-button');
```

---

## Logging Details

Each assertion provides comprehensive logging:

### Success Log Example:
```
🔍 [STEP_1_1703000000000] Starting assertion: Element to be visible
  selector: #login-button
  timeout: 5000

✅ [STEP_1_1703000000000] Assertion PASSED: Element is visible
  selector: #login-button
```

### Failure Log Example:
```
🔍 [STEP_2_1703000000001] Starting assertion: Element to have text
  selector: .status
  expectedText: "Active"
  timeout: 5000

❌ [STEP_2_1703000000001] Assertion FAILED: Element has text
  selector: .status
  expectedText: "Active"
  actualText: "Inactive"
  error: "Expected: Active, Received: Inactive"
```

---

## Best Practices

### 1. Use Descriptive Messages
```typescript
// Good
await assert.toBeVisible(loginButton, 'Login button should be visible on page load');

// Less informative
await assert.toBeVisible(loginButton);
```

### 2. Chain Related Assertions
```typescript
// Verify form state
await assert.toBeVisible(form, 'Form should be visible');
await assert.toBeEnabled(submitButton, 'Submit should be enabled');
await assert.toHaveValue(emailInput, expectedEmail, 'Email should be pre-filled');
```

### 3. Use Soft Assertions for Non-Critical Checks
```typescript
// Check multiple optional elements without stopping test
await assert.softAssert(badge1, 'toBeVisible', undefined, 'Badge 1 check');
await assert.softAssert(badge2, 'toBeVisible', undefined, 'Badge 2 check');
await assert.softAssert(badge3, 'toBeVisible', undefined, 'Badge 3 check');
```

### 4. Leverage Custom Assertions for Complex Logic
```typescript
const isValidSession = await checkSessionValidity();
await assert.assertCondition(
  isValidSession,
  'Session validity check',
  'Expected session to be valid',
  { timestamp: Date.now(), sessionId: 'abc123' }
);
```

### 5. Use Appropriate Timeouts
```typescript
// Quick check with short timeout
await assert.toBeVisible(immediateElement, 'Should appear instantly', 1000);

// Patient check for slow operation
await assert.toHaveText(processingStatus, 'Complete', 'Should complete', 30000);
```

---

## Integration with Playwright Reports

All assertions appear as steps in Playwright HTML reports:

```
✅ Assert element is visible: Login button should be visible
✅ Assert element has value: Email should be pre-filled
✅ Assert response status: Should return 200 OK
✅ Assert page has URL: Should navigate to dashboard
```

Failed assertions show in red with error details and screenshots (if configured).

---

## Complete Test Example

```typescript
import { test } from '../../src/fixtures/baseFixtures';
import { assert } from '../../src/utils/Assertions';

test('Complete user registration flow', async ({ page, testData }) => {
  // Navigate
  await page.goto('/register');
  await assert.toHaveURL(page, /\/register/, 'Should be on registration page');

  // Verify form elements
  const nameField = page.locator('#name');
  const emailField = page.locator('#email');
  const passwordField = page.locator('#password');
  const termsCheckbox = page.locator('#terms');
  const submitButton = page.locator('button[type="submit"]');

  await assert.toBeVisible(nameField, 'Name field should be visible');
  await assert.toBeVisible(emailField, 'Email field should be visible');
  await assert.toBeVisible(passwordField, 'Password field should be visible');
  await assert.toBeDisabled(submitButton, 'Submit should be disabled initially');

  // Fill form
  await nameField.fill('John Doe');
  await emailField.fill('john@example.com');
  await passwordField.fill('SecurePass123!');

  await assert.toHaveValue(nameField, 'John Doe', 'Name should be filled');
  await assert.toHaveValue(emailField, 'john@example.com', 'Email should be filled');

  // Accept terms
  await termsCheckbox.check();
  await assert.toBeChecked(termsCheckbox, 'Terms should be accepted');
  await assert.toBeEnabled(submitButton, 'Submit should be enabled after terms accepted');

  // Submit
  await submitButton.click();
  await page.waitForURL(/\/dashboard/);

  // Verify success
  await assert.toHaveURL(page, /\/dashboard/, 'Should navigate to dashboard');
  const welcomeMessage = page.locator('.welcome');
  await assert.toBeVisible(welcomeMessage, 'Welcome message should appear');
  await assert.toContainText(welcomeMessage, 'John Doe', 'Should show user name');
});
```

---

## Troubleshooting

### Issue: Assertions timing out
**Solution**: Increase timeout parameter
```typescript
await assert.toBeVisible(slowElement, 'Slow loading element', 30000);
```

### Issue: False negatives with dynamic content
**Solution**: Wait for stability before asserting
```typescript
await page.waitForLoadState('networkidle');
await assert.toHaveText(dynamicContent, expectedText);
```

### Issue: Flaky assertions
**Solution**: Use soft assertions for non-critical checks
```typescript
await assert.softAssert(optionalElement, 'toBeVisible');
```

---

## Summary

The Assertions utility provides:
- 40+ assertion methods covering all common scenarios
- Automatic logging with unique step IDs
- Playwright test step integration
- Detailed error messages with actual vs expected values
- Support for soft assertions
- Full TypeScript support

Use this utility to create maintainable, well-logged tests with clear failure messages!
