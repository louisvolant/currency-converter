import { test, expect, type Page } from '@playwright/test';

const MOCK_RATES = {
  date: '2026-11-19',
  eur: {
    eur: 1,
    usd: 1.1,
    gbp: 0.85,
    jpy: 165.5,
  },
};

const MOCK_NAMES = {
  eur: 'Euro',
  usd: 'US Dollar',
  gbp: 'British Pound',
  jpy: 'Japanese Yen',
};

async function mockCurrencyApi(page: Page) {
  await page.route('https://cdn.jsdelivr.net/**', async (route) => {
    const url = route.request().url();
    if (url.endsWith('/currencies/eur.json')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_RATES),
      });
      return;
    }
    if (url.endsWith('/currencies.json')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_NAMES),
      });
      return;
    }
    await route.abort();
  });
}

test.describe('Currency Converter', () => {
  test.beforeEach(async ({ page }) => {
    await mockCurrencyApi(page);
  });

  test('renders base EUR line, converts values bidirectionally, and persists lines', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Currency Converter' })).toBeVisible();
    const eurInput = page.getByLabel('Value for EUR');
    await expect(eurInput).toHaveValue('1');

    // Open currency adder and add USD
    await page.getByRole('button', { name: 'Add Currency' }).click();
    const searchInput = page.getByPlaceholder('Search currency (USD, Euro, Yen...)');
    await searchInput.fill('USD');
    await page.getByRole('button', { name: /USD.*US Dollar/i }).click();

    const usdInput = page.getByLabel('Value for USD');
    await expect(usdInput).toHaveValue('1.1');
    await expect(page.getByText('1€ = 1.1000 USD')).toBeVisible();

    // Update EUR -> recalculates USD
    await eurInput.fill('10');
    await expect(usdInput).toHaveValue('11');

    // Update USD -> recalculates EUR
    await usdInput.fill('22');
    await expect(eurInput).toHaveValue('20');

    // Reload and verify IndexedDB persistence
    await page.reload();
    await expect(page.getByLabel('Value for EUR')).toHaveValue('20');
    await expect(page.getByLabel('Value for USD')).toHaveValue('22');

    // Remove USD line via its trash button
    const usdRow = page.locator('div.rounded-xl', { hasText: '1€ = 1.1000 USD' });
    await usdRow.locator('button').last().click();
    await expect(page.getByLabel('Value for USD')).toHaveCount(0);

    expect(pageErrors).toEqual([]);
  });

  test('toggles dark mode and exposes personal footer links', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const initialDark = await html.evaluate((el) => el.classList.contains('dark'));

    const themeButton = page.getByRole('button', { name: /Mode$/i });
    await themeButton.click();

    const afterToggleDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(afterToggleDark).toBe(!initialDark);

    const personalLink = page.getByRole('link', { name: 'Page personnelle' });
    await expect(personalLink).toHaveAttribute('href', 'https://www.louisvolant.com');
    await expect(personalLink).toHaveAttribute('target', '_blank');

    const portfolioLink = page.getByRole('link', { name: 'Portfolio' });
    await expect(portfolioLink).toHaveAttribute('href', 'https://www.louisvolant.com/portfolio');
    await expect(portfolioLink).toHaveAttribute('target', '_blank');
  });

  test('serves valid PWA manifest and service worker assets', async ({ request }) => {
    const manifestRes = await request.get('/manifest.json');
    expect(manifestRes.ok()).toBeTruthy();
    const manifest = await manifestRes.json();
    expect(manifest.name).toBe('Currency Converter');

    const swRes = await request.get('/sw.js');
    expect(swRes.ok()).toBeTruthy();
  });
});
