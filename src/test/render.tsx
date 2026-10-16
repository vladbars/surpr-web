import { render as originalRender } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createLocon, LoconProvider } from 'locon/react';
import de from '../i18n/locales/de.json';
import en from '../i18n/locales/en.json';

export async function render(element: ReactElement, locale = 'de') {
  const instance = createLocon({ defaultLocale: 'en', projectLocale: 'de', locale, loaders: { de: async () => de, en: async () => en } });
  await instance.setLocale(locale);
  return originalRender(<LoconProvider instance={instance}>{element}</LoconProvider>);
}
