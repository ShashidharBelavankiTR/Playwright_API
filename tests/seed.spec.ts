import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // generate code here.
    await page.goto('https://www.google.com');
    await page.close();
  });
});
