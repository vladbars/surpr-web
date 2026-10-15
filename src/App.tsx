import { useLocon } from 'locon/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { HalloweenSurprise } from './cards/halloween/HalloweenSurprise';
import { CharacterArt, Bat } from './cards/halloween/Artwork';
import { characters, defaultPersonalization, normalizePersonalization, validatePersonalization } from './cards/halloween/model';
import { SiteFooter, SiteHeader } from './SiteChrome';
import { useReducedMotion } from './hooks/useReducedMotion';

export function App() {
  const { l } = useLocon();
  const [form, setForm] = useState(() => ({ ...defaultPersonalization, message: l('sample.message') }));
  const [personalization, setPersonalization] = useState(() => ({ ...defaultPersonalization, message: l('sample.message') }));
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
            <p className="edition-label">{l('site.edition')}</p>
            <h1 id="demo-heading">{l('site.headline')}{' '}<br /><span>Surpr.</span><Bat className="headline-bat" /></h1>
          </div>
          <div className="intro-description"><p>{l('site.description1')}{' '}<br />{l('site.description2')}</p><a href="#experience">{l('site.try')} <span aria-hidden="true">↓</span></a></div>
        </section>

        <div className="demo-layout">
          <section className="preview-section" aria-label={l('site.previewAria')} id="experience" ref={preview}>
            <div className="preview-caption"><span>{l('site.previewTitle')}</span><span>{l('site.previewScenes')}</span></div>
            <HalloweenSurprise key={revision} {...personalization} previewMode />
            <p className="preview-underneath">{l('site.steps')} <span>{l('site.soundHint')}</span></p>
          </section>

          <aside className="editor-panel" aria-labelledby="editor-heading">
            <div className="editor-heading"><span className="editor-number">01—03</span><h2 id="editor-heading">{l('editor.title1')}{' '}<br />{l('editor.title2')}</h2><p>{l('editor.description')}</p></div>
            <form className="demo-form" onSubmit={updatePreview} noValidate aria-label={l('editor.formAria')}>
              <div className="field-label"><label htmlFor="recipient-name">{l('editor.name')}</label><span>{form.recipientName.length}/40</span></div>
              <input id="recipient-name" autoComplete="off" maxLength={40} value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} aria-invalid={Boolean(errors.recipientName)} aria-describedby={errors.recipientName ? 'name-error' : undefined} placeholder={l('editor.namePlaceholder')} required />
              {errors.recipientName && <p className="field-error" id="name-error" role="alert">{l(errors.recipientName)}</p>}

              <fieldset className="character-picker">
                <legend>{l('editor.character')}</legend>
                <div className="character-options">{characters.map((character) => (
                  <label className={`character-option ${form.character === character ? 'is-selected' : ''}`} key={character}>
                    <input type="radio" name="character" value={character} checked={form.character === character} onChange={() => setForm({ ...form, character })} />
                    <CharacterArt character={character} small />
                    <span>{l(`character.${character}`)}</span><span className="selection-dot" aria-hidden="true" />
                  </label>
                ))}</div>
              </fieldset>

              <div className="field-label"><label htmlFor="card-message">{l('editor.message')}</label><span>{form.message.length}/300</span></div>
              <textarea id="card-message" maxLength={300} rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} required />
              {errors.message && <p className="field-error" id="message-error" role="alert">{l(errors.message)}</p>}
              <button className="preview-button" type="submit">{l('editor.preview')} <span aria-hidden="true">↗</span></button>
              <p className="demo-note">{l('editor.demo1')}{' '}<br />{l('editor.demo2')}</p>
            </form>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
