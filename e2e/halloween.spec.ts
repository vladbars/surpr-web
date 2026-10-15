import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const card = page.locator('.halloween-card');
  expect(await card.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
}

test('five scenes, replay and responsive layout', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Hey Sophie…' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('intro.png'), fullPage: true });

  const selectedCharacter = testInfo.project.name === 'desktop' ? ['Geist', 'ghost'] : testInfo.project.name === 'phone' ? ['Kürbis', 'pumpkin'] : ['Vampir', 'vampire'];
  const [label, value] = selectedCharacter;
  await page.getByRole('radio', { name: label }).check();
  await page.getByRole('button', { name: /Vorschau ansehen/ }).click();
  await expectNoOverflow(page);
  await page.getByRole('button', { name: /Überraschung öffnen/ }).click();
  await expect(page.getByRole('heading', { name: 'Traust du dich?' })).toBeFocused();
  await page.locator('.halloween-card').screenshot({ path: testInfo.outputPath('door.png') });
  await page.getByRole('button', { name: /Anklopfen/ }).click();
  await expect(page.locator(`.halloween-card [data-character="${value}"]`)).toBeVisible();
  await page.locator('.halloween-card').screenshot({ path: testInfo.outputPath('reveal.png') });
  await expectNoOverflow(page);
  await page.getByRole('button', { name: /Nachricht lesen/ }).click();
  await expect(page.locator('.personal-message > [aria-hidden="true"]')).toContainText('Süßigkeiten');
  if (testInfo.project.name === 'desktop') await page.locator('.halloween-card').screenshot({ path: testInfo.outputPath('message.png') });
  await page.getByRole('button', { name: /Zum großen Finale/ }).click();
  await expect(page.getByRole('heading', { name: 'Happy Halloween!' })).toBeVisible();
  if (testInfo.project.name === 'desktop') await page.locator('.halloween-card').screenshot({ path: testInfo.outputPath('end.png') });
  await expectNoOverflow(page);
  await page.getByRole('button', { name: /Noch einmal ansehen/ }).click();
  await expect(page.getByRole('heading', { name: 'Hey Sophie…' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('long personalized text stays inside the card and HTML is rendered literally', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'narrow-phone', 'Covered on the narrowest viewport.');
  await page.goto('/');
  const name = '<img src=x onerror=alert(1)>';
  const message = '<script>alert(1)</script>\n' + '🧡'.repeat(100);
  await page.getByLabel('01 / Für wen?').fill(name);
  await page.getByLabel('03 / Deine geheime Nachricht').fill(message);
  await page.getByRole('button', { name: /Vorschau ansehen/ }).click();
  await expect(page.getByRole('heading', { name: `Hey ${name}…` })).toBeVisible();
  await expectNoOverflow(page);
  await page.getByRole('button', { name: /Überraschung öffnen/ }).click();
  await page.getByRole('button', { name: /Anklopfen/ }).click();
  await page.getByRole('button', { name: /Nachricht lesen/ }).click();
  await expect(page.locator('.personal-message > [aria-hidden="true"]')).toHaveText(message);
  await expect(page.locator('.halloween-card img, .halloween-card script')).toHaveCount(0);
  await expectNoOverflow(page);
});

test('normal motion opens the door, types the message and replays', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'Covered on desktop and the narrowest viewport.');
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => localStorage.setItem('surpr.sound', 'off'));
  await page.goto('/');
  for (let cycle = 0; cycle < 3; cycle++) {
    await expect(page.getByRole('heading', { name: 'Hey Sophie…' })).toBeVisible();
    // Check the artwork itself: the heading can be visible while the ticket
    // has drifted out of the clipped illustration after replay.
    await expect.poll(async () => page.locator('.ticket-float').evaluate((ticket) => {
      const art = ticket.closest('.scene-art')!.getBoundingClientRect();
      const bounds = ticket.getBoundingClientRect();
      return Math.abs(bounds.x + bounds.width / 2 - art.x - art.width / 2);
    }), { message: `Invitation stays centered on play ${cycle + 1}` }).toBeLessThan(15);
    await page.getByRole('button', { name: /Überraschung öffnen/ }).click();
    await page.getByRole('button', { name: /Anklopfen/ }).click();
    await expect(page.getByRole('heading', { name: 'Buh, Sophie!' })).toBeVisible({ timeout: 20000 });
    await page.getByRole('button', { name: /Nachricht lesen/ }).click();
    await expect(page.locator('.personal-message > [aria-hidden="true"]')).toContainText('Happy Halloween!', { timeout: 20000 });
    await page.getByRole('button', { name: /Zum großen Finale/ }).click();
    // An off-center click leaves a nonzero pointer-parallax offset on replay.
    await page.getByRole('button', { name: /Noch einmal ansehen/ }).click({ position: { x: 24, y: 20 } });
  }
});

test('audio defaults on, starts with the first card gesture, mutes and closes on replacement', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Audio lifecycle is independent of viewport.');
  await page.addInitScript(() => {
    const native = window.AudioContext;
    const audit = { contexts: 0, starts: 0, closed: 0, decoded: [] as { duration: number; peak: number }[] };
    (window as Window & { audioAudit?: typeof audit }).audioAudit = audit;
    class ObservedAudioContext extends native {
      constructor(options?: AudioContextOptions) { super(options); audit.contexts++; }
      async decodeAudioData(data: ArrayBuffer) {
        const buffer = await super.decodeAudioData(data);
        let peak = 0;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          for (const value of buffer.getChannelData(channel)) peak = Math.max(peak, Math.abs(value));
        }
        audit.decoded.push({ duration: buffer.duration, peak });
        return buffer;
      }
      createOscillator() {
        const source = super.createOscillator();
        const start = source.start.bind(source);
        source.start = (when = 0) => { audit.starts++; start(when); };
        return source;
      }
      createBufferSource() {
        const source = super.createBufferSource();
        const start = source.start.bind(source);
        source.start = (when = 0) => { audit.starts++; start(when); };
        return source;
      }
      close() { audit.closed++; return super.close(); }
    }
    window.AudioContext = ObservedAudioContext;
  });
  const audit = () => page.evaluate(() => (window as Window & { audioAudit?: { contexts: number; starts: number; closed: number; decoded: { duration: number; peak: number }[] } }).audioAudit!);
  await page.goto('/');
  expect((await audit()).contexts).toBe(0);
  await expect(page.getByRole('button', { name: 'Ton ausschalten' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Überraschung öffnen/ }).click();
  await expect.poll(async () => (await audit()).decoded.length, { timeout: 15000 }).toBe(3);
  await expect(page.getByRole('button', { name: 'Ton ausschalten' })).toHaveAttribute('aria-pressed', 'true', { timeout: 15000 });
  const voices = (await audit()).decoded;
  expect(voices).toHaveLength(3);
  for (const voice of voices) {
    expect(voice.duration).toBeGreaterThan(1);
    expect(voice.duration).toBeLessThan(2);
    expect(voice.peak).toBeGreaterThan(0.4);
    expect(voice.peak).toBeLessThan(0.95);
  }
  expect((await audit()).starts).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Anklopfen/ }).click();
  await expect(page.getByRole('button', { name: 'Geist antippen' })).toBeVisible();
  await page.getByRole('button', { name: 'Geist antippen' }).click();
  await page.getByRole('button', { name: 'Ton ausschalten' }).click();
  const mutedStarts = (await audit()).starts;
  await page.getByRole('button', { name: /Nachricht lesen/ }).click();
  expect((await audit()).starts).toBe(mutedStarts);
  await page.getByRole('button', { name: /Vorschau ansehen/ }).click();
  await expect(page.getByRole('button', { name: 'Ton einschalten' })).toHaveAttribute('aria-pressed', 'false');
  expect((await audit()).closed).toBe(1);
});
