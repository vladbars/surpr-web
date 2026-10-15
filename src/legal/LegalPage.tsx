import { useState } from 'react';
import { useLocon } from 'locon/react';
import { SiteFooter, SiteHeader, legalLinks } from '../SiteChrome';
import { localeStorageKey } from '../i18n';

export type LegalPageId = typeof legalLinks[number]['id'];

// Public operator details from vlad.mobi/de/impressum.html, checked 2026-10-15.
const operator = {
  name: 'Vladislav Baranov',
  careOf: 'c/o IP-Management #5557',
  street: 'Ludwig-Erhard-Str. 18',
  city: '20459 Hamburg',
  email: 'kontakt@vlad.mobi',
  economicId: 'DE442622151',
};

const sections: Record<LegalPageId, readonly string[]> = {
  impressum: ['provider', 'contact', 'identifier', 'disputes'],
  privacy: ['controller', 'demo', 'hosting', 'preferences', 'contact', 'recipients', 'rights', 'changes'],
  terms: ['scope', 'use', 'content', 'availability', 'law'],
  support: ['contact', 'help', 'report'],
  delete: ['demo', 'preferences', 'requests'],
};

function OperatorAddress() {
  const { l } = useLocon();
  return <address className="operator-address"><strong>{operator.name}</strong><br />{l('legal.soleTrader')}<br />
    {operator.careOf}<br />{operator.street}<br />{operator.city}<br />{l('legal.country')}
  </address>;
}

function ContactEmail() {
  return <a href={`mailto:${operator.email}`}>{operator.email}</a>;
}

export function LegalPage({ page }: { page: LegalPageId }) {
  const { l } = useLocon();
  const [resetStatus, setResetStatus] = useState<'done' | 'error' | null>(null);
  function resetPreferences() {
    try {
      localStorage.removeItem(localeStorageKey);
      localStorage.removeItem('surpr.sound');
      setResetStatus('done');
    } catch { setResetStatus('error'); }
  }

  return <div className="app">
    <SiteHeader page={page} />
    <main className="legal-page" id="legal-content">
      <a className="legal-back" href="/">← {l('legal.back')}</a>
      <div className="legal-heading">
        <p className="edition-label">{l('legal.eyebrow')}</p>
        <h1>{l(`legal.${page}.title`)}</h1>
        <p className="legal-intro">{l(`legal.${page}.intro`)}</p>
        <p className="legal-date">{l('legal.updated')} <time dateTime="2026-10-15">{l('legal.date')}</time></p>
      </div>
      <div className="legal-layout">
        <nav className="legal-index" aria-label={l('legal.contents')}>
          {sections[page].map((id) => <a key={id} href={`#${id}`}>{l(`legal.${page}.${id}.title`)}</a>)}
        </nav>
        <div className="legal-copy">
          {sections[page].map((id) => {
            const key = `legal.${page}.${id}`;
            return <section key={id} id={id} aria-labelledby={`${id}-heading`}>
              <h2 id={`${id}-heading`}>{l(`${key}.title`)}</h2>
              <p>{l(`${key}.body`)}</p>
              {(page === 'impressum' && id === 'provider' || page === 'privacy' && id === 'controller') && <OperatorAddress />}
              {(id === 'contact' || page === 'privacy' && id === 'controller' || page === 'delete' && id === 'requests') && <p><ContactEmail /></p>}
              {page === 'impressum' && id === 'identifier' && <p className="legal-identifier">{operator.economicId}</p>}
              {page === 'privacy' && id === 'hosting' && <p><a href="https://www.hetzner.com/legal/privacy-policy/">{l('legal.hetznerPrivacy')}</a></p>}
              {page === 'privacy' && id === 'preferences' && <dl className="legal-storage">
                <dt><code>surpr.locale</code></dt><dd>{l('legal.storage.locale')}</dd>
                <dt><code>surpr.sound</code></dt><dd>{l('legal.storage.sound')}</dd>
              </dl>}
              {page === 'privacy' && id === 'rights' && <>
                <p className="legal-emphasis">{l('legal.privacy.rights.objection')}</p>
                <p>{l('legal.privacy.rights.complaint')}</p>
                <p><a href="https://datenschutz-hamburg.de/">{l('legal.supervisoryAuthority')}</a></p>
                <p><ContactEmail /> · <a href="/delete">{l('legal.delete.label')}</a></p>
              </>}
              {page === 'support' && id === 'report' && <p><ContactEmail /></p>}
              {page === 'delete' && id === 'preferences' && <>
                <button className="legal-reset" type="button" onClick={resetPreferences}>{l('legal.reset')}</button>
                {resetStatus && <p role="status">{l(`legal.reset.${resetStatus}`)}</p>}
              </>}
            </section>;
          })}
        </div>
      </div>
    </main>
    <SiteFooter page={page} />
  </div>;
}
