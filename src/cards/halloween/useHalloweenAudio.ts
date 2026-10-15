import { useCallback, useEffect, useRef, useState } from 'react';
import { HalloweenAudio } from './audio';
import type { HalloweenCue } from './audio';
import type { HalloweenCharacter } from './model';

function initialPreference() {
  try { return localStorage.getItem('surpr.sound') !== 'off'; } catch { return true; }
}
export function useHalloweenAudio() {
  const engine = useRef<HalloweenAudio | null>(null);
  const [enabled, setEnabled] = useState(initialPreference);
  const wanted = useRef(enabled);
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const preparation = useRef<Promise<boolean> | null>(null);
  const ready = useRef(false);
  const generation = useRef(0);
  const latestCue = useRef(0);

  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) { latestCue.current++; engine.current?.stop(); } };
    document.addEventListener('visibilitychange', stopWhenHidden);
    return () => {
      document.removeEventListener('visibilitychange', stopWhenHidden);
      generation.current++;
      engine.current?.dispose(); engine.current = null;
      preparation.current = null; ready.current = false;
    };
  }, []);

  const play = useCallback((cue: HalloweenCue, character?: HalloweenCharacter) => {
    if (!wanted.current) return;
    const audio = engine.current ??= new HalloweenAudio();
    const version = generation.current;
    const request = ++latestCue.current;
    if (ready.current && audio.running) { audio.play(cue, character); return; }
    if (!preparation.current) {
      setPending(true);
      // resume() runs before the first await, within the user's click/tap.
      preparation.current = audio.enable();
    }
    void preparation.current.then((success) => {
      if (generation.current !== version || engine.current !== audio) return;
      preparation.current = null; ready.current = success; setPending(false);
      if (!wanted.current) { audio.disable(); ready.current = false; return; }
      setUnavailable(!success);
      if (!success) { wanted.current = false; setEnabled(false); return; }
      if (request === latestCue.current) audio.play(cue, character);
    });
  }, []);

  function toggle() {
    wanted.current = !wanted.current;
    setEnabled(wanted.current); setUnavailable(false);
    try { localStorage.setItem('surpr.sound', wanted.current ? 'on' : 'off'); } catch { /* Optional preference. */ }
    if (!wanted.current) {
      generation.current++; latestCue.current++;
      if (preparation.current) { engine.current?.dispose(); engine.current = null; }
      else engine.current?.disable();
      preparation.current = null; setPending(false); ready.current = false;
    } else { play('ticket'); }
  }
  const stop = useCallback(() => { latestCue.current++; engine.current?.stop(); }, []);
  return { enabled, pending, unavailable, toggle, play, stop };
}
