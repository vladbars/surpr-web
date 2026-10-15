import { createLocon } from 'locon/core';

export const localeStorageKey = 'surpr.locale';
export function createWebI18n() {
  let saved: string | null = null;
  try { saved = localStorage.getItem(localeStorageKey); } catch { /* Storage is optional. */ }
  return createLocon({
    defaultLocale: 'en', locale: saved === 'de' || saved === 'en' ? saved : null,
    languages: navigator.languages?.length ? navigator.languages : [navigator.language],
    loaders: { de: () => import('./locales/de.json'), en: () => import('./locales/en.json') },
  });
}
