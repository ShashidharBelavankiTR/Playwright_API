# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Installation
```bash
# Check if dependencies are installed
npm list

# Install Playwright browsers if needed
npm run install:browsers
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Minimum required:
# - BASE_URL
# - API_BASE_URL
```

### Step 3: Run Your First Test
```bash
# Run all tests
npm test

# Or run in UI mode (recommended)
npm run test:ui
```

### Step 4: View Results
```bash
# Open HTML report
npm run report
```

## 📝 Your First Custom Test

### 1. Create a Page Object

**File**: `src/pages/MyPage.ts`

```typescript
import { Page, test } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class MyPage extends BasePage {
  // Define your locators
  private readonly myButton = '#my-button';
  private readonly myInput = 'input[name="myfield"]';
  
  constructor(page: Page) {
    super(page);
  }
  
  // Define your actions
  async clickMyButton(): Promise<void> {
    await test.step('Click my button', async () => {
      await this.click(this.myButton);
    });
  }
  
  async fillMyInput(text: string): Promise<void> {
    await test.step(`Fill my input with: ${text}`, async () => {
      await this.fill(this.myInput, text);
    });
  }
}
```

### 2. Add Page to PageManager

**File**: `src/pages/index.ts`

```typescript
import { MyPage } from './MyPage';

export class PageManager {
  public readonly loginPage: LoginPage;
  public readonly homePage: HomePage;
  public readonly myPage: MyPage; // Add your page
  
  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    this.myPage = new MyPage(page); // Initialize
  }
}

export { LoginPage, HomePage, MyPage }; // Export
```

### 3. Write Your Test

**File**: `tests/ui/mytest.spec.ts`

```typescript
import { test, expect } from '../../src/fixtures/baseFixtures';

test.describe('My Test Suite', () => {
  test('should perform my test', async ({ pages }) => {
    // Use your page object
    await pages.myPage.fillMyInput('Hello World');
    await pages.myPage.clickMyButton();
    
    // Add assertions
    expect(true).toBeTruthy();
  });
});
```

### 4. Run Your Test

```bash
npm test tests/ui/mytest.spec.ts
```

## 🔌 Your First API Test

### 1. Create API Service

**File**: `src/api/MyService.ts`

```typescript
import { APIRequestContext, test } from '@playwright/test';
import { APIClient } from './APIClient';

export class MyAPIService extends APIClient {
  private readonly endpoint = '/my-resource';

  constructor(request: APIRequestContext) {
    super(request);
  }

  async getResource(id: string) {
    return await test.step(`Get resource ${id}`, async () => {
      return await this.get(`${this.endpoint}/${id}`);
    });
  }

  async createResource(data: any) {
    return await test.step('Create resource', async () => {
      return await this.post(this.endpoint, data);
    });
  }
}
```

### 2. Add to API Services

**File**: `src/api/index.ts`

```typescript
import { MyAPIService } from './MyService';

export class APIServices {
  public readonly userService: UserAPIService;
  public readonly myService: MyAPIService; // Add your service

  constructor(request: APIRequestContext) {
    this.userService = new UserAPIService(request);
    this.myService = new MyAPIService(request); // Initialize
  }
}
```

### 3. Write API Test

**File**: `tests/api/myapi.spec.ts`

```typescript
import { test, expect } from '../../src/fixtures/baseFixtures';
import { ResponseHelper } from '../../src/helpers/ResponseHelper';

test.describe('My API Tests', () => {
  test('should create resource', async ({ apiServices }) => {
    const data = { name: 'Test Resource' };
    
    const response = await apiServices.myService.createResource(data);
    
    ResponseHelper.assertStatusCode(response, 201);
    const resource = await ResponseHelper.parseJSON(response);
    expect(resource).toHaveProperty('id');
  });
});
```

## 📊 Working with Test Data

### 1. Add Test Data

**File**: `test-data/mydata.json`

```json
{
  "myTestData": {
    "field1": "value1",
    "field2": "value2",
    "nested": {
      "field3": "value3"
    }
  }
}
```

### 2. Use in Test

```typescript
test('use test data', async ({ testData }) => {
  // Get all data
  const all = testData.getAllData('mydata');
  
  // Get specific field
  const field1 = testData.getData('mydata', 'myTestData.field1');
  
  // Get nested data
  const field3 = testData.getNestedData('mydata', 'myTestData.nested.field3');
});
```

## 🎯 Common Patterns

### Pattern 1: Login Before Test

```typescript
test.describe('Protected Page Tests', () => {
  test.beforeEach(async ({ pages, testData }) => {
    const user = testData.getData('testData', 'users.validUser');
    await pages.loginPage.goto();
    await pages.loginPage.login(user.email, user.password);
  });
  
  test('test protected feature', async ({ pages }) => {
    // User is already logged in
    await pages.homePage.verifyPageLoaded();
  });
});
```

### Pattern 2: Data-Driven Tests

```typescript
const testCases = [
  { input: 'test1', expected: 'result1' },
  { input: 'test2', expected: 'result2' },
];

testCases.forEach(({ input, expected }) => {
  test(`test with ${input}`, async ({ pages }) => {
    // Your test logic
    expect(result).toBe(expected);
  });
});
```

### Pattern 3: API + UI Hybrid

```typescript
test('create via API, verify in UI', async ({ pages, apiServices }) => {
  // Create data via API
  const response = await apiServices.userService.createUser(userData);
  const user = await ResponseHelper.parseJSON(response);
  
  // Verify in UI
  await pages.myPage.goto();
  await pages.myPage.searchUser(user.id);
  // Assert user is visible
});
```

## 🔧 Debugging Tips

### 1. Run in Debug Mode
```bash
npm run test:debug
```

### 2. Run in Headed Mode
```bash
npm run test:headed
```

### 3. Use Console Logs
```typescript
console.log('Debug info:', someVariable);
```

### 4. Take Screenshots
```typescript
await pages.myPage.takeScreenshot('debug-screenshot');
```

### 5. Check Logs
```
reports/logs/test-*.log
```

## 📋 Checklist

- [ ] Dependencies installed
- [ ] Browsers installed
- [ ] .env configured
- [ ] Sample test runs successfully
- [ ] Reports generated
- [ ] Created first page object
- [ ] Created first test
- [ ] Test data configured
- [ ] Understood project structure

## 🆘 Troubleshooting

### Tests Not Running?
```bash
# Reinstall dependencies
npm install
npx playwright install
```

### Environment Issues?
```bash
# Check .env file exists
ls -la .env

# Verify values are set
cat .env
```

### Import Errors?
```bash
# Rebuild TypeScript
npx tsc --build
```

## 📚 Next Steps

1. **Read** [README.md](README.md) for comprehensive documentation
2. **Review** [ARCHITECTURE.md](ARCHITECTURE.md) for design details
3. **Explore** sample tests in `tests/` directory
4. **Check** existing page objects in `src/pages/`
5. **Customize** for your application

## 🎉 You're Ready!

Start writing tests and automating your application!

For help: Check documentation, sample tests, or logs.

Happy Testing! 🚀
