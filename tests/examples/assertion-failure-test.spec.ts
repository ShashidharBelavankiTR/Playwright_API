import { test, expect } from '@playwright/test';
import { Assertions } from '../../src/utils/Assertions';

test.describe('Assertion Failure Behavior Verification', () => {
  test('SHOULD FAIL - Assertion fails and marks test as failed', async ({ page }) => {
    await page.goto('https://example.com');

    // This assertion will fail and mark the test as FAILED
    const nonExistentElement = page.locator('#this-element-does-not-exist');
    await Assertions.toBeVisible(nonExistentElement, 'Non-existent element check');

    // This line will never execute because the test fails above
    console.log('This should not print');
  });

  test('SHOULD PASS - Assertion succeeds and marks test as passed', async ({ page }) => {
    await page.goto('https://example.com');

    // This assertion will pass
    const heading = page.locator('h1');
    await Assertions.toBeVisible(heading, 'Heading should be visible');

    console.log('Test completed successfully');
  });

  test('SHOULD FAIL - Multiple assertions with one failure', async ({ page }) => {
    await page.goto('https://example.com');

    // First assertion passes
    const heading = page.locator('h1');
    await Assertions.toBeVisible(heading, 'Heading check');

    // Second assertion fails - test will be marked as FAILED
    await Assertions.toHaveText(heading, 'Wrong Text That Does Not Exist', 'Text check');

    // This will never execute
    console.log('This should not print');
  });

  test('SHOULD PASS - Soft assertion does not fail test', async ({ page }) => {
    await page.goto('https://example.com');

    // Soft assertion fails but doesn't stop test execution
    const nonExistent = page.locator('#does-not-exist');
    await Assertions.softAssert(nonExistent, 'toBeVisible', undefined, 'Soft check');

    // This WILL execute because soft assertions don't throw
    console.log('Test continues after soft assertion failure');

    // Regular assertion passes
    const heading = page.locator('h1');
    await Assertions.toBeVisible(heading, 'Final check');
  });

  test('SHOULD FAIL - API assertion fails and marks test as failed', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    // This will fail because status is 200, not 404
    await Assertions.toHaveStatusCode(response, 404, 'Expected 404 status');

    // This will never execute
    console.log('This should not print');
  });

  test('SHOULD FAIL - Generic assertion fails and marks test as failed', async ({ page }) => {
    const actualValue = 10;
    const expectedValue = 20;

    // This will fail and mark test as FAILED
    await Assertions.assertEqual(actualValue, expectedValue, 'Number comparison');

    // This will never execute
    console.log('This should not print');
  });
});
