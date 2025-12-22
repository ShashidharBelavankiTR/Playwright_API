# Playwright TypeScript Test Automation Framework - Development Prompt

## Role & Context
You are a Senior Test Automation Architect with 15+ years of experience in building enterprise-grade test automation frameworks. Your expertise includes design patterns, best practices, and creating maintainable, scalable automation solutions using Playwright and TypeScript.

## Objective
Build a production-ready Playwright TypeScript automation framework that is modular, maintainable, and follows industry best practices. The framework should support both UI and API testing with comprehensive logging, reporting, and error handling.

---

## PHASE 1: Project Foundation & Setup

### Task 1.1: Initialize Project Structure
- Initialize a new TypeScript project with proper tsconfig.json
- Install Playwright with TypeScript support
- Set up the following folder structure:
  ```
  playwright-framework/
  ├── src/
  │   ├── pages/           # Page Object Models
  │   ├── base/            # Base classes
  │   ├── api/             # API testing classes
  │   ├── helpers/         # Helper/Utility classes
  │   ├── utils/           # Utility functions
  │   ├── config/          # Configuration files
  │   ├── fixtures/        # Playwright fixtures
  │   └── types/           # TypeScript type definitions
  ├── tests/
  │   ├── ui/              # UI tests
  │   └── api/             # API tests
  ├── test-data/           # Test data JSON files
  ├── reports/             # Test reports
  ├── screenshots/         # Screenshot storage
  ├── .env                 # Environment variables
  ├── .env.example         # Example env file
  ├── playwright.config.ts # Playwright configuration
  └── package.json
  ```

### Task 1.2: Install Dependencies
Install the following packages:
- `@playwright/test` (latest)
- `dotenv` for environment variable management
- `typescript` and type definitions
- `winston` or similar for advanced logging
- Any additional utility libraries (e.g., `faker` for test data generation)

### Task 1.3: Configure TypeScript
- Set up `tsconfig.json` with strict mode enabled
- Configure path aliases for clean imports
- Enable ES modules and target ES2020 or later
- Set up proper source maps for debugging

### Task 1.4: Environment Configuration
- Create `.env` file for environment variables:
  - BASE_URL
  - API_BASE_URL
  - ENVIRONMENT (dev/staging/prod)
  - TIMEOUT values
  - Browser settings
  - Any other configurable parameters
- Create `.env.example` as a template
- Create a config loader class to read and validate environment variables

---

## PHASE 2: Core Framework Components

### Task 2.1: Implement Singleton Pattern for Configuration
Create a `ConfigManager` class using Singleton pattern:
- Load environment variables using dotenv
- Provide type-safe access to configuration values
- Validate required configuration on initialization
- Export a single instance for framework-wide use

### Task 2.2: Build TestDataManager
Create `TestDataManager` class:
- Read JSON files from `test-data/` directory
- Implement caching mechanism to avoid repeated file reads
- Support nested JSON structures
- Provide type-safe data retrieval methods
- Include error handling for missing files or invalid JSON
- Example methods:
  - `getData<T>(fileName: string, key?: string): T`
  - `getAllData<T>(fileName: string): T`

### Task 2.3: Create Logger Utility
Implement a comprehensive logging system:
- Use Winston or custom logger
- Log levels: ERROR, WARN, INFO, DEBUG
- Log to both console and file
- Include timestamps and test context
- Create helper methods for different log levels
- Integrate with Playwright's built-in test.step() for report logging

### Task 2.4: Implement Base Page Class
Create `BasePage` class with the following features:

#### Core Properties:
- Protected `page: Page` instance
- Protected logger instance

#### Web Action Methods (with dual parameter support):
All methods should:
- Accept both `Locator` and `string` (selector) parameters
- Wrap actions in try-catch blocks with detailed error messages
- Use Playwright's `test.step()` to log every action
- Include built-in waiting mechanisms
- Take screenshots on failures

Required methods:
```typescript
// Navigation
async navigateTo(url: string): Promise<void>
async reload(): Promise<void>
async goBack(): Promise<void>
async goForward(): Promise<void>

// Interactions
async click(locator: Locator | string, options?: ClickOptions): Promise<void>
async doubleClick(locator: Locator | string): Promise<void>
async fill(locator: Locator | string, text: string): Promise<void>
async clear(locator: Locator | string): Promise<void>
async selectOption(locator: Locator | string, value: string | string[]): Promise<void>
async check(locator: Locator | string): Promise<void>
async uncheck(locator: Locator | string): Promise<void>
async hover(locator: Locator | string): Promise<void>
async dragAndDrop(source: Locator | string, target: Locator | string): Promise<void>

// Uploads/Downloads
async uploadFile(locator: Locator | string, filePath: string): Promise<void>
async downloadFile(locator: Locator | string): Promise<string>

// Waits
async waitForElement(locator: Locator | string, state?: 'visible' | 'hidden' | 'attached'): Promise<void>
async waitForURL(url: string | RegExp): Promise<void>
async waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle'): Promise<void>

// Assertions
async isVisible(locator: Locator | string): Promise<boolean>
async isEnabled(locator: Locator | string): Promise<boolean>
async isChecked(locator: Locator | string): Promise<boolean>
async getText(locator: Locator | string): Promise<string>
async getTextContent(locator: Locator | string): Promise<string | null>
async getAttribute(locator: Locator | string, name: string): Promise<string | null>
async getElementCount(locator: Locator | string): Promise<number>

// Screenshots
async takeScreenshot(name: string): Promise<void>
async takeElementScreenshot(locator: Locator | string, name: string): Promise<void>

// JavaScript Execution
async executeScript(script: string, ...args: any[]): Promise<any>

// Frames & Windows
async switchToFrame(frameLocator: Locator | string): Promise<void>
async switchToWindow(index: number): Promise<void>

// Keyboard & Mouse
async pressKey(key: string): Promise<void>
async type(locator: Locator | string, text: string, delay?: number): Promise<void>
```

#### Helper Method for Locator Resolution:
```typescript
private resolveLocator(locator: Locator | string): Locator
```

### Task 2.5: Implement Factory Pattern for Page Objects
Create `PageFactory` class:
- Centralized page object instantiation
- Lazy initialization of page objects
- Singleton instances for each page class
- Type-safe page creation

### Task 2.6: Create Pages Index/Manager Class
Create `Pages` or `PageManager` class:
- Inherits or aggregates all page classes
- Provides easy access to all pages through a single instance
- Example structure:
```typescript
export class Pages {
  public loginPage: LoginPage;
  public homePage: HomePage;
  public dashboardPage: DashboardPage;
  // ... all other pages
  
  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    this.dashboardPage = new DashboardPage(page);
  }
}
```

---

## PHASE 3: Design Pattern Implementation

### Task 3.1: Page Object Model (POM)
For each page, create a class that:
- Extends `BasePage`
- Defines locators as private properties
- Exposes public methods representing user actions
- Returns appropriate page objects for method chaining
- Example structure:
```typescript
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput = '#email';
  private readonly passwordInput = '#password';
  private readonly loginButton = 'button[type="submit"]';
  
  // Actions
  async login(email: string, password: string): Promise<void> {
    await test.step('Login with credentials', async () => {
      await this.fill(this.emailInput, email);
      await this.fill(this.passwordInput, password);
      await this.click(this.loginButton);
    });
  }
  
  // Assertions
  async verifyLoginPageLoaded(): Promise<void> {
    await this.waitForElement(this.loginButton, 'visible');
  }
}
```

### Task 3.2: Strategy Pattern for Test Execution
Implement Strategy pattern for:
- Different browser strategies (Chromium, Firefox, WebKit)
- Different environment strategies (Dev, Staging, Production)
- Different data provider strategies (JSON, CSV, Database)

Create interfaces and concrete implementations for each strategy.

### Task 3.3: Builder Pattern for API Requests
Create `RequestBuilder` class for API testing:
- Fluent interface for building HTTP requests
- Support for headers, query parameters, body
- Automatic authentication token handling
- Example:
```typescript
const request = new RequestBuilder()
  .setMethod('POST')
  .setEndpoint('/api/users')
  .setHeaders({ 'Content-Type': 'application/json' })
  .setBody({ name: 'John', email: 'john@example.com' })
  .build();
```

---

## PHASE 4: API Testing Framework

### Task 4.1: Create APIClient Base Class
Implement `APIClient` class with:
- All HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- Request/Response interceptors
- Automatic error handling
- Response validation
- Logging of all API calls and responses
- Integration with Playwright's APIRequestContext

Methods to implement:
```typescript
async get(endpoint: string, options?: RequestOptions): Promise<APIResponse>
async post(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse>
async put(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse>
async patch(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse>
async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse>
async head(endpoint: string, options?: RequestOptions): Promise<APIResponse>
async options(endpoint: string, options?: RequestOptions): Promise<APIResponse>
```

### Task 4.2: API Helper/Utility Classes
Create helper classes for:

#### RequestHelper:
- Build request bodies for complex scenarios
- Generate dynamic payloads
- Merge default and custom headers
- Handle authentication tokens

#### ResponseHelper:
- Parse and validate responses
- Extract data from responses
- Assert response status codes
- Assert response schema
- Compare actual vs expected responses

#### PayloadBuilder:
- Create type-safe request payloads
- Support for nested objects
- Dynamic field generation using Faker
- Template-based payload creation

### Task 4.3: API Page Objects
Create API page objects (service classes):
- One class per API resource/service
- Methods for each API endpoint
- Built on top of APIClient
- Example:
```typescript
export class UserAPIService extends APIClient {
  private readonly baseEndpoint = '/api/users';
  
  async createUser(userData: UserData): Promise<APIResponse> {
    return await test.step('Create new user via API', async () => {
      return this.post(this.baseEndpoint, userData);
    });
  }
  
  async getUser(userId: string): Promise<APIResponse> {
    return await test.step(`Get user ${userId} via API`, async () => {
      return this.get(`${this.baseEndpoint}/${userId}`);
    });
  }
}
```

---

## PHASE 5: Fixtures & Test Setup

### Task 5.1: Create Custom Fixtures
Extend Playwright's test fixtures:

```typescript
// fixtures/base.fixture.ts
export const test = base.extend<{
  pages: Pages;
  apiServices: APIServices;
  testData: TestDataManager;
}>({
  // Auto-accept cookies
  context: async ({ context }, use) => {
    await context.grantPermissions(['geolocation', 'notifications']);
    // Add cookie acceptance logic
    await use(context);
  },
  
  // Pages fixture
  pages: async ({ page }, use) => {
    const pages = new Pages(page);
    await use(pages);
  },
  
  // API Services fixture
  apiServices: async ({ request }, use) => {
    const apiServices = new APIServices(request);
    await use(apiServices);
  },
  
  // Test Data fixture
  testData: async ({}, use) => {
    const testDataManager = TestDataManager.getInstance();
    await use(testDataManager);
  }
});
```

### Task 5.2: Global Setup & Teardown
- Create `global-setup.ts` for pre-test operations
- Create `global-teardown.ts` for post-test cleanup
- Authentication state persistence
- Database seeding if needed

### Task 5.3: Browser Context Configuration
- Configure viewport sizes
- Set up geolocation
- Configure permissions
- Set up authentication state
- Handle cookie acceptance automatically

---

## PHASE 6: Reporting & Logging

### Task 6.1: Configure HTML Reporter
Update `playwright.config.ts`:
- Enable HTML reporter with all options
- Configure screenshot capture on failure (and optionally on success)
- Set up trace collection
- Configure video recording

### Task 6.2: Implement Custom Reporter
Create a custom reporter class:
- Extend Playwright's Reporter class
- Log each test step with timestamp
- Capture screenshots at each major step
- Generate detailed logs for debugging
- Include test duration and performance metrics

### Task 6.3: Screenshot Manager
Create `ScreenshotManager` utility:
- Automatic screenshot naming with timestamps
- Different screenshot types (full page, viewport, element)
- Screenshot comparison capabilities
- Organize screenshots by test name and date

### Task 6.4: Detailed Test Logging
Implement comprehensive logging:
- Log test start/end times
- Log each action performed
- Log all assertions
- Log API requests and responses
- Include context information (URL, browser, viewport)
- Create separate log files per test run

---

## PHASE 7: Error Handling & Resilience

### Task 7.1: Implement Retry Mechanisms
- Retry failed actions with exponential backoff
- Configurable retry counts
- Smart retry logic (retry on specific errors only)

### Task 7.2: Custom Error Classes
Create custom error classes:
- `ElementNotFoundException`
- `TimeoutException`
- `APIException`
- `TestDataException`
- Include detailed error messages and context

### Task 7.3: Global Error Handler
- Catch and handle uncaught exceptions
- Take screenshots on errors
- Log full stack traces
- Graceful degradation

### Task 7.4: Test Isolation
- Ensure each test runs independently
- Clear state between tests
- Use separate browser contexts
- Reset test data after each test
- Implement proper test hooks (beforeEach, afterEach)

---

## PHASE 8: Best Practices Implementation

### Task 8.1: Embrace Auto-Waiting
- Rely on Playwright's built-in auto-waiting
- Remove unnecessary explicit waits
- Use appropriate wait strategies

### Task 8.2: Web-First Assertions
- Use Playwright's web-first assertions
- Implement assertion helpers
- Create custom matchers if needed

### Task 8.3: Code Quality
- Add ESLint configuration
- Add Prettier for code formatting
- Implement pre-commit hooks (Husky)
- Add TypeScript strict mode

### Task 8.4: Documentation
- Add JSDoc comments to all public methods
- Create README.md with:
  - Setup instructions
  - Running tests
  - Framework architecture
  - Contributing guidelines
- Create ARCHITECTURE.md explaining design patterns used
- Add inline comments for complex logic

---

## PHASE 9: Helper/Utility Classes

### Task 9.1: DateTimeHelper
- Format dates
- Generate date ranges
- Calculate relative dates

### Task 9.2: StringHelper
- String manipulation utilities
- Random string generation
- String validation

### Task 9.3: FileHelper
- Read/write files
- File path utilities
- File validation

### Task 9.4: WaitHelper
- Custom wait conditions
- Polling mechanisms
- Conditional waits

### Task 9.5: AssertionHelper
- Custom assertion methods
- Soft assertions
- Assertion utilities for complex conditions

---

## PHASE 10: Sample Tests & Examples

### Task 10.1: Create Sample UI Tests
Create example tests demonstrating:
- Login flow
- Form submission
- Navigation
- Data-driven testing
- Parallel execution

### Task 10.2: Create Sample API Tests
Create example tests demonstrating:
- CRUD operations
- Authentication flows
- Request validation
- Response assertions
- API chaining

### Task 10.3: Create Hybrid Tests
Create tests that combine UI and API:
- API setup, UI validation
- UI action, API verification

---

## PHASE 11: Configuration & Optimization

### Task 11.1: Playwright Config Optimization
Configure `playwright.config.ts`:
- Multiple projects for different browsers
- Parallel execution settings
- Timeout configurations
- Base URL and environment settings
- Reporter configuration
- Test directory patterns

### Task 11.2: CI/CD Integration Preparation
- Create scripts for CI execution
- Docker configuration (optional)
- GitHub Actions / Jenkins pipeline examples
- Environment-specific configurations

### Task 11.3: Performance Optimization
- Implement parallel execution
- Optimize page object initialization
- Cache frequently used data
- Minimize unnecessary waits

---

## PHASE 12: Final Review & Quality Assurance

### Task 12.1: Code Review Checklist
- All methods have proper error handling
- All public methods are documented
- TypeScript types are properly defined
- No code duplication
- Naming conventions are consistent

### Task 12.2: Testing the Framework
- Run all sample tests
- Verify reports are generated correctly
- Check screenshot capture
- Validate logging output
- Test API functionality

### Task 12.3: Documentation Review
- Update README with final instructions
- Document all environment variables
- Add troubleshooting guide
- Create quick start guide

---

## Deliverables Checklist

- ✅ Complete folder structure
- ✅ TypeScript configuration
- ✅ Environment configuration (.env)
- ✅ ConfigManager (Singleton)
- ✅ TestDataManager
- ✅ BasePage with all web actions
- ✅ Page Object Models for sample pages
- ✅ PageManager/Pages class
- ✅ Factory pattern implementation
- ✅ Strategy pattern implementation
- ✅ APIClient with all HTTP methods
- ✅ API helper classes (RequestBuilder, ResponseHelper)
- ✅ API service classes
- ✅ Custom fixtures
- ✅ HTML reporter configuration
- ✅ Custom reporter with detailed logging
- ✅ Screenshot manager
- ✅ Error handling & custom exceptions
- ✅ Test isolation mechanisms
- ✅ Helper/Utility classes
- ✅ Sample UI tests
- ✅ Sample API tests
- ✅ Sample hybrid tests
- ✅ Comprehensive documentation
- ✅ CI/CD scripts

---

## Quality Standards

1. **Code Quality:**
   - All code must be typed with TypeScript
   - No `any` types unless absolutely necessary
   - Follow SOLID principles
   - DRY (Don't Repeat Yourself)

2. **Maintainability:**
   - Clear naming conventions
   - Modular design
   - Easy to extend
   - Well-documented

3. **Reliability:**
   - Robust error handling
   - Retry mechanisms
   - Test isolation
   - Deterministic tests

4. **Performance:**
   - Fast test execution
   - Efficient resource usage
   - Parallel execution support

5. **Reporting:**
   - Detailed HTML reports
   - Screenshots at every step
   - Clear logs for debugging
   - Test metrics and duration

---

## Implementation Notes

- Use async/await consistently
- Leverage TypeScript's type system fully
- Keep methods focused and single-purpose
- Use descriptive variable and method names
- Handle both success and failure scenarios
- Add appropriate timeout values
- Use Playwright's best practices
- Ensure cross-browser compatibility
- Make the framework extensible for future enhancements

---

## Getting Started After Framework Creation

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Run sample tests: `npx playwright test`
4. View reports: `npx playwright show-report`
5. Run specific test: `npx playwright test tests/ui/login.spec.ts`
6. Run in UI mode: `npx playwright test --ui`
7. Debug tests: `npx playwright test --debug`

---

## Success Criteria

The framework is complete when:
- All phases are implemented
- All sample tests pass
- Reports are generated with screenshots
- Documentation is comprehensive
- Code follows TypeScript best practices
- Error handling is robust
- Framework is easy to extend
- Both UI and API testing are fully functional
- Everything is properly structured and organized

