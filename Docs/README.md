# Playwright TypeScript Test Automation Framework

A production-ready, enterprise-grade test automation framework built with Playwright and TypeScript. This framework implements best practices, design patterns, and provides comprehensive support for both UI and API testing.

## 🚀 Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **Singleton Pattern** - ConfigManager and utility singletons
- **Factory Pattern** - Page object instantiation
- **Strategy Pattern** - Flexible test execution strategies
- **Builder Pattern** - API request construction
- **TestDataManager** - JSON-based test data management with caching
- **Comprehensive BasePage** - 30+ reusable web action methods
- **API Testing Framework** - Full HTTP methods support (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- **Custom Fixtures** - Extended Playwright fixtures with auto-cookie acceptance
- **Advanced Logging** - Winston-based logging with file and console output
- **Screenshot Management** - Organized screenshot capture with timestamps
- **Helper Utilities** - DateTime, String, Wait helpers and more
- **Error Handling** - Robust try-catch blocks with custom exceptions
- **Environment Configuration** - .env based configuration management
- **HTML Reports** - Detailed reports with screenshots for every step
- **TypeScript Strict Mode** - Type-safe codebase
- **Modular Architecture** - Easy to extend and maintain

## 📁 Project Structure

```
playwright-framework/
├── src/
│   ├── pages/              # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   └── index.ts        # PageManager - Central page export
│   ├── base/               # Base classes
│   │   └── BasePage.ts     # Base page with all web actions
│   ├── api/                # API testing
│   │   ├── APIClient.ts    # Base API client
│   │   └── index.ts        # API services
│   ├── helpers/            # Helper classes
│   │   ├── RequestBuilder.ts
│   │   ├── ResponseHelper.ts
│   │   ├── DateTimeHelper.ts
│   │   ├── StringHelper.ts
│   │   └── WaitHelper.ts
│   ├── utils/              # Utility functions
│   │   ├── Logger.ts
│   │   ├── TestDataManager.ts
│   │   └── ScreenshotManager.ts
│   ├── config/             # Configuration
│   │   ├── ConfigManager.ts
│   │   ├── global-setup.ts
│   │   └── global-teardown.ts
│   ├── fixtures/           # Custom fixtures
│   │   └── baseFixtures.ts
│   └── types/              # TypeScript types
│       └── index.ts
├── tests/
│   ├── ui/                 # UI tests
│   │   └── login.spec.ts
│   └── api/                # API tests
│       └── users.spec.ts
├── test-data/              # Test data JSON files
│   └── testData.json
├── reports/                # Test reports
├── screenshots/            # Screenshots
├── .env                    # Environment variables
├── .env.example            # Environment template
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Prettier configuration
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone or create the project directory**
   ```bash
   cd playwright-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   BASE_URL=https://your-app-url.com
   API_BASE_URL=https://api.your-app-url.com
   HEADLESS=false
   ```

## 🏃 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/ui/login.spec.ts
```

### Run tests in UI mode (recommended for debugging)
```bash
npx playwright test --ui
```

### Run tests in headed mode
```bash
npx playwright test --headed
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests with specific tag
```bash
npx playwright test --grep @smoke
```

### Run tests in parallel
```bash
npx playwright test --workers=4
```

### Debug tests
```bash
npx playwright test --debug
```

## 📊 Viewing Reports

### HTML Report
```bash
npx playwright show-report
```

The HTML report includes:
- Test execution summary
- Screenshots for each step
- Detailed logs
- Trace viewer for failed tests
- Performance metrics

### Report Location
Reports are generated in the `reports/` directory:
- `reports/html-report/` - HTML report
- `reports/test-results.json` - JSON results
- `reports/junit-results.xml` - JUnit format
- `reports/logs/` - Test logs

## 📝 Writing Tests

### UI Test Example

```typescript
import { test, expect } from '../../src/fixtures/baseFixtures';

test.describe('Feature Tests', () => {
  test('should perform action', async ({ pages, testData }) => {
    // Get test data
    const data = testData.getData('testData', 'users.validUser');
    
    // Use page objects
    await pages.loginPage.goto();
    await pages.loginPage.login(data.email, data.password);
    
    // Verify results
    await pages.homePage.verifyPageLoaded();
    expect(await pages.homePage.isUserLoggedIn()).toBeTruthy();
  });
});
```

### API Test Example

```typescript
import { test, expect } from '../../src/fixtures/baseFixtures';
import { ResponseHelper, PayloadBuilder } from '../../src/helpers';

test.describe('API Tests', () => {
  test('should create user via API', async ({ apiServices }) => {
    // Build payload
    const userData = PayloadBuilder.buildUserPayload({
      name: 'Test User',
    });
    
    // Make API call
    const response = await apiServices.userService.createUser(userData);
    
    // Assert response
    ResponseHelper.assertStatusCode(response, 201);
    const user = await ResponseHelper.parseJSON(response);
    expect(user).toHaveProperty('id');
  });
});
```

### Creating New Page Objects

```typescript
import { Page, test } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class YourPage extends BasePage {
  // Define locators
  private readonly elementLocator = '#element-id';
  
  constructor(page: Page) {
    super(page);
  }
  
  // Define page actions
  async performAction(): Promise<void> {
    await test.step('Perform action', async () => {
      await this.click(this.elementLocator);
    });
  }
}
```

## 🎨 Design Patterns Used

### 1. **Singleton Pattern**
- `ConfigManager` - Single instance for configuration
- `TestDataManager` - Cached test data access
- `Logger` - Centralized logging

### 2. **Page Object Model (POM)**
- All page classes extend `BasePage`
- Encapsulates page elements and actions
- Promotes code reusability

### 3. **Factory Pattern**
- `PageManager` - Central page object creation

### 4. **Builder Pattern**
- `RequestBuilder` - Fluent API request construction
- `PayloadBuilder` - Dynamic payload generation

### 5. **Strategy Pattern**
- Environment strategies
- Browser strategies
- Data provider strategies

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Environment name | `dev` |
| `BASE_URL` | Application base URL | Required |
| `API_BASE_URL` | API base URL | Required |
| `DEFAULT_TIMEOUT` | Default timeout (ms) | `30000` |
| `HEADLESS` | Run in headless mode | `false` |
| `BROWSER` | Browser type | `chromium` |
| `PARALLEL_WORKERS` | Parallel test workers | `4` |
| `LOG_LEVEL` | Logging level | `info` |
| `SCREENSHOT_ON_FAILURE` | Capture screenshots on failure | `true` |

### Browser Configuration

Configure browsers in `playwright.config.ts`:
- Chromium
- Firefox
- WebKit
- Mobile Chrome
- Mobile Safari
- Edge
- Chrome

## 🧪 Test Data Management

### JSON-based Test Data

Create JSON files in `test-data/` directory:

```json
{
  "users": {
    "validUser": {
      "email": "test@example.com",
      "password": "Password123!"
    }
  }
}
```

### Accessing Test Data

```typescript
// Get all data from file
const allData = testData.getAllData('testData');

// Get specific key
const user = testData.getData('testData', 'users.validUser');

// Get nested data
const email = testData.getNestedData('testData', 'users.validUser.email');
```

## 📸 Screenshots

Screenshots are automatically captured:
- On test failures
- On demand using `takeScreenshot()` method
- Organized by date and test name
- Located in `screenshots/` directory

## 📋 Best Practices

1. **Use Page Objects** - Always interact through page objects
2. **Leverage Auto-Waiting** - Playwright waits automatically
3. **Use test.step()** - Wrap actions for better reporting
4. **Test Isolation** - Each test should be independent
5. **Use Fixtures** - Leverage custom fixtures for setup
6. **Error Handling** - All actions have try-catch blocks
7. **Meaningful Assertions** - Use web-first assertions
8. **Data-Driven Tests** - Use test data files
9. **Parallel Execution** - Run tests in parallel when possible
10. **Clean Code** - Follow TypeScript best practices

## 🐛 Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Playwright Inspector
```bash
PWDEBUG=1 npx playwright test
```

### Show Trace
```bash
npx playwright show-trace trace.zip
```

### VS Code Debugging
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Playwright Tests",
  "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
  "args": ["test", "--headed", "--debug"],
  "console": "integratedTerminal"
}
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: reports/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framework Architecture](./ARCHITECTURE.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Follow TypeScript and ESLint rules
5. Use meaningful commit messages

## 📄 License

ISC

## 👥 Support

For issues and questions:
- Check the documentation
- Review sample tests
- Check logs in `reports/logs/`
- Review screenshots in `screenshots/`

---

**Built with ❤️ using Playwright and TypeScript**
