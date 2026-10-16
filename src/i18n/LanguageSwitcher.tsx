import { useLayoutEffect } from 'react';
import { L, useLocon } from 'locon/react';
import { localeStorageKey } from './index';

export function LanguageSwitcher({ title, description = 'Kleiner Link. Große Reaktion. Öffne die Tür zu deinem interaktiven Halloween-Surpr.' }: { title?: string; description?: string }) {
  const { currentLocale, locales, l, setLocale, loading, error } = useLocon();
  useLayoutEffect(() => {
    document.documentElement.lang = currentLocale;
    document.title = title ? `${l(title)} — surpr.` : l('surpr. — Dein Halloween-Streich');
    document.querySelector('meta[name="description"]')?.setAttribute('content', l(description));
  }, [currentLocale, l, title, description]);
  async function choose(locale: string) {
    try {
      if (await setLocale(locale)) {
        try { localStorage.setItem(localeStorageKey, locale); } catch { /* Selection works without storage. */ }
      }
    } catch { /* The store exposes the error and retains the previous language. */ }
  }
  return <div className="language-control">
    <div className="language-switcher" role="group" aria-label={l('Sprache')} aria-busy={loading}>
      {locales.map((locale) => <button type="button" key={locale} lang={locale} aria-label={locale === 'de' ? 'Deutsch' : 'English'} aria-pressed={currentLocale === locale} onClick={() => void choose(locale)}>{locale.toUpperCase()}</button>)}
    </div>
    {error && <span className="locale-error" role="alert"><L>Sprache konnte nicht geladen werden. Bitte erneut versuchen.</L></span>}
  </div>;
}
