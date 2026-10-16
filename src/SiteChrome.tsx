import { L, useLocon } from 'locon/react';
import { LanguageSwitcher } from './i18n/LanguageSwitcher';

import { legalLinks, legalPages } from './legal/content';
import type { LegalPageId } from './legal/content';
export { legalLinks } from './legal/content';

export function SiteHeader({ page }: { page?: LegalPageId }) {
  const { l } = useLocon();
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label={l('surpr. Startseite')}>surpr<span>.</span></a>
    <span className="header-tagline"><L>Kleiner Link. Große Reaktion.</L></span>
    <LanguageSwitcher title={page ? legalPages[page].title : undefined} description={page ? legalPages[page].intro : undefined} />
    <span className="demo-badge">{page ? <L>{'RECHTLICHES & HILFE'}</L> : <>HALLOWEEN LAB <span>01</span></>}</span>
  </header>;
}

export function SiteFooter({ page }: { page?: LegalPageId }) {
  const { l } = useLocon();
  return <footer className="site-footer">
    <div className="footer-brand"><span><L>surpr. / Überraschungen zum Anklicken.</L></span><span><L>HALLOWEEN ZUERST. WEITERE ANLÄSSE FOLGEN.</L></span></div>
    <nav className="legal-links" aria-label={l('Rechtliches & Hilfe')}>
      {legalLinks.map(({ path, id, label }) => <a key={id} href={path} aria-current={page === id ? 'page' : undefined}><L>{label}</L></a>)}
    </nav>
  </footer>;
}
