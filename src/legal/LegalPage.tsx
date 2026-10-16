import { useState } from 'react';
import { L, useLocon } from 'locon/react';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import { localeStorageKey } from '../i18n';

import { legalPages } from './content';
import type { LegalPageId } from './content';

// Public operator details from vlad.mobi/de/impressum.html, checked 2026-10-15.
const operator = {
  name: 'Vladislav Baranov',
  careOf: 'c/o IP-Management #5557',
  street: 'Ludwig-Erhard-Str. 18',
  city: '20459 Hamburg',
  email: 'kontakt@vlad.mobi',
  economicId: 'DE442622151',
};

function OperatorAddress() {
  return <address className="operator-address"><strong>{operator.name}</strong><br /><L>Einzelunternehmer · surpr.</L><br />
    {operator.careOf}<br />{operator.street}<br />{operator.city}<br /><L>Deutschland</L>
  </address>;
}

function ContactEmail() {
  return <a href={`mailto:${operator.email}`}>{operator.email}</a>;
}

export function LegalPage({ page }: { page: LegalPageId }) {
  const { l } = useLocon();
  const content = legalPages[page];
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
      <a className="legal-back" href="/">← <L>Zurück zur Überraschung</L></a>
      <div className="legal-heading">
        <p className="edition-label"><L>{'RECHTLICHES & HILFE'}</L></p>
        <h1><L>{content.title}</L></h1>
        <p className="legal-intro"><L>{content.intro}</L></p>
        <p className="legal-date"><L>Stand:</L> <time dateTime="2026-10-15"><L>15. Oktober 2026</L></time></p>
      </div>
      <div className="legal-layout">
        <nav className="legal-index" aria-label={l('Auf dieser Seite')}>
          {content.sections.map(({ id, title }) => <a key={id} href={`#${id}`}><L>{title}</L></a>)}
        </nav>
        <div className="legal-copy">
          {content.sections.map(({ id, title, body }) => {
            return <section key={id} id={id} aria-labelledby={`${id}-heading`}>
              <h2 id={`${id}-heading`}><L>{title}</L></h2>
              <p><L>{body}</L></p>
              {(page === 'impressum' && id === 'provider' || page === 'privacy' && id === 'controller') && <OperatorAddress />}
              {(id === 'contact' || page === 'privacy' && id === 'controller' || page === 'delete' && id === 'requests') && <p><ContactEmail /></p>}
              {page === 'impressum' && id === 'identifier' && <p className="legal-identifier">{operator.economicId}</p>}
              {page === 'privacy' && id === 'hosting' && <p><a href="https://www.hetzner.com/legal/privacy-policy/"><L>Datenschutzhinweise von Hetzner</L></a></p>}
              {page === 'privacy' && id === 'preferences' && <dl className="legal-storage">
                <dt><code>surpr.locale</code></dt><dd><L>Deine gewählte Sprache (DE oder EN). Wird beim Wechseln der Sprache gespeichert und bleibt erhalten, bis du die Einstellungen zurücksetzt oder die Website-Daten im Browser löschst.</L></dd>
                <dt><code>surpr.sound</code></dt><dd><L>Deine gewählte Toneinstellung (an oder aus). Wird beim Umschalten des Tons gespeichert und bleibt erhalten, bis du die Einstellungen zurücksetzt oder die Website-Daten im Browser löschst.</L></dd>
              </dl>}
              {page === 'privacy' && id === 'rights' && <>
                <p className="legal-emphasis"><L>Widerspruchsrecht: Du kannst einer Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO jederzeit aus Gründen widersprechen, die sich aus deiner besonderen Situation ergeben.</L></p>
                <p><L>Du kannst dich bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere in dem EU-/EWR-Staat deines Wohnorts, Arbeitsplatzes oder des mutmaßlichen Verstoßes. Du kannst dich auch an die Hamburger Aufsichtsbehörde wenden:</L></p>
                <p><a href="https://datenschutz-hamburg.de/"><L>Hamburgischer Beauftragter für Datenschutz und Informationsfreiheit</L></a></p>
                <p><ContactEmail /> · <a href="/delete"><L>Daten löschen</L></a></p>
              </>}
              {page === 'support' && id === 'report' && <p><ContactEmail /></p>}
              {page === 'delete' && id === 'preferences' && <>
                <button className="legal-reset" type="button" onClick={resetPreferences}><L>Gespeicherte Einstellungen zurücksetzen</L></button>
                {resetStatus && <p role="status"><L>{resetStatus === 'done' ? 'Die gespeicherten Sprach- und Toneinstellungen wurden entfernt. Beim nächsten Besuch verwendet Surpr die Browsersprache und die Standard-Toneinstellung.' : 'Dein Browser blockiert den Zugriff auf den Speicher. Du kannst die gespeicherten Einstellungen in den Website-Dateneinstellungen deines Browsers entfernen.'}</L></p>}
              </>}
            </section>;
          })}
        </div>
      </div>
    </main>
    <SiteFooter page={page} />
  </div>;
}
