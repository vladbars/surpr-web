import { useLocon } from 'locon/react';
import { LanguageSwitcher } from './i18n/LanguageSwitcher';

export const legalLinks = [
  { path: '/impressum', id: 'impressum' },
  { path: '/privacy', id: 'privacy' },
  { path: '/terms', id: 'terms' },
  { path: '/support', id: 'support' },
  { path: '/delete', id: 'delete' },
] as const;

export function SiteHeader({ page }: { page?: string }) {
  const { l } = useLocon();
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label={l('site.home')}>surpr<span>.</span></a>
    <span className="header-tagline">{l('site.tagline')}</span>
    <LanguageSwitcher titleKey={page ? `legal.${page}.title` : undefined} descriptionKey={page ? `legal.${page}.intro` : undefined} />
    <span className="demo-badge">{page ? l('legal.eyebrow') : <>HALLOWEEN LAB <span>01</span></>}</span>
  </header>;
}

export function SiteFooter({ page }: { page?: string }) {
  const { l } = useLocon();
  return <footer className="site-footer">
    <div className="footer-brand"><span>{l('site.footer')}</span><span>{l('site.future')}</span></div>
    <nav className="legal-links" aria-label={l('legal.navigation')}>
      {legalLinks.map(({ path, id }) => <a key={id} href={path} aria-current={page === id ? 'page' : undefined}>{l(`legal.${id}.label`)}</a>)}
    </nav>
  </footer>;
}
