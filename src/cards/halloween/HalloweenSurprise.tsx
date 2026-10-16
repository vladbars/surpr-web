import { L, useLocon } from 'locon/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CardFrame } from '../../components/CardFrame';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BatSwarm, CandyRain, CharacterArt, HauntedDoor, Invitation } from './Artwork';
import { characterNames } from './model';
import type { HalloweenSurpriseProps } from './model';
import { useHalloweenAudio } from './useHalloweenAudio';
import './halloween.css';

gsap.registerPlugin(useGSAP);
const scenes = ['intro', 'door', 'character', 'message', 'end'] as const;
type Scene = (typeof scenes)[number];
const sceneNames: Record<Scene, string> = {
  intro: 'Die Einladung',
  door: 'Die Tür',
  character: 'Erwischt!',
  message: 'Geheime Post',
  end: 'Halloween',
};

function SpeakerIcon({ enabled }: { enabled: boolean }) {
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" />{enabled ? <><path d="M16 8q4 4 0 8m3-11q7 7 0 14" /></> : <path d="m17 9 5 6m0-6-5 6" />}</svg>;
}

export function HalloweenSurprise({ recipientName, message, character, previewMode = false }: HalloweenSurpriseProps) {
  const { l, currentLocale } = useLocon();
  const [scene, setScene] = useState<Scene>('intro');
  const [opening, setOpening] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousScene = useRef(scene);
  const reducedMotion = useReducedMotion();
  const sound = useHalloweenAudio();
  const letters = useMemo(() => Array.from(new Intl.Segmenter(currentLocale, { granularity: 'grapheme' }).segment(message), (part) => part.segment), [message, currentLocale]);
  const typing = scene === 'message' && !reducedMotion && visibleLetters < letters.length;

  const { contextSafe } = useGSAP(() => {
    if (opening && scene === 'door') {
      const reveal = () => { setOpening(false); setScene('character'); sound.play('reveal', character); };
      if (reducedMotion) { reveal(); return; }
      gsap.timeline({ onComplete: reveal })
        .to('[data-knocker]', { rotationX: -45, transformOrigin: '50% 0%', duration: 0.09, repeat: 5, yoyo: true })
        .to('.house-body', { x: 2, duration: 0.045, repeat: 5, yoyo: true }, 0.06)
        .to('[data-door-panel]', { rotationY: -108, transformOrigin: '0% 50%', duration: 1, ease: 'power3.inOut' }, 0.65)
        .to('.door-portal', { opacity: 1, duration: 0.6 }, 0.8)
        .to('.haunted-set', { scale: 1.35, y: 20, duration: 0.65, ease: 'power2.in' }, 1.1)
        .to('[data-scene-copy]', { opacity: 0, y: 12, duration: 0.25 }, 1.5);
      return;
    }
    if (reducedMotion) return;
    gsap.fromTo('[data-scene-copy]', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' });
    if (scene === 'intro') gsap.fromTo('.invitation-art', { y: -50, rotation: -12, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.95, ease: 'elastic.out(1, 0.65)' });
    if (scene === 'door') gsap.fromTo('.haunted-set', { scale: 1.14, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 });
    if (scene === 'character') {
      gsap.fromTo('.monster-interaction', { scale: 0.15, y: 155, rotation: -18, opacity: 0 }, { scale: 1, y: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(2.3)' });
      gsap.fromTo('[data-burst]', { x: 0, y: 100, scale: 0.2, opacity: 1 }, {
        x: (_, element: HTMLElement) => Number(element.dataset.x), y: (_, element: HTMLElement) => Number(element.dataset.y),
        rotation: (_, element: HTMLElement) => Number(element.dataset.spin), scale: 1.3, opacity: 0, duration: 1.65, stagger: 0.025, ease: 'power2.out',
      });
      gsap.fromTo('.boo-backdrop', { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 });
    }
    if (scene === 'message') {
      gsap.fromTo('.message-paper', { rotation: -5, y: 40, opacity: 0 }, { rotation: 0, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.3)' });
      gsap.fromTo('.message-flap', { rotationX: 0 }, { rotationX: -175, transformOrigin: '50% 0%', duration: 0.7, delay: 0.3, ease: 'power2.inOut' });
    }
    if (scene === 'end') {
      gsap.fromTo('[data-candy]', { y: -220, opacity: 0, scale: 0.5 }, { y: 260, opacity: 1, scale: 1, rotation: 220, duration: 2.2, stagger: 0.04, ease: 'power1.in' });
      gsap.fromTo('.end-title', { scale: 0.6, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.75, ease: 'elastic.out(1, 0.6)' });
    }
    const floating = container.current?.querySelectorAll('[data-float]');
    if (floating?.length) gsap.to(floating, { y: -8, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, { scope: container, dependencies: [scene, opening, reducedMotion], revertOnUpdate: true });

  useEffect(() => {
    if (previousScene.current !== scene) heading.current?.focus({ preventScroll: true });
    previousScene.current = scene;
  }, [scene]);

  useEffect(() => {
    if (scene !== 'message' || reducedMotion || !letters.length) return;
    const timer = window.setInterval(() => {
      setVisibleLetters((current) => {
        const next = Math.min(current + 1, letters.length);
        if (next === letters.length) window.clearInterval(timer);
        return next;
      });
    }, Math.min(24, 4000 / letters.length));
    return () => window.clearInterval(timer);
  }, [scene, reducedMotion, letters]);

  function openDoor() { if (opening) return; sound.play('door'); setOpening(true); }
  function replay() { sound.stop(); setOpening(false); setVisibleLetters(0); setScene('intro'); }
  function parallax(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--look-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`);
    event.currentTarget.style.setProperty('--look-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 8}px`);
  }
  const startle = contextSafe(() => {
    sound.play('reveal', character);
    if (reducedMotion) return;
    const monster = container.current?.querySelector('[data-monster]');
    if (!monster) return;
    gsap.killTweensOf(monster, 'rotation,scaleX,scaleY');
    gsap.timeline().to(monster, { scale: 1.13, rotation: -10, duration: 0.1 }).to(monster, { rotation: 9, duration: 0.1 }).to(monster, { scale: 1, rotation: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
  });

  const controls = <><button type="button" className="sound-toggle" onClick={() => void sound.toggle()} aria-label={l(sound.enabled ? 'Ton ausschalten' : 'Ton einschalten')} aria-pressed={sound.enabled} aria-busy={sound.pending}><SpeakerIcon enabled={sound.enabled} /><span><L>{sound.enabled ? 'TON AN' : 'TON AUS'}</L></span></button>{sound.unavailable && <span className="sound-status" role="status"><L>Ton nicht verfügbar</L></span>}</>;

  return (
    <div className="halloween-card" ref={container} data-scene={scene} data-reduced-motion={reducedMotion} data-monster-type={character} onPointerMove={parallax} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--look-x', '0px'); event.currentTarget.style.setProperty('--look-y', '0px'); }}>
      <CardFrame step={scenes.indexOf(scene)} steps={scenes.map((item) => l(sceneNames[item]))} previewMode={previewMode} controls={controls}>
        <div className="halloween-scene" key={scene}>
          {scene === 'intro' && <>
            <span className="scene-eyebrow" data-scene-copy><L>DU STEHST AUF DER GÄSTELISTE.</L></span>
            <div className="scene-art scene-art--invitation"><div className="invitation-position"><Invitation /></div></div>
            <div className="scene-copy" data-scene-copy><h2 ref={heading} tabIndex={-1}>Hey {recipientName}<span className="accent">…</span></h2><p><L>Für dich wurde etwas vorbereitet.</L>{' '}<br /><L>Du musst nur noch die Tür öffnen.</L></p></div>
            <button className="primary-button scene-action" onClick={() => { sound.play('ticket'); setScene('door'); }} data-scene-copy><L>Überraschung öffnen</L> <span aria-hidden="true">→</span></button>
            <span className="scene-footnote" data-scene-copy><L>Ein kleiner Schreck. Keine fiesen Schockbilder.</L></span>
          </>}
          {scene === 'door' && <>
            <span className="scene-eyebrow" data-scene-copy><L>HAUS NR. 13 / ES IST JEMAND ZU HAUSE.</L></span>
            <button className="door-trigger scene-art" onClick={openDoor} disabled={opening} aria-label={l('Die geheimnisvolle Tür öffnen')}><HauntedDoor /></button>
            <div className="scene-copy" data-scene-copy><h2 ref={heading} tabIndex={-1}><L>Traust du dich?</L></h2><p><L>Das Licht ist an. Die Tür ist zu.</L>{' '}<br /><L>Einmal klopfen. Dann gibt’s kein Zurück.</L></p></div>
            <button className="primary-button scene-action" onClick={openDoor} disabled={opening} data-scene-copy><L>{opening ? 'Die Tür öffnet sich…' : 'Anklopfen & öffnen'}</L> <span aria-hidden="true">→</span></button>
            <span className="scene-footnote" data-scene-copy><L>Am besten mit eingeschaltetem Ton.</L></span>
          </>}
          {scene === 'character' && <>
            <span className="scene-eyebrow" data-scene-copy><L>WIR HABEN DICH ERWARTET.</L></span>
            <div className="scene-art monster-stage"><span className="boo-backdrop" aria-hidden="true"><L>BUH!</L></span><BatSwarm /><button type="button" className="monster-interaction" onClick={startle} aria-label={l('{character} antippen', { params: { character: l(characterNames[character]) } })}><CharacterArt character={character} /></button><span className="monster-tap-hint"><L>Antippen. Wenn du dich traust.</L></span></div>
            <div className="scene-copy" data-scene-copy><h2 ref={heading} tabIndex={-1}><L params={{ name: recipientName }}>{'Buh, {name}!'}</L></h2><p><L>Erwischt. Aber das war noch nicht alles.</L>{' '}<br /><L>Jemand hat dir etwas hinterlassen.</L></p></div>
            <button className="primary-button scene-action" onClick={() => { sound.play('paper'); setVisibleLetters(0); setScene('message'); }} data-scene-copy><L>Deine Nachricht lesen</L> <span aria-hidden="true">→</span></button>
          </>}
          {scene === 'message' && <>
            <span className="scene-eyebrow" data-scene-copy><L>STRENG GEHEIM / NUR FÜR DEINE AUGEN</L></span>
            <div className="message-scene" data-scene-copy>
              <h2 ref={heading} tabIndex={-1}><L params={{ name: recipientName }}>{'Für dich, {name}.'}</L></h2>
              <div className="message-paper"><span className="classified-stamp" aria-hidden="true"><L>ERWISCHT!</L></span><div className="message-flap" aria-hidden="true" /><p className="personal-message"><span className="sr-only">{message}</span><span aria-hidden="true">{reducedMotion ? message : letters.slice(0, visibleLetters).join('')}{typing && <span className="typing-cursor">▌</span>}</span></p><span className="paper-signoff"><L>ZUSTELLUNG DURCH HAUS NR. 13</L></span></div>
              {typing && <button className="text-button reveal-message" onClick={() => setVisibleLetters(letters.length)}><L>Alles anzeigen</L></button>}
            </div>
            <button className="primary-button scene-action" onClick={() => { sound.play('finish'); setScene('end'); }} data-scene-copy><L>Zum großen Finale</L> <span aria-hidden="true">→</span></button>
          </>}
          {scene === 'end' && <>
            <CandyRain />
            <span className="scene-eyebrow" data-scene-copy><L>STREICH ERFOLGREICH ZUGESTELLT.</L></span>
            <div className="scene-art scene-art--end"><CharacterArt character={character} /></div>
            <div className="scene-copy" data-scene-copy><h2 ref={heading} className="end-title" tabIndex={-1}>Happy{' '}<br />Halloween!</h2><p><L params={{ name: recipientName }}>{'Jetzt bist du dran, {name}.'}</L>{' '}<br /><L>Schnapp dir die Süßigkeiten.</L></p></div>
            <button className="primary-button scene-action" onClick={replay} data-scene-copy><L>Noch einmal ansehen</L> <span aria-hidden="true">↻</span></button>
            {!previewMode && <a className="text-button create-card-link" href="/"><L>Auch eine Überraschung erstellen →</L></a>}
          </>}
        </div>
      </CardFrame>
    </div>
  );
}
