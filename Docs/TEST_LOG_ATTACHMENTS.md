# Test Log Attachments in Playwright HTML Reports

## Overview

Each test execution now automatically generates a dedicated log file that captures all test activities, errors, and browser events. These log files are automatically attached to the Playwright HTML report for easy debugging and analysis.

## Features

### 1. **Test-Specific Log Files**
- Each test gets its own unique log file: `test-{test-name}-{timestamp}.log`
- Stored in: `reports/logs/`
- Contains complete test execution details from start to finish

### 2. **Comprehensive Logging**
The log files capture:
- ✅ Test metadata (name, file, project, test ID)
- 🔍 All logger calls from your test code
- 🔥 Page errors and crashes
- 🖥️ Browser console messages (errors, warnings, logs)
- ❌ Failed network requests
- ⚠️ Test failures with full error stack traces
- 📊 Final test status (passed/failed/skipped)

### 3. **Automatic Attachment to HTML Reports**
- Log files are automatically attached to each test result
- View logs directly in the Playwright HTML report
- No manual steps required

## How It Works

### Automatic Setup (No Code Changes Required)

The framework automatically:

1. **Creates a log file** when a test starts
2. **Logs all activities** throughout test execution
3. **Captures errors** from multiple sources:
   - Test assertion failures
   - Page errors (JavaScript errors in the browser)
   - Browser console errors/warnings
   - Failed HTTP requests
   - Page crashes
4. **Attaches the log** to the HTML report when test completes

### Using Logger in Your Tests

Simply use the logger instance anywhere in your tests:

```typescript
import { test, expect } from '../../src/fixtures/baseFixtures';
import { logger } from '../../src/utils/Logger';

test('My test', async ({ page }) => {
  logger.info('Step 1: Navigate to page');
  await page.goto('https://example.com');
  
  logger.info('Step 2: Verify page loaded');
  await expect(page.locator('h1')).toBeVisible();
  
  logger.info('Test completed successfully');
});
```

## What Gets Logged

### Test Start Information
```
==================== TEST STARTED ====================
Test: Should successfully login with valid credentials
Test ID: 70eaa474236392373fdf-a8d4656cacebb9060b9a
Timestamp: 2025-12-23T14:13:29.051Z
======================================================
🚀 Starting test: Should successfully login with valid credentials
📂 Test file: C:\...\tests\ui\login.spec.ts
🔖 Project: firefox
```

### Error Capture
```
❌ Test failed with 1 error(s):

--- Error 1 ---
Message: expect(received).toBe(expected)
Expected: true
Received: false
Stack Trace:
    at Object.<anonymous> (C:\...\login.spec.ts:32:5)
```

### Browser Errors
```
🔥 Page Error: TypeError: Cannot read property 'click' of null
Stack: TypeError: Cannot read property 'click' of null
    at HTMLButtonElement.onClick (app.js:123:45)

🖥️ Browser Console Error: Failed to load resource: net::ERR_CONNECTION_REFUSED

❌ Request Failed: https://api.example.com/users
Failure: net::ERR_CONNECTION_REFUSED
```

### Test Completion
```
❌ Test completed with status: failed
==================== TEST ENDED ====================
Status: FAILED
Timestamp: 2025-12-23T14:13:30.385Z
====================================================
```

## Viewing Logs in HTML Report

1. Run your tests:
   ```bash
   npx playwright test
   ```

2. Open the HTML report:
   ```bash
   npx playwright show-report
   ```

3. Click on any test result

4. Scroll to the **"Attachments"** section

5. Click on **"test-log"** to view or download the log file

## Log File Location

All test log files are stored in:
```
reports/logs/test-{test-name}-{timestamp}.log
```

Example:
```
reports/logs/test-should-successfully-login-with-valid-credentials-2025-12-23T14-13-29-051Z.log
```

## Benefits

1. **Easier Debugging**: Complete test execution history in one file
2. **Error Context**: See exactly what happened before a failure
3. **Browser Insights**: Capture browser console errors and page issues
4. **Audit Trail**: Keep detailed records of test execution
5. **CI/CD Integration**: Log files are part of the HTML report artifacts

## Configuration

### Log Levels

Control log verbosity in `.env`:
```env
LOG_LEVEL=debug    # Shows all logs (debug, info, warn, error)
LOG_LEVEL=info     # Shows info, warn, error
LOG_LEVEL=warn     # Shows warn, error
LOG_LEVEL=error    # Shows only errors
```

### Enable/Disable File Logging

In `.env`:
```env
LOG_TO_FILE=true   # Enable test log files
LOG_TO_FILE=false  # Disable test log files (console only)
```

## Advanced Usage

### Custom Logging in Page Objects

```typescript
import { logger } from '../utils/Logger';

export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    logger.info(`Attempting login for user: ${username}`);
    
    try {
      await this.page.fill('#username', username);
      await this.page.fill('#password', password);
      await this.page.click('#login-button');
      
      logger.info('Login form submitted successfully');
    } catch (error) {
      logger.error('Failed to submit login form', { error });
      throw error;
    }
  }
}
```

### API Request Logging

```typescript
logger.logAPIRequest('POST', '/api/login', { username: 'user@example.com' });

const response = await apiServices.post('/api/login', data);

logger.logAPIResponse('POST', '/api/login', response.status, response.data);
```

### Step Logging

```typescript
logger.logStep('Fill login form', 'STARTED');
await pages.loginPage.login(email, password);
logger.logStep('Fill login form', 'PASSED');

logger.logStep('Verify home page', 'STARTED');
await pages.homePage.verifyPageLoaded();
logger.logStep('Verify home page', 'PASSED');
```

## Troubleshooting

### Log files are empty
- Check that `LOG_TO_FILE=true` in your `.env` file
- Verify tests are using the custom fixtures from `baseFixtures.ts`

### Logs not appearing in HTML report
- Ensure the test completes (logs are attached after test execution)
- Check that `reports/logs/` directory exists and is writable

### Too many log files
- Old log files are retained for audit purposes
- Consider adding a cleanup script to remove logs older than X days:
  ```bash
  # Windows PowerShell
  Get-ChildItem reports\logs\*.log | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item
  
  # Linux/Mac
  find reports/logs -name "*.log" -mtime +7 -delete
  ```

## Example Test with Comprehensive Logging

```typescript
import { test, expect } from '../../src/fixtures/baseFixtures';
import { logger } from '../../src/utils/Logger';

test('Complete example with logging', async ({ page, pages, testData }) => {
  logger.info('=== Test Setup ===');
  const userData = testData.getData('testData', 'users.validUser');
  logger.info(`User data loaded: ${userData.email}`);

  logger.info('=== Step 1: Navigate to Login ===');
  await pages.loginPage.goto();
  await pages.loginPage.verifyPageLoaded();
  logger.info('Login page loaded successfully');

  logger.info('=== Step 2: Perform Login ===');
  await pages.loginPage.login(userData.email, userData.password);
  logger.info('Login credentials submitted');

  logger.info('=== Step 3: Verify Success ===');
  await pages.homePage.verifyPageLoaded();
  const isLoggedIn = await pages.homePage.isUserLoggedIn();
  logger.info(`Login verification result: ${isLoggedIn}`);
  
  expect(isLoggedIn).toBeTruthy();
  logger.info('✅ All assertions passed');
});
```

## See Also

- [Logger API Documentation](./LOGGER_API.md)
- [Assertions Guide](./ASSERTIONS_GUIDE.md)
- [Framework Architecture](./ARCHITECTURE.md)
