import { L, useLocon } from 'locon/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { HalloweenSurprise } from './cards/halloween/HalloweenSurprise';
import { CharacterArt, Bat } from './cards/halloween/Artwork';
import { characters, characterNames, defaultPersonalization, normalizePersonalization, validatePersonalization } from './cards/halloween/model';
import { SiteFooter, SiteHeader } from './SiteChrome';
import { useReducedMotion } from './hooks/useReducedMotion';

export function App() {
  const { l } = useLocon();
  const [form, setForm] = useState(() => ({ ...defaultPersonalization, message: l(defaultPersonalization.message) }));
  const [personalization, setPersonalization] = useState(() => ({ ...defaultPersonalization, message: l(defaultPersonalization.message) }));
  const [errors, setErrors] = useState<ReturnType<typeof validatePersonalization>>({});
  const [revision, setRevision] = useState(0);
  const preview = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  function updatePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizePersonalization(form);
    const nextErrors = validatePersonalization(normalized);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setForm(normalized);
    setPersonalization(normalized);
    setRevision((value) => value + 1);
    if (window.matchMedia('(max-width: 760px)').matches) {
      preview.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }
  }

  return (
    <div className="app">
      <SiteHeader />

      <main>
        <section className="page-intro" aria-labelledby="demo-heading">
          <div>
            <p className="edition-label"><L>31.10.2026 / DIE ERSTE EDITION</L></p>
            <h1 id="demo-heading"><L>Süßes. Saures.</L>{' '}<br /><span>Surpr.</span><Bat className="headline-bat" /></h1>
          </div>
          <div className="intro-description"><p><L>Ein Halloween-Streich zum Verschicken.</L>{' '}<br /><L>Mit Ton, Monstern und deiner Nachricht.</L></p><a href="#experience"><L>Probier’s selbst</L> <span aria-hidden="true">↓</span></a></div>
        </section>

        <div className="demo-layout">
          <section className="preview-section" aria-label={l('Interaktive Halloween-Vorschau')} id="experience" ref={preview}>
            <div className="preview-caption"><span><L>DER KLEINE HORRORTRIP</L></span><span><L>5 SZENEN / DU BIST DRAN</L></span></div>
            <HalloweenSurprise key={revision} {...personalization} previewMode />
            <p className="preview-underneath"><L>Klopfen. Tür öffnen. Erwischt werden.</L> <span><L>Mit Ton wird’s besser.</L></span></p>
          </section>

          <aside className="editor-panel" aria-labelledby="editor-heading">
            <div className="editor-heading"><span className="editor-number">01—03</span><h2 id="editor-heading"><L>Dein Streich.</L>{' '}<br /><L>Deine Leute.</L></h2><p><L>Wer bekommt heute einen kleinen Schreck?</L></p></div>
            <form className="demo-form" onSubmit={updatePreview} noValidate aria-label={l('Deine Demo personalisieren')}>
              <div className="field-label"><label htmlFor="recipient-name"><L>01 / Für wen?</L></label><span>{form.recipientName.length}/40</span></div>
              <input id="recipient-name" autoComplete="off" maxLength={40} value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} aria-invalid={Boolean(errors.recipientName)} aria-describedby={errors.recipientName ? 'name-error' : undefined} placeholder={l('Name eingeben')} required />
              {errors.recipientName && <p className="field-error" id="name-error" role="alert"><L>{errors.recipientName}</L></p>}

              <fieldset className="character-picker">
                <legend><L>02 / Wer lauert hinter der Tür?</L></legend>
                <div className="character-options">{characters.map((character) => (
                  <label className={`character-option ${form.character === character ? 'is-selected' : ''}`} key={character}>
                    <input type="radio" name="character" value={character} checked={form.character === character} onChange={() => setForm({ ...form, character })} />
                    <CharacterArt character={character} small />
                    <span><L>{characterNames[character]}</L></span><span className="selection-dot" aria-hidden="true" />
                  </label>
                ))}</div>
              </fieldset>

              <div className="field-label"><label htmlFor="card-message"><L>03 / Deine geheime Nachricht</L></label><span>{form.message.length}/300</span></div>
              <textarea id="card-message" maxLength={300} rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} required />
              {errors.message && <p className="field-error" id="message-error" role="alert"><L>{errors.message}</L></p>}
              <button className="preview-button" type="submit"><L>Vorschau ansehen</L> <span aria-hidden="true">↗</span></button>
              <p className="demo-note"><L>Kostenlose Demo. Noch keine Veröffentlichung.</L>{' '}<br /><L>Deine Eingaben bleiben in diesem Browserfenster.</L></p>
            </form>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
