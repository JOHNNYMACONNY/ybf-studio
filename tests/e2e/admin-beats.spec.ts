import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';

test.describe('Admin Beats CRUD', () => {
  test.beforeEach(async ({ page, baseURL, request }) => {
    // Mint a test session token via test-login
    await request.post('/api/test-login', { data: { email: ADMIN_EMAIL } });
    await page.goto(baseURL || 'http://localhost:3000');
  });

  test('can sign in (credentials), add, edit, delete a beat', async ({ page }) => {
    // Navigate to admin (session already established via cookie)
    await page.goto('/admin');

    // Go to beats page
    await page.goto('/admin/beats');
    await page.getByRole('button', { name: /add new beat/i }).click();

    // Fill form
    await page.getByLabel(/title/i).fill('E2E Test Beat');
    await page.getByLabel(/^artist/i).fill('E2E Artist');
    await page.getByLabel(/bpm/i).fill('120');
    await page.getByLabel(/mp3 \(\$\)/i).fill('19');
    await page.getByLabel(/wav \(\$\)/i).fill('29');
    await page.getByLabel(/premium \(\$\)/i).fill('49');
    await page.getByLabel(/exclusive \(\$\)/i).fill('199');
    await page.getByRole('button', { name: /add beat|update beat/i }).click();

    // Toast success
    await expect(page.getByText(/beat added successfully|updated successfully/i)).toBeVisible();

    // Edit the created card (first card assumed)
    const firstCard = page.locator('[data-testid="beat-card"]').first();
    await firstCard.hover();
    await firstCard.getByRole('button', { name: /edit/i }).click();
    await page.getByLabel(/title/i).fill('E2E Test Beat (Edited)');
    await page.getByRole('button', { name: /update beat/i }).click();
    await expect(page.getByText(/beat updated successfully/i)).toBeVisible();

    // Delete
    await firstCard.hover();
    page.once('dialog', dialog => dialog.accept());
    await firstCard.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText(/beat deleted/i)).toBeVisible();
  });
});


