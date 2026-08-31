# GitHub Actions Happy Path Testing

This project includes automated happy path tests using Playwright that run on-demand via GitHub Actions.

## Running Tests

### From GitHub UI
1. Go to **Actions** tab on your GitHub repository
2. Select **"Happy Path Test"** workflow
3. Click **"Run workflow"** button
4. Optionally specify a custom URL to test (defaults to production: `https://www.med-plan.uk`)
5. Click **"Run workflow"**

### From Local Machine
```bash
npm ci
npm run test:happy-path
```

Or test a specific URL:
```bash
TEST_URL=http://localhost:3000 npm run test:happy-path
```

## What Gets Tested

The happy path test suite covers:

1. ✅ Home page loads correctly
2. ✅ Create plan with all periods (morning, afternoon, evening)
3. ✅ Add medicines with different durations (ongoing and limited)
4. ✅ Dashboard displays medicines organized by period
5. ✅ Mark medicines as taken (with persistence across page reloads)
6. ✅ Share plan generates valid shareable link
7. ✅ Reset plan clears all data
8. ✅ Import plan from shared URL

## Test Results

After the workflow runs, results are available as:
- **HTML Report**: Download from artifacts (detailed visual report)
- **JSON Results**: Raw test data for CI/CD integration
- **JUnit XML**: Compatible with most CI systems
- **Workflow Summary**: Quick overview in the workflow run page

## Adding More Tests

Edit `tests/happy-path.spec.js` to add new test cases. Follow the existing pattern:

```javascript
test('Description of what you are testing', async ({ page }) => {
  await page.goto('/');
  // Add test steps here
});
```

## Troubleshooting

- **Tests timeout**: Increase `timeout` in `playwright.config.js`
- **Selectors not found**: Verify the HTML structure hasn't changed significantly
- **Local testing fails**: Ensure your dev server is running at the specified URL
