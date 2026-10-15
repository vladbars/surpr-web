import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

// Offline rendering only. The CC0 recording is an audio asset, not training data.
// Requires installed Chrome and macOS afconvert; the shipped files need neither.
const assetDirectory = fileURLToPath(new URL('../public/audio/halloween/', import.meta.url));
const input = await readFile(join(assetDirectory, 'boo-voice.mp3'));
const outputDirectory = join(tmpdir(), 'surpr-voice-render');
await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  const profiles = {
    ghost: { rate: 0.78, lowerRate: 0.52, lowerGain: 0.24, drive: 1.6, tail: 0.82, wet: 0.24, presence: 3 },
    pumpkin: { rate: 0.64, lowerRate: 0.46, lowerGain: 0.38, drive: 2.5, tail: 0.44, wet: 0.14, presence: 4 },
    vampire: { rate: 0.91, lowerRate: 0.65, lowerGain: 0.18, drive: 2, tail: 0.58, wet: 0.19, presence: 5 },
  };
  for (const [character, profile] of Object.entries(profiles)) {
    const rendered = await page.evaluate(async ({ input, profile }) => {
      const sampleRate = 44100;
      const context = new OfflineAudioContext(2, sampleRate * 2, sampleRate);
      const decoded = await context.decodeAudioData(Uint8Array.from(atob(input), (c) => c.charCodeAt(0)).buffer);
      const mono = new Float32Array(decoded.length);
      for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
        const samples = decoded.getChannelData(channel);
        for (let i = 0; i < samples.length; i++) mono[i] += samples[i] / decoded.numberOfChannels;
      }
      let first = mono.findIndex((value) => Math.abs(value) > 0.009);
      let last = mono.length - 1;
      while (last > first && Math.abs(mono[last]) < 0.009) last--;
      first = Math.max(0, first - Math.round(sampleRate * 0.014));
      last = Math.min(mono.length, last + Math.round(sampleRate * 0.065));
      const voice = context.createBuffer(1, last - first, sampleRate);
      const samples = voice.getChannelData(0);
      let inputPeak = 0;
      for (let i = first; i < last; i++) inputPeak = Math.max(inputPeak, Math.abs(mono[i]));
      for (let i = 0; i < samples.length; i++) {
        const fade = Math.min(1, i / (sampleRate * 0.003), (samples.length - i) / (sampleRate * 0.025));
        samples[i] = mono[first + i] / inputPeak * 0.8 * fade;
      }
      const mix = context.createGain();
      const drive = context.createWaveShaper();
      const curve = new Float32Array(4096);
      for (let i = 0; i < curve.length; i++) { const x = i * 2 / (curve.length - 1) - 1; curve[i] = Math.tanh(x * profile.drive) / Math.tanh(profile.drive); }
      drive.curve = curve;
      drive.oversample = '2x';
      const presence = context.createBiquadFilter();
      presence.type = 'peaking'; presence.frequency.value = 920; presence.Q.value = 0.7; presence.gain.value = profile.presence;
      const highpass = context.createBiquadFilter(); highpass.type = 'highpass'; highpass.frequency.value = 65;
      const lowpass = context.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 4100;
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -16; compressor.knee.value = 8; compressor.ratio.value = 3.5; compressor.attack.value = 0.003; compressor.release.value = 0.14;
      mix.connect(drive).connect(presence).connect(highpass).connect(lowpass).connect(compressor);
      compressor.connect(context.destination);

      function voicedLayer(rate, gainValue, cutoff) {
        const source = context.createBufferSource(); source.buffer = voice;
        source.playbackRate.setValueAtTime(rate * 1.045, 0);
        source.playbackRate.exponentialRampToValueAtTime(rate * 0.94, 0.4);
        const gain = context.createGain(); gain.gain.value = gainValue;
        const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = cutoff;
        source.connect(filter).connect(gain).connect(mix); source.start(0);
      }
      voicedLayer(profile.rate, 1, 4400);
      voicedLayer(profile.lowerRate, profile.lowerGain, 650);

      // Compact chest impact, pitched high enough to remain audible on a phone.
      const impact = context.createOscillator(); impact.type = 'triangle';
      impact.frequency.setValueAtTime(135, 0); impact.frequency.exponentialRampToValueAtTime(46, 0.23);
      const impactGain = context.createGain();
      impactGain.gain.setValueAtTime(0, 0); impactGain.gain.linearRampToValueAtTime(0.24, 0.012); impactGain.gain.exponentialRampToValueAtTime(0.001, 0.27);
      impact.connect(impactGain).connect(context.destination); impact.start(0); impact.stop(0.29);

      // A finite room response is baked into the file; mute can stop the whole tail.
      const impulse = context.createBuffer(2, Math.round(sampleRate * profile.tail), sampleRate);
      let seed = 69420;
      for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
          const t = i / data.length;
          data[i] = (seed / 2147483648) * Math.pow(1 - t, 3.7) * Math.min(1, i / 500);
        }
      }
      const room = context.createConvolver(); room.buffer = impulse;
      const wet = context.createGain(); wet.gain.value = profile.wet;
      const roomHighpass = context.createBiquadFilter(); roomHighpass.type = 'highpass'; roomHighpass.frequency.value = 200;
      compressor.connect(room).connect(roomHighpass).connect(wet).connect(context.destination);
      const audio = await context.startRendering();
      let peak = 0;
      for (let c = 0; c < audio.numberOfChannels; c++) for (const value of audio.getChannelData(c)) peak = Math.max(peak, Math.abs(value));
      const scale = 0.82 / peak;
      const count = Math.floor(sampleRate * 1.55);
      const bytes = new ArrayBuffer(44 + count * 4);
      const view = new DataView(bytes);
      const ascii = (offset, value) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
      ascii(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); ascii(8, 'WAVE'); ascii(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 2, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 4, true); view.setUint16(32, 4, true); view.setUint16(34, 16, true); ascii(36, 'data'); view.setUint32(40, count * 4, true);
      let squareSum = 0;
      for (let i = 0; i < count; i++) for (let c = 0; c < 2; c++) {
        const fadeOut = Math.min(1, (count - i) / (sampleRate * 0.05));
        const value = audio.getChannelData(c)[i] * scale * fadeOut;
        squareSum += value * value;
        view.setInt16(44 + (i * 2 + c) * 2, Math.round(value * 32767), true);
      }
      let binary = '';
      const output = new Uint8Array(bytes);
      for (let i = 0; i < output.length; i += 8192) binary += String.fromCharCode(...output.subarray(i, i + 8192));
      return { wav: btoa(binary), stats: { duration: count / sampleRate, peak: 0.82, rms: Math.sqrt(squareSum / (count * 2)), originalTrim: [first / sampleRate, last / sampleRate] } };
    }, { input: input.toString('base64'), profile });
    const wav = join(outputDirectory, `boo-${character}.wav`);
    await writeFile(wav, Buffer.from(rendered.wav, 'base64'));
    execFileSync('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '128000', wav, join(assetDirectory, `boo-${character}.m4a`)]);
    console.log(JSON.stringify({ character, ...rendered.stats, file: `boo-${character}.m4a` }));
  }
} finally { await browser.close(); }
