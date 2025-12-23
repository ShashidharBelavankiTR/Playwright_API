# Assertion Failure Behavior and Test Reporting

## How Assertions Mark Tests as Failed

All assertion methods in the `Assertions` utility class properly fail tests when assertions don't pass. Here's how it works:

### Failure Mechanism

Every assertion method (except `softAssert`) follows this pattern:

```typescript
await test.step(`Assert element is visible`, async () => {
  try {
    await expect(locator).toBeVisible({ timeout });
    this.logAssertionSuccess(stepId, 'Element is visible', { selector });
  } catch (error) {
    this.logAssertionFailure(stepId, 'Element is visible', error as Error, { selector });
    throw error; // ← This marks the test as FAILED
  }
});
```

### Key Points

1. **Error is Re-thrown** - When an assertion fails, the error is caught, logged, and then re-thrown
2. **Test.step() Wrapper** - All assertions are wrapped in `test.step()` for proper reporting hierarchy
3. **Detailed Logging** - Failure details are logged before throwing (visible in logs and reports)
4. **Test Execution Stops** - Once an assertion fails, no subsequent code executes (test is marked FAILED immediately)

## Test Report Integration

### HTML Report
When a test fails due to an assertion:
- ❌ Test is marked as **FAILED** in the HTML report
- 📊 Failure appears in the test step hierarchy
- 📝 Error message shows expected vs actual values
- 🖼️ Screenshots are attached (if applicable)
- 📋 Full stack trace is available

### JUnit Report
Failed assertions appear as:
```xml
<testcase name="login test" status="failed">
  <failure message="Expected element to be visible">
    Error: Element #submit-btn not found
    at Assertions.toBeVisible (Assertions.ts:64)
  </failure>
</testcase>
```

### JSON Report
```json
{
  "status": "failed",
  "error": {
    "message": "Expected element to be visible",
    "stack": "Error: Element #submit-btn not found..."
  }
}
```

## Examples

### Example 1: Single Assertion Fails Test
```typescript
test('login should work', async ({ page }) => {
  await page.goto('/login');
  
  // This assertion fails
  await Assertions.toBeVisible(page.locator('#wrong-selector'));
  // ❌ Test marked as FAILED here
  
  // This code never executes
  await page.fill('#username', 'user@test.com');
});
```

**Result**: Test is **FAILED** ❌

**Report Shows**:
```
✗ login should work (2.5s)
  └─ Assert element is visible: #wrong-selector
     Error: Expected element to be visible
     Received: Element not found
```

### Example 2: Multiple Assertions with One Failure
```typescript
test('form validation', async ({ page }) => {
  await page.goto('/form');
  
  // First assertion passes ✅
  await Assertions.toBeVisible(page.locator('#form'));
  
  // Second assertion passes ✅
  await Assertions.toBeEnabled(page.locator('#submit'));
  
  // Third assertion fails ❌
  await Assertions.toHaveText(page.locator('#title'), 'Wrong Text');
  // Test marked as FAILED here
  
  // This never executes
  await page.click('#submit');
});
```

**Result**: Test is **FAILED** ❌ (even though 2 out of 3 assertions passed)

**Report Shows**:
```
✗ form validation (3.1s)
  ├─ ✓ Assert element is visible: #form
  ├─ ✓ Assert element is enabled: #submit
  └─ ✗ Assert element has text: Wrong Text
     Expected: "Wrong Text"
     Received: "Actual Form Title"
```

### Example 3: Soft Assertion Doesn't Fail Test
```typescript
test('page elements check', async ({ page }) => {
  await page.goto('/page');
  
  // Soft assertion fails but doesn't stop execution 📝
  await Assertions.softAssert(
    page.locator('#optional-element'),
    'toBeVisible',
    undefined,
    'Optional element check'
  );
  
  // This DOES execute ✅
  await Assertions.toBeVisible(page.locator('#required-element'));
});
```

**Result**: Test **PASSES** ✅ (soft assertion failures are logged but don't fail the test)

**Report Shows**:
```
✓ page elements check (2.3s)
  ├─ ⚠ Soft assert toBeVisible: Optional element check (logged failure)
  └─ ✓ Assert element is visible: #required-element
```

### Example 4: API Assertion Fails Test
```typescript
test('API should return 200', async ({ request }) => {
  const response = await request.get('/api/users');
  
  // This fails if status is not 200
  await Assertions.toHaveStatusCode(response, 200);
  // ❌ Test fails if status code doesn't match
});
```

**Result**: If API returns 404, test is **FAILED** ❌

**Report Shows**:
```
✗ API should return 200 (1.2s)
  └─ Assert response status: 200
     Expected: 200
     Received: 404
     URL: https://api.example.com/api/users
```

### Example 5: Generic Assertion Fails Test
```typescript
test('calculate total', async () => {
  const cart = { items: 3, total: 100 };
  const expectedTotal = 150;
  
  // This fails because 100 !== 150
  await Assertions.assertEqual(
    cart.total,
    expectedTotal,
    'Cart total should match',
    { cart }
  );
  // ❌ Test marked as FAILED here
});
```

**Result**: Test is **FAILED** ❌

**Report Shows**:
```
✗ calculate total (0.5s)
  └─ Assert equal: Cart total should match
     Expected: 150
     Received: 100
     Details: { cart: { items: 3, total: 100 } }
```

## Verification Test

Run the verification test to see failure behavior:

```bash
npx playwright test tests/examples/assertion-failure-test.spec.ts
```

This test suite includes:
- ❌ Tests that SHOULD FAIL (to verify failure reporting)
- ✅ Tests that SHOULD PASS (to verify success reporting)
- 📝 Soft assertion test (to verify soft assertions don't fail tests)

**Expected Results**:
```
Running 6 tests

  ✓ SHOULD PASS - Assertion succeeds and marks test as passed
  ✗ SHOULD FAIL - Assertion fails and marks test as failed
  ✗ SHOULD FAIL - Multiple assertions with one failure
  ✓ SHOULD PASS - Soft assertion does not fail test
  ✗ SHOULD FAIL - API assertion fails and marks test as failed
  ✗ SHOULD FAIL - Generic assertion fails and marks test as failed

2 passed, 4 failed
```

## Logs When Assertion Fails

When an assertion fails, you'll see detailed logs:

```
🔍 [STEP_1_1703356800000] Starting assertion: Element to be visible
   { selector: '#submit-button', timeout: 5000 }

❌ [STEP_1_1703356800000] Assertion FAILED: Element to be visible
   {
     error: 'locator.toBeVisible: Timeout 5000ms exceeded',
     selector: '#submit-button'
   }
```

## Summary

✅ **All assertions properly fail tests** (except `softAssert`)  
✅ **Error is thrown** immediately when assertion fails  
✅ **Test execution stops** after first failure  
✅ **Detailed logs** are captured before failing  
✅ **Reports show failure** in HTML, JSON, and JUnit formats  
✅ **Stack trace** is preserved for debugging  
✅ **Screenshots** are included for UI failures  

### Assertion Types

| Assertion Type | Fails Test? | Stops Execution? | In Reports? |
|---------------|-------------|------------------|-------------|
| Regular Assertion | ✅ Yes | ✅ Yes | ✅ Yes |
| Soft Assertion | ❌ No | ❌ No | ⚠️ Logged only |

### When to Use Each

**Regular Assertions** (all methods except `softAssert`):
- Use when the condition MUST be true for the test to be meaningful
- Test fails immediately if assertion fails
- Best for critical validations

**Soft Assertions** (`softAssert`):
- Use when you want to check multiple conditions without stopping at first failure
- Test continues even if assertion fails
- Useful for comprehensive validation reports
- Note: Test framework will still mark test as failed if soft assertions fail (but execution continues)

## Troubleshooting

### "My test isn't failing when assertion fails"
**Check**:
1. Are you using `Assertions` class methods? (not raw `expect`)
2. Are you awaiting the assertion? (`await Assertions.toBeVisible(...)`)
3. Is the assertion inside a try-catch that swallows the error?

### "I don't see the failure in reports"
**Check**:
1. Run tests with `--reporter=html` to generate HTML report
2. Check `reports/html-report/index.html` for visual report
3. Verify `reports/junit-results.xml` contains the failure
4. Check terminal output for immediate feedback

### "Test passes but assertion logged as failed"
**This is expected for**:
- `softAssert()` - Intentionally doesn't fail tests
- Assertions wrapped in try-catch that don't re-throw

## Best Practices

1. ✅ **Always await assertions**
   ```typescript
   await Assertions.toBeVisible(locator); // Correct
   Assertions.toBeVisible(locator); // Wrong - won't fail test properly
   ```

2. ✅ **Let assertions fail naturally**
   ```typescript
   // Correct - let assertion fail
   await Assertions.toBeVisible(locator);
   
   // Wrong - don't catch and ignore
   try {
     await Assertions.toBeVisible(locator);
   } catch (e) {
     // Swallowing error prevents test failure
   }
   ```

3. ✅ **Use soft assertions wisely**
   ```typescript
   // Use for non-critical checks
   await Assertions.softAssert(optionalElement, 'toBeVisible');
   
   // Use regular assertion for critical checks
   await Assertions.toBeVisible(requiredElement);
   ```

## Conclusion

The Assertions utility class is properly configured to fail tests when assertions don't pass. Every assertion method (except `softAssert`) throws errors that mark tests as FAILED in all report formats. The combination of detailed logging, test.step() integration, and proper error handling ensures complete visibility of assertion failures in your test reports.
