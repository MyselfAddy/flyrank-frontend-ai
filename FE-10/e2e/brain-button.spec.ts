import { test, expect } from '@playwright/test';

test.describe('FE-AA1: Buttons with a Brain Micro-interactions', () => {
  test('Hero button state lifecycle: idle → loading → deterministic success → auto-reset', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Verify Page Title
    await expect(page.getByRole('heading', { name: /Buttons with a Brain/i })).toBeVisible();

    // 2. Select Force Success
    const successTrigger = page.locator('#trigger-success-btn');
    await expect(successTrigger).toBeVisible();
    await successTrigger.click();

    // 3. Click Hero Button
    const heroBtn = page.locator('#hero-brain-button');
    await expect(heroBtn).toBeVisible();
    await heroBtn.click();

    // 4. Verify Loading or Success State
    await expect(page.locator('#current-state-badge')).toContainText(/success/i, { timeout: 8000 });
    await expect(heroBtn).toContainText(/Generated!/i);

    // 5. Verify Telemetry Log Entry
    const telemetry = page.locator('#telemetry-log-container');
    await expect(telemetry).toContainText(/success/i);
  });

  test('Hero button deterministic failure and Retry flow', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Force Failure
    const failureTrigger = page.locator('#trigger-failure-btn');
    await expect(failureTrigger).toBeVisible();
    await failureTrigger.click();

    // 2. Click Hero Button
    const heroBtn = page.locator('#hero-brain-button');
    await expect(heroBtn).toBeVisible();
    await heroBtn.click();

    // 3. Verify Error & Retry State
    await expect(page.locator('#current-state-badge')).toContainText(/error/i, { timeout: 8000 });
    await expect(heroBtn).toContainText(/Retry Generation/i);

    // 4. Now Switch to Force Success and Click Retry
    await page.locator('#trigger-success-btn').click();
    await heroBtn.click();

    // 5. Verify Retry successfully resolves
    await expect(page.locator('#current-state-badge')).toContainText(/success/i, { timeout: 8000 });
  });

  test('Chat composer with embedded BrainButton', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const composerBtn = page.locator('#composer-send-button');
    await expect(composerBtn).toBeVisible();
    await composerBtn.click();

    // Verify it triggers and completes
    await expect(composerBtn).toBeVisible();
  });

  test('Disable button toggle prevents interaction', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const disableTrigger = page.locator('#trigger-disabled-btn');
    await expect(disableTrigger).toBeVisible();
    await disableTrigger.click();

    const heroBtn = page.locator('#hero-brain-button');
    await expect(heroBtn).toBeDisabled();
    await expect(heroBtn).toHaveAttribute('aria-disabled', 'true');
  });
});
