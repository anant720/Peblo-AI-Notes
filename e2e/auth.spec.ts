import { test, expect } from '@playwright/test';

test.describe('Authentication and Navigation Flow', () => {
  test('User can navigate to signup and see the form', async ({ page }) => {
    await page.goto('/');
    
    // Check landing page
    await expect(page.getByRole('heading', { name: /Peblo Notes/i }).first()).toBeVisible();
    
    // Navigate to signup
    await page.goto('/signup');
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
    await expect(page.getByPlaceholder('john@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /Create account/i })).toBeVisible();
  });
});
