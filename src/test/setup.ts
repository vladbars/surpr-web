import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

let reducedMotion = true;
const mediaQueries = new Map<string, MediaQueryList>();

export function setReducedMotion(value: boolean) {
  reducedMotion = value;
  for (const media of mediaQueries.values()) media.dispatchEvent(new Event('change'));
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => {
    if (!mediaQueries.has(query)) {
      const target = new EventTarget();
      const media = Object.assign(target, {
        media: query,
        onchange: null,
        get matches() { return query.includes('prefers-reduced-motion') && reducedMotion; },
        addListener: vi.fn(),
        removeListener: vi.fn(),
      });
      // Object.assign materializes getters; keep matches reactive for preference changes.
      Object.defineProperty(media, 'matches', { get: () => query.includes('prefers-reduced-motion') && reducedMotion });
      mediaQueries.set(query, media as MediaQueryList);
    }
    return mediaQueries.get(query)!;
  },
});

beforeEach(() => { setReducedMotion(true); localStorage.clear(); });
afterEach(() => { cleanup(); });
