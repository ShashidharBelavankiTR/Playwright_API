# BasePage Enhanced Element Interaction

## Overview
All interaction methods in BasePage have been enhanced to wait for proper element states (visibility, enabled, editable) before performing actions. This ensures more reliable and stable test execution by preventing interaction with elements that are not ready.

## Enhanced Methods

### 1. Click Methods
All click-related methods now wait for elements to be:
- **Visible** - Element must be on screen
- **Enabled** - Element must not be disabled

#### Methods Updated:
- `click()` - Standard click with visibility & enabled checks
- `doubleClick()` - Double-click with same checks
- `rightClick()` - Right-click with same checks
- `multiClick()` - Multiple clicks with visibility checks
- `clickWithModifier()` - Click with keyboard modifier (Ctrl/Shift/Alt) with visibility checks

```typescript
// Example: click method now waits for visibility and enabled state
async click(locator: Locator | string, options?: ClickOptions): Promise<void> {
  await element.waitFor({ state: 'visible', timeout: 10000 });
  await WaitHelper.waitForCondition(async () => {
    return await element.isEnabled();
  }, 5000, 200);
  await element.click(options);
}
```

### 2. Input Methods
All input-related methods now wait for elements to be:
- **Visible** - Element must be on screen
- **Editable** - Element must be in editable state (not readonly/disabled)

#### Methods Updated:
- `fill()` - Fill text input with visibility & editable checks
- `clear()` - Clear input with visibility & editable checks
- `type()` - Type text with delay, with visibility & enabled checks

```typescript
// Example: fill method now ensures element is editable
async fill(locator: Locator | string, text: string): Promise<void> {
  await element.waitFor({ state: 'visible', timeout: 10000 });
  
  // Check if element is editable before filling
  const isEditable = await element.isEditable();
  if (!isEditable) {
    throw new Error(`Element ${selector} is not editable`);
  }
  
  await element.fill(text);
}
```

### 3. Selection Methods
Selection methods now wait for:
- **Visibility** - Element must be visible
- **Enabled** - Element must be enabled

#### Methods Updated:
- `selectOption()` - Select dropdown option with checks
- `check()` - Check checkbox with visibility & enabled checks
- `uncheck()` - Uncheck checkbox with visibility & enabled checks

### 4. Interaction Methods
Other interaction methods enhanced with appropriate waits:

#### Methods Updated:
- `hover()` - Wait for visibility before hovering
- `focus()` - Wait for visibility before focusing
- `uploadFile()` - Wait for visibility, attached state, and enabled before file upload
- `dragAndDrop()` - Wait for both source and target elements to be visible and enabled

```typescript
// Example: dragAndDrop with full validation
async dragAndDrop(source: Locator | string, target: Locator | string): Promise<void> {
  // Wait for source element to be visible and enabled
  await sourceElement.waitFor({ state: 'visible', timeout: 10000 });
  await WaitHelper.waitForCondition(async () => {
    return await sourceElement.isEnabled();
  }, 5000, 200);
  
  // Wait for target element to be visible
  await targetElement.waitFor({ state: 'visible', timeout: 10000 });
  
  await sourceElement.dragTo(targetElement);
}
```

## Benefits

### 1. **Improved Reliability**
- Tests are less flaky because elements are verified to be in the correct state before interaction
- Automatic waiting prevents timing issues in dynamic applications

### 2. **Better Error Messages**
- Clear error messages when elements are not in the expected state
- Screenshots automatically captured on failures for debugging

### 3. **Retry Logic**
- Built-in retry mechanism with exponential backoff (2 retries with 500ms delay)
- Handles transient UI states gracefully

### 4. **Consistent Behavior**
- All interaction methods follow the same pattern
- Predictable waiting behavior across the framework

## Wait Conditions Used

### Element States
- **visible** - Element is visible in the viewport
- **attached** - Element is attached to the DOM
- **enabled** - Element is not disabled
- **editable** - Element can accept input (not readonly)

### Timeouts
- **Primary wait**: 10000ms (10 seconds) for element state
- **Condition check**: 5000ms (5 seconds) for enabled/editable validation
- **Retry delay**: 500ms between retries
- **Max retries**: 2 attempts

## Usage Examples

### Basic Click with Auto-Wait
```typescript
// Old way - manual waiting
await page.waitForSelector('#submit-btn');
await basePage.click('#submit-btn');

// New way - automatic waiting built-in
await basePage.click('#submit-btn'); // Waits for visibility & enabled state automatically
```

### Fill Input with Auto-Wait
```typescript
// Old way - manual checks
await page.waitForSelector('#username');
const isEditable = await page.locator('#username').isEditable();
if (isEditable) {
  await basePage.fill('#username', 'testuser');
}

// New way - automatic validation
await basePage.fill('#username', 'testuser'); // Validates editable state automatically
```

### Drag and Drop with Auto-Wait
```typescript
// Old way - multiple manual waits
await page.waitForSelector('#source');
await page.waitForSelector('#target');
await basePage.dragAndDrop('#source', '#target');

// New way - automatic waiting for both elements
await basePage.dragAndDrop('#source', '#target'); // Waits for both elements automatically
```

### Upload File with Auto-Wait
```typescript
// Old way - manual state checks
await page.waitForSelector('input[type="file"]');
await basePage.uploadFile('input[type="file"]', './test.pdf');

// New way - automatic validation
await basePage.uploadFile('input[type="file"]', './test.pdf'); // Validates visibility & enabled state
```

## Error Handling

All enhanced methods provide detailed error messages:

```typescript
// Example error when element is not editable
Error: Element #readonly-field is not editable
  at BasePage.fill (BasePage.ts:350)
  Screenshot saved: fill-error-1234567890.png

// Example error when element is not enabled
Error: Failed to click on #disabled-button: Element is not enabled after 5000ms
  at BasePage.click (BasePage.ts:250)
  Screenshot saved: click-error-1234567890.png
```

## Best Practices

### 1. Trust the Built-in Waits
```typescript
// ❌ Don't add manual waits
await page.waitForSelector('#button');
await basePage.click('#button');

// ✅ Use the method directly
await basePage.click('#button');
```

### 2. Let the Framework Handle Retries
```typescript
// ❌ Don't wrap in custom retry logic
for (let i = 0; i < 3; i++) {
  try {
    await basePage.click('#flaky-button');
    break;
  } catch (e) {
    // retry
  }
}

// ✅ Built-in retry handles this
await basePage.click('#flaky-button');
```

### 3. Use Appropriate Methods for Actions
```typescript
// ❌ Don't use raw Playwright when BasePage method exists
await page.locator('#input').fill('text');

// ✅ Use BasePage method with built-in waits
await basePage.fill('#input', 'text');
```

## Migration Guide

If you have existing tests with manual waits, you can safely remove them:

### Before Enhancement
```typescript
test('login test', async ({ page }) => {
  const basePage = new BasePage(page);
  
  // Manual waits everywhere
  await page.waitForSelector('#username', { state: 'visible' });
  await page.waitForSelector('#username', { state: 'attached' });
  await basePage.fill('#username', 'user@test.com');
  
  await page.waitForSelector('#password', { state: 'visible' });
  await basePage.fill('#password', 'password123');
  
  await page.waitForSelector('#login-btn', { state: 'visible' });
  const btn = page.locator('#login-btn');
  await btn.waitFor({ state: 'attached' });
  if (await btn.isEnabled()) {
    await basePage.click('#login-btn');
  }
});
```

### After Enhancement
```typescript
test('login test', async ({ page }) => {
  const basePage = new BasePage(page);
  
  // Clean and simple - waits are built-in
  await basePage.fill('#username', 'user@test.com');
  await basePage.fill('#password', 'password123');
  await basePage.click('#login-btn');
});
```

## Technical Implementation Details

### Wait Pattern
All methods follow this pattern:
1. Resolve the locator (string or Locator object)
2. Wrap the action in `WaitHelper.retryWithBackoff()` (2 retries, 500ms delay)
3. Wait for element state: `element.waitFor({ state: 'visible', timeout: 10000 })`
4. Validate enabled/editable state with `WaitHelper.waitForCondition()`
5. Perform the action
6. Log success or capture screenshot on failure

### Performance Impact
- **Minimal overhead**: Waits only happen when needed
- **Smart retries**: Exponential backoff prevents hammering the page
- **Configurable timeouts**: Can be adjusted in WaitHelper if needed

## Troubleshooting

### Element Not Visible After 10s
**Issue**: `TimeoutError: Element not visible after 10000ms`
**Solution**: 
- Check if element is actually present in the DOM
- Verify element is not hidden by CSS (display: none, visibility: hidden)
- Increase timeout in BasePage configuration if page is genuinely slow

### Element Not Editable
**Issue**: `Error: Element #field is not editable`
**Solution**:
- Check if element has `readonly` attribute
- Verify element is not disabled
- Ensure correct selector targets the input element, not a wrapper

### Element Not Enabled
**Issue**: `Error: Element is not enabled after 5000ms`
**Solution**:
- Check if element has `disabled` attribute
- Verify page JavaScript hasn't disabled the element
- Wait for page state to change before attempting interaction

## Summary

All BasePage interaction methods now have built-in smart waiting that:
- ✅ Waits for elements to be visible
- ✅ Validates elements are enabled/editable before interaction
- ✅ Retries automatically with exponential backoff
- ✅ Provides clear error messages with screenshots
- ✅ Reduces test flakiness significantly
- ✅ Simplifies test code by removing manual waits

This enhancement makes the framework more robust and test code cleaner and more maintainable.
