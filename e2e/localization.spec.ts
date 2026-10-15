import { expect, test } from '@playwright/test';
test.use({ locale: 'en-GB' });

test('browser language, lazy resources, persisted switch and authored text', async ({ page }) => {
  const resources: string[] = [];
  page.on('request', (request) => {
    const locale = request.url().match(/\/locales\/(de|en)\.json/);
    if (locale) resources.push(locale[1]);
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Open your surprise/ })).toBeVisible();
  expect(resources).toEqual(['en']);
  await page.getByLabel('03 / Your secret message').fill('My own message 🎃');
  await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  expect(resources).toEqual(['en', 'de']);
  await expect(page.getByLabel('03 / Deine geheime Nachricht')).toHaveValue('My own message 🎃');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(resources).toEqual(['en', 'de']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('surpr.locale'))).toBe('de');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('button', { name: /Überraschung öffnen/ })).toBeVisible();
});

test('English card completes all five scenes', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.getByRole('button', { name: /Open your surprise/ }).click();
  await expect(page.getByRole('heading', { name: 'Dare to knock?' })).toBeVisible();
  await page.getByRole('button', { name: /Knock & open/ }).click();
  await expect(page.getByRole('heading', { name: 'Boo, Sophie!' })).toBeVisible();
  await page.getByRole('button', { name: /Read your message/ }).click();
  await expect(page.locator('.personal-message')).toContainText('You owe me a handful of candy');
  await page.getByRole('button', { name: /The grand finale/ }).click();
  await expect(page.getByRole('heading', { name: 'Happy Halloween!' })).toBeVisible();
  await page.getByRole('button', { name: /Play it again/ }).click();
  await expect(page.getByRole('button', { name: /Open your surprise/ })).toBeVisible();
});
