import { expect, test } from '@playwright/test';

test('legal pages are reachable, localized, and readable on direct visits', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'Covered at desktop and the narrowest phone width.');
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Impressum', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Impressum');
  await expect(page.locator('address')).toContainText('20459 Hamburg');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page).toHaveTitle('Imprint — surpr.');
  for (const [label, path, heading] of [
    ['Privacy', '/privacy', 'Privacy policy'],
    ['Terms of use', '/terms', 'Terms of use'],
    ['Support', '/support', 'Need a hand?'],
    ['Delete data', '/delete', 'Your data. Your choice.'],
  ]) {
    await page.getByRole('navigation', { name: 'Legal & help', exact: true }).getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('main').innerText()).not.toContain('legal.');
  }
  await page.getByRole('button', { name: 'Reset saved preferences' }).click();
  await expect(page.getByRole('status')).toContainText('have been removed');
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Datenschutzerklärung');
  await expect(page.locator('main')).toContainText('Server in Deutschland');
  await expect(page.locator('main')).toContainText('surpr.sound');
  await page.screenshot({ path: testInfo.outputPath('privacy.png'), fullPage: true });
  expect(errors).toEqual([]);
});
