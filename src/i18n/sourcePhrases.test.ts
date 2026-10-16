import { describe, expect, it, vi } from 'vitest';
import { createLocon } from 'locon/core';
import de from './locales/de.json';
import en from './locales/en.json';

describe('source-language localization', () => {
  it('translates German source phrases on an English-first visit without loading German resources', async () => {
    const loadGerman = vi.fn(async () => de);
    const loadEnglish = vi.fn(async () => en);
    const i18n = createLocon({
      projectLocale: 'de', defaultLocale: 'en', languages: ['en-GB'],
      loaders: { de: loadGerman, en: loadEnglish },
    });
    await i18n.setLocale(null);
    expect(i18n.l('Überraschung öffnen')).toBe('Open your surprise');
    expect(i18n.l('Buh, {name}!', { params: { name: 'Alex 🎃' } })).toBe('Boo, Alex 🎃!');
    expect(loadGerman).not.toHaveBeenCalled();
    expect(loadEnglish).toHaveBeenCalledTimes(1);
    await i18n.setLocale('de');
    expect(i18n.l('Überraschung öffnen')).toBe('Überraschung öffnen');
    await i18n.setLocale('en');
    expect(loadEnglish).toHaveBeenCalledTimes(1);
  });
});
