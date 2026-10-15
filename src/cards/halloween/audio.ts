import type { HalloweenCharacter } from './model';

export type HalloweenCue = 'ticket' | 'door' | 'reveal' | 'paper' | 'finish';

const revealFiles: Record<HalloweenCharacter, string> = {
  ghost: `${import.meta.env.BASE_URL}audio/halloween/boo-ghost.m4a`,
  pumpkin: `${import.meta.env.BASE_URL}audio/halloween/boo-pumpkin.m4a`,
  vampire: `${import.meta.env.BASE_URL}audio/halloween/boo-vampire.m4a`,
};

/** Local recorded reveal voices and synthesized foley, unlocked by a user gesture. */
export class HalloweenAudio {
  private context?: AudioContext;
  private output?: GainNode;
  private sources = new Set<AudioScheduledSourceNode>();
  private enabled = false;
  private voices?: Record<HalloweenCharacter, AudioBuffer>;
  private loading?: AbortController;
  private reveal?: { source: AudioBufferSourceNode; gain: GainNode };
  get running() { return this.context?.state === 'running'; }

  async enable(): Promise<boolean> {
    try {
      const AudioConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioConstructor) return false;
      if (!this.context || this.context.state === 'closed') {
        this.context = new AudioConstructor();
        this.output = this.context.createGain();
        this.output.gain.value = 0.2;
        this.output.connect(this.context.destination);
      }
      const context = this.context;
      await context.resume();
      if (!this.voices) {
        const loading = new AbortController();
        this.loading = loading;
        const entries = await Promise.all(Object.entries(revealFiles).map(async ([character, url]) => {
          const response = await fetch(url, { signal: AbortSignal.any([loading.signal, AbortSignal.timeout(8000)]) });
          if (!response.ok) throw new Error('Reveal audio unavailable');
          return [character, await context.decodeAudioData(await response.arrayBuffer())] as const;
        }));
        if (this.context !== context || loading.signal.aborted) return false;
        this.voices = Object.fromEntries(entries) as Record<HalloweenCharacter, AudioBuffer>;
        this.loading = undefined;
      }
      if (this.context !== context || context.state !== 'running') return false;
      this.enabled = true;
      return true;
    } catch {
      this.enabled = false;
      this.loading?.abort();
      this.loading = undefined;
      return false;
    }
  }

  disable() {
    this.enabled = false;
    this.stop();
    void this.context?.suspend().catch(() => {});
  }

  private track(source: AudioScheduledSourceNode, gain: GainNode, start: number, duration: number) {
    this.sources.add(source);
    source.onended = () => { this.sources.delete(source); source.disconnect(); gain.disconnect(); };
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  private tone(frequency: number, end: number, duration: number, delay = 0, volume = 0.3, type: OscillatorType = 'sine') {
    const context = this.context!;
    const at = context.currentTime + delay;
    const source = context.createOscillator();
    const gain = context.createGain();
    source.type = type;
    source.frequency.setValueAtTime(frequency, at);
    source.frequency.exponentialRampToValueAtTime(end, at + duration);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    source.connect(gain).connect(this.output!);
    this.track(source, gain, at, duration);
  }

  private noise(duration: number, delay: number, volume: number, frequency: number) {
    const context = this.context!;
    const at = context.currentTime + delay;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    source.connect(filter).connect(gain).connect(this.output!);
    this.track(source, gain, at, duration);
    source.addEventListener('ended', () => filter.disconnect(), { once: true });
  }

  private recordedReveal(character: HalloweenCharacter) {
    const context = this.context!;
    const buffer = this.voices?.[character];
    if (!buffer) return;
    // Repeated taps replace the previous voice instead of accumulating loud layers.
    if (this.reveal) {
      const previous = this.reveal;
      previous.gain.gain.cancelScheduledValues(context.currentTime);
      previous.gain.gain.setValueAtTime(previous.gain.gain.value, context.currentTime);
      previous.gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.015);
      try { previous.source.stop(context.currentTime + 0.02); } catch { /* Already ended. */ }
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gain = context.createGain();
    gain.gain.value = 1.35;
    source.connect(gain).connect(this.output!);
    this.reveal = { source, gain };
    source.addEventListener('ended', () => { if (this.reveal?.source === source) this.reveal = undefined; }, { once: true });
    this.track(source, gain, context.currentTime, buffer.duration);
  }

  play(cue: HalloweenCue, character: HalloweenCharacter = 'ghost') {
    if (!this.enabled || !this.context || this.context.state !== 'running' || document.hidden) return;
    if (cue === 'ticket') { this.noise(0.22, 0, 0.2, 1800); this.tone(330, 165, 0.2, 0, 0.15, 'triangle'); }
    if (cue === 'door') {
      for (const delay of [0, 0.23, 0.46]) { this.noise(0.1, delay, 0.5, 380); this.tone(115, 55, 0.12, delay, 0.4, 'triangle'); }
      this.tone(92, 165, 0.8, 0.72, 0.08, 'sawtooth');
      this.noise(0.65, 0.75, 0.12, 850);
    }
    if (cue === 'reveal') this.recordedReveal(character);
    if (cue === 'paper') { this.noise(0.28, 0, 0.2, 2200); this.noise(0.15, 0.2, 0.15, 1200); }
    if (cue === 'finish') [261.6, 311.1, 392, 523.2].forEach((note, i) => this.tone(note, note * 0.99, 0.5, i * 0.12, 0.22, 'triangle'));
  }

  stop() {
    for (const source of this.sources) { try { source.stop(); } catch { /* Already ended. */ } }
    this.sources.clear();
    this.reveal = undefined;
  }

  dispose() {
    this.enabled = false;
    this.loading?.abort();
    this.loading = undefined;
    this.voices = undefined;
    this.stop();
    const context = this.context;
    this.context = undefined;
    this.output = undefined;
    if (context && context.state !== 'closed') void context.close().catch(() => {});
  }
}
