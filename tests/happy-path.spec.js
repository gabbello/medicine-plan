import { test, expect } from '@playwright/test';

test.describe('MedPlan Happy Path Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear storage before each test using Playwright's API
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // localStorage may not be accessible in some contexts
      }
    });
  });

  test('Home page loads and displays correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await expect(page.locator('h1:has-text("MedPlan")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Build your personal medication schedule')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Create my plan")')).toBeVisible({ timeout: 5000 });
  });

  test('Create plan with all periods', async ({ page }) => {
    await page.goto('/');

    // Click "Create my plan"
    await page.click('button:has-text("Create my plan")');

    // Should be on Step 1: Select periods
    await expect(page.locator('text=When do you take medicine?')).toBeVisible();

    // Select all three periods
    await page.click('button[data-period="morning"]');
    await expect(page.locator('button[data-period="morning"]')).toHaveClass(/selected/);

    await page.click('button[data-period="afternoon"]');
    await expect(page.locator('button[data-period="afternoon"]')).toHaveClass(/selected/);

    await page.click('button[data-period="evening"]');
    await expect(page.locator('button[data-period="evening"]')).toHaveClass(/selected/);

    // Next button should be enabled
    const nextBtn = page.locator('#btn-step1-next');
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Should be on Step 2: Add medicines
    await expect(page.locator('text=Add your medicines')).toBeVisible();
  });

  test('Add medicines with different durations', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Create my plan")');

    // Select periods on Step 1
    await page.click('button[data-period="morning"]');
    await page.click('button[data-period="afternoon"]');
    await page.click('button[data-period="evening"]');
    await page.click('#btn-step1-next');

    // Add first medicine - ongoing
    await page.fill('#med-name', 'Aspirin');
    await page.fill('#med-amount', '1');
    await page.fill('#med-unit', 'tablet');

    // Select morning and evening for this medicine
    await page.click('button.period-check[data-period="morning"]');
    await page.click('button.period-check[data-period="evening"]');

    // Keep it as Ongoing (default)
    await page.click('#btn-add-med');

    // Wait for medicine to be added
    await expect(page.locator('text=Aspirin')).toBeVisible();

    // Add second medicine - limited duration
    await page.fill('#med-name', 'Ibuprofen');
    await page.fill('#med-amount', '2');
    await page.fill('#med-unit', 'tablets');

    // Select all periods
    await page.click('button.period-check[data-period="morning"]');
    await page.click('button.period-check[data-period="afternoon"]');
    await page.click('button.period-check[data-period="evening"]');

    // Switch to limited duration
    await page.click('button[data-val="days"]');
    await page.fill('#duration-days', '7');

    await page.click('#btn-add-med');

    // Wait for second medicine to be added
    await expect(page.locator('text=Ibuprofen')).toBeVisible();

    // Create plan
    const submitBtn = page.locator('#btn-submit');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Should navigate to dashboard
    await expect(page.locator('button.tab-btn[data-period="morning"]')).toBeVisible({ timeout: 5000 });
  });

  test('Dashboard displays medicines by period', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Create my plan")');

    // Select periods and add medicine
    await page.click('button[data-period="morning"]');
    await page.click('button[data-period="afternoon"]');
    await page.click('#btn-step1-next');

    await page.fill('#med-name', 'Vitamin C');
    await page.fill('#med-amount', '1000');
    await page.fill('#med-unit', 'mg');

    await page.click('button.period-check[data-period="morning"]');
    await page.click('button.period-check[data-period="afternoon"]');

    await page.click('#btn-add-med');
    await page.click('#btn-submit');

    // Dashboard should show tabs for selected periods
    await expect(page.locator('button.tab-btn[data-period="morning"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button.tab-btn[data-period="afternoon"]')).toBeVisible();

    // Check if medicine appears in tabs
    const morningTab = page.locator('button:has-text("Morning")');
    await morningTab.click();
    await expect(page.locator('text=Vitamin C')).toBeVisible();
  });

  test('Mark medicine as taken', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Create my plan")');

    // Setup plan
    await page.click('button[data-period="morning"]');
    await page.click('#btn-step1-next');

    await page.fill('#med-name', 'Paracetamol');
    await page.fill('#med-amount', '500');
    await page.fill('#med-unit', 'mg');

    await page.click('button.period-check[data-period="morning"]');

    await page.click('#btn-add-med');
    await page.click('#btn-submit');

    // Mark medicine as taken
    await expect(page.locator('.dash-card-name:has-text("Paracetamol")')).toBeVisible({ timeout: 5000 });

    const card = page.locator('.dash-card').first();
    await card.click();

    // Verify card is marked as taken (has 'taken' class)
    await expect(card).toHaveClass(/taken/);

    // Reload page and verify status persists
    await page.reload();
    await expect(card).toHaveClass(/taken/);
  });

  test('Share plan generates link', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Create my plan")');

    // Create simple plan
    await page.click('button[data-period="morning"]');
    await page.click('#btn-step1-next');

    await page.fill('#med-name', 'Lisinopril');
    await page.fill('#med-amount', '10');
    await page.fill('#med-unit', 'mg');

    await page.click('button.period-check[data-period="morning"]');

    await page.click('#btn-add-med');
    await page.click('#btn-submit');

    // Click share button
    await expect(page.locator('button:has-text("Share plan")')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Share plan")');

    // Share dialog should appear
    const shareDialog = page.locator('#share-overlay');
    await expect(shareDialog).toBeVisible();

    // Link field should contain a URL
    const linkField = page.locator('#share-link-field');
    const linkText = await linkField.inputValue();

    expect(linkText).toContain('med-plan.uk');
    expect(linkText).toContain('plan=');

    // Close dialog
    await page.click('button:has-text("Close")');
    await expect(shareDialog).not.toBeVisible();
  });

  test('Reset plan clears all data', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Create my plan")');

    // Create plan
    await page.click('button[data-period="morning"]');
    await page.click('#btn-step1-next');

    await page.fill('#med-name', 'Metformin');
    await page.fill('#med-amount', '500');
    await page.fill('#med-unit', 'mg');

    await page.click('button.period-check[data-period="morning"]');

    await page.click('#btn-add-med');
    await page.click('#btn-submit');

    // Wait for dashboard
    await expect(page.locator('.dash-card-name:has-text("Metformin")')).toBeVisible({ timeout: 5000 });

    // Click reset button
    await page.click('button:has-text("Reset plan")');

    // Confirm reset
    const resetDialog = page.locator('#reset-overlay');
    await expect(resetDialog).toBeVisible();
    await page.click('button:has-text("Yes, reset everything")');

    // Should return to home screen
    await expect(page.locator('text=Build your personal medication schedule')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Create my plan")')).toBeVisible();
  });

  test('Import plan from URL', async ({ page }) => {
    // First create a plan and get the share URL
    await page.goto('/');
    await page.click('button:has-text("Create my plan")');

    await page.click('button[data-period="morning"]');
    await page.click('#btn-step1-next');

    await page.fill('#med-name', 'Atorvastatin');
    await page.fill('#med-amount', '20');
    await page.fill('#med-unit', 'mg');

    await page.click('button.period-check[data-period="morning"]');

    await page.click('#btn-add-med');
    await page.click('#btn-submit');

    // Get share link
    await expect(page.locator('button:has-text("Share plan")')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Share plan")');

    const linkField = page.locator('#share-link-field');
    const shareUrl = await linkField.inputValue();

    // Open in new context to simulate importing
    const newContext = await page.context().browser().newContext();
    const newPage = await newContext.newPage();

    // Extract just the plan parameter
    const urlObj = new URL(shareUrl, page.url());
    const planParam = urlObj.searchParams.get('plan');

    await newPage.goto(`/?plan=${planParam}`);

    // Dashboard should load with the plan
    await expect(newPage.locator('.dash-card-name:has-text("Atorvastatin")')).toBeVisible({ timeout: 5000 });

    await newContext.close();
  });
});
