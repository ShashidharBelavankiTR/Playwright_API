# Assertions Utility - Quick Reference

## Import
```typescript
import { assert } from '../../src/utils/Assertions';
```

## Element Visibility
| Method | Usage |
|--------|-------|
| `toBeVisible` | `await assert.toBeVisible(locator, 'message', timeout)` |
| `toBeHidden` | `await assert.toBeHidden(locator, 'message', timeout)` |
| `toBeAttached` | `await assert.toBeAttached(locator, 'message', timeout)` |

## Element State
| Method | Usage |
|--------|-------|
| `toBeEnabled` | `await assert.toBeEnabled(locator, 'message', timeout)` |
| `toBeDisabled` | `await assert.toBeDisabled(locator, 'message', timeout)` |
| `toBeChecked` | `await assert.toBeChecked(locator, 'message', timeout)` |
| `toBeUnchecked` | `await assert.toBeUnchecked(locator, 'message', timeout)` |
| `toBeEditable` | `await assert.toBeEditable(locator, 'message', timeout)` |
| `toBeFocused` | `await assert.toBeFocused(locator, 'message', timeout)` |

## Text Content
| Method | Usage |
|--------|-------|
| `toContainText` | `await assert.toContainText(locator, 'text', 'message', timeout)` |
| `toHaveText` | `await assert.toHaveText(locator, 'exact text', 'message', timeout)` |

## Attributes
| Method | Usage |
|--------|-------|
| `toHaveAttribute` | `await assert.toHaveAttribute(locator, 'attr', 'value', 'message', timeout)` |
| `toHaveClass` | `await assert.toHaveClass(locator, 'className', 'message', timeout)` |
| `toHaveId` | `await assert.toHaveId(locator, 'id', 'message', timeout)` |
| `toHaveCSS` | `await assert.toHaveCSS(locator, 'property', 'value', 'message', timeout)` |

## Values
| Method | Usage |
|--------|-------|
| `toHaveValue` | `await assert.toHaveValue(locator, 'value', 'message', timeout)` |
| `toHaveValues` | `await assert.toHaveValues(locator, ['v1', 'v2'], 'message', timeout)` |

## Count
| Method | Usage |
|--------|-------|
| `toHaveCount` | `await assert.toHaveCount(locator, 5, 'message', timeout)` |

## Page
| Method | Usage |
|--------|-------|
| `toHaveURL` | `await assert.toHaveURL(page, /pattern/, 'message', timeout)` |
| `toHaveTitle` | `await assert.toHaveTitle(page, 'title', 'message', timeout)` |

## API Response
| Method | Usage |
|--------|-------|
| `toHaveStatusCode` | `await assert.toHaveStatusCode(response, 200, 'message')` |
| `toBeOK` | `await assert.toBeOK(response, 'message')` |
| `toContainResponseData` | `await assert.toContainResponseData(response, {data}, 'message')` |

## Generic Assertions
| Method | Usage |
|--------|-------|
| `assertCondition` | `await assert.assertCondition(bool, 'name', 'error', {})` |
| `assertEqual` | `await assert.assertEqual(actual, expected, 'name', {})` |
| `assertDeepEqual` | `await assert.assertDeepEqual(actual, expected, 'name', {})` |
| `assertTruthy` | `await assert.assertTruthy(value, 'name', {})` |
| `assertFalsy` | `await assert.assertFalsy(value, 'name', {})` |
| `assertNull` | `await assert.assertNull(value, 'name', {})` |
| `assertNotNull` | `await assert.assertNotNull(value, 'name', {})` |
| `assertUndefined` | `await assert.assertUndefined(value, 'name', {})` |
| `assertDefined` | `await assert.assertDefined(value, 'name', {})` |
| `assertArrayContains` | `await assert.assertArrayContains(arr, val, 'name', {})` |
| `assertHasProperty` | `await assert.assertHasProperty(obj, 'prop', 'name', {})` |
| `assertStringContains` | `await assert.assertStringContains(str, 'sub', 'name', {})` |
| `assertStringMatches` | `await assert.assertStringMatches(str, /regex/, 'name', {})` |
| `assertGreaterThan` | `await assert.assertGreaterThan(5, 3, 'name', {})` |
| `assertLessThan` | `await assert.assertLessThan(3, 5, 'name', {})` |

## Soft Assertions
| Method | Usage |
|--------|-------|
| `softAssert` | `await assert.softAssert(locator, 'toBeVisible', undefined, 'message')` |

## Common Patterns

### UI Test Pattern
```typescript
test('Example test', async ({ page }) => {
  // Navigate
  await page.goto('/login');
  await assert.toHaveURL(page, /\/login/, 'Should be on login page');

  // Verify elements
  const input = page.locator('#username');
  await assert.toBeVisible(input, 'Input should be visible');
  await assert.toBeEnabled(input, 'Input should be enabled');

  // Fill and verify
  await input.fill('test@example.com');
  await assert.toHaveValue(input, 'test@example.com', 'Should have value');
});
```

### API Test Pattern
```typescript
test('API test', async ({ apiServices }) => {
  const response = await apiServices.userService.getAllUsers();
  
  // Verify response
  await assert.toHaveStatusCode(response, 200, 'Should return 200');
  await assert.toBeOK(response, 'Should be successful');
  
  // Verify data
  const users = await response.json();
  await assert.assertTruthy(Array.isArray(users), 'Should be array');
  await assert.assertGreaterThan(users.length, 0, 'Should have users');
});
```

### Data Validation Pattern
```typescript
test('Validate data', async () => {
  const data = await getData();
  
  // Structure validation
  await assert.assertDefined(data, 'Data should exist');
  await assert.assertHasProperty(data, 'id', 'Should have id');
  await assert.assertHasProperty(data, 'email', 'Should have email');
  
  // Value validation
  await assert.assertStringMatches(data.email, /^[\w-\.]+@/, 'Valid email');
  await assert.assertGreaterThan(data.id, 0, 'Valid ID');
});
```

## Tips

1. **Always add descriptive messages**: Helps debugging when tests fail
2. **Use soft assertions for non-critical checks**: Test continues even if assertion fails
3. **Leverage regex patterns**: More flexible matching for dynamic content
4. **Add context with details parameter**: Include additional debugging information
5. **Check Playwright reports**: All assertions appear as steps with full context

## Logging Output

### Success
```
🔍 [STEP_1_xxx] Starting assertion: Element to be visible
✅ [STEP_1_xxx] Assertion PASSED: Element is visible
```

### Failure
```
🔍 [STEP_2_xxx] Starting assertion: Element to have text
❌ [STEP_2_xxx] Assertion FAILED: Element has text
   Expected: "Welcome"
   Actual: "Hello"
```
