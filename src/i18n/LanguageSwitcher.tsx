import { useLayoutEffect } from 'react';
import { useLocon } from 'locon/react';
import { localeStorageKey } from './index';

export function LanguageSwitcher({ titleKey, descriptionKey = 'document.description' }: { titleKey?: string; descriptionKey?: string }) {
  const { currentLocale, locales, l, setLocale, loading, error } = useLocon();
  useLayoutEffect(() => {
    document.documentElement.lang = currentLocale;
    document.title = titleKey ? `${l(titleKey)} — surpr.` : l('document.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', l(descriptionKey));
  }, [currentLocale, l, titleKey, descriptionKey]);
  async function choose(locale: string) {
    try {
      if (await setLocale(locale)) {
        try { localStorage.setItem(localeStorageKey, locale); } catch { /* Selection works without storage. */ }
      }
    } catch { /* The store exposes the error and retains the previous language. */ }
  }
  return <div className="language-control">
    <div className="language-switcher" role="group" aria-label={l('locale.label')} aria-busy={loading}>
      {locales.map((locale) => <button type="button" key={locale} lang={locale} aria-label={locale === 'de' ? 'Deutsch' : 'English'} aria-pressed={currentLocale === locale} onClick={() => void choose(locale)}>{locale.toUpperCase()}</button>)}
    </div>
    {error && <span className="locale-error" role="alert">{l('locale.error')}</span>}
  </div>;
}
