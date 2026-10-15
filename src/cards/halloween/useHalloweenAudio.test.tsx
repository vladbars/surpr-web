import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
const engines = vi.hoisted(() => [] as { enable: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; disable: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[]);
vi.mock('./audio', () => ({ HalloweenAudio: class {
  running = true;
  enable = vi.fn(async () => true);
  play = vi.fn(); disable = vi.fn(); dispose = vi.fn(); stop = vi.fn();
  constructor() { engines.push(this); }
} }));
import { useHalloweenAudio } from './useHalloweenAudio';
beforeEach(() => { engines.length = 0; });

it('defaults on but creates audio only inside the first card interaction', async () => {
  const { result } = renderHook(useHalloweenAudio);
  expect(result.current.enabled).toBe(true); expect(engines).toHaveLength(0);
  act(() => result.current.play('ticket'));
  await waitFor(() => expect(engines[0].play).toHaveBeenCalledWith('ticket', undefined));
});
it('allows muting before audio creation and remembers the choice', () => {
  const { result, unmount } = renderHook(useHalloweenAudio);
  act(() => result.current.toggle()); act(() => result.current.play('door'));
  expect(engines).toHaveLength(0); expect(result.current.enabled).toBe(false);
  unmount(); expect(renderHook(useHalloweenAudio).result.current.enabled).toBe(false);
});
it('does not play stale cues after mute and can unmute during a slow load', async () => {
  const { result } = renderHook(useHalloweenAudio);
  // Create the engine first, then put its next unlock behind a slow resource load.
  act(() => result.current.play('ticket'));
  await waitFor(() => expect(result.current.pending).toBe(false));
  act(() => result.current.toggle());
  let finish!: (value: boolean) => void;
  engines[0].enable.mockImplementationOnce(() => new Promise<boolean>((resolve) => { finish = resolve; }));
  act(() => result.current.toggle()); // enable pending
  act(() => result.current.toggle()); // mute while pending, dispose old engine
  act(() => result.current.toggle()); // retry in a fresh user gesture
  await waitFor(() => expect(engines[1].play).toHaveBeenCalledTimes(1));
  const oldStarts = engines[0].play.mock.calls.length;
  await act(async () => { finish(true); });
  expect(engines[0].dispose).toHaveBeenCalledOnce();
  expect(engines[0].play).toHaveBeenCalledTimes(oldStarts);
  expect(result.current.enabled).toBe(true);
});
it('plays only the latest cue after resource loading', async () => {
  const { result } = renderHook(useHalloweenAudio);
  act(() => result.current.play('ticket'));
  await waitFor(() => expect(result.current.pending).toBe(false));
  act(() => result.current.toggle());
  let finish!: (value: boolean) => void;
  engines[0].enable.mockImplementationOnce(() => new Promise<boolean>((resolve) => { finish = resolve; }));
  act(() => result.current.toggle());
  act(() => result.current.play('door'));
  await act(async () => { finish(true); });
  expect(engines[0].play).toHaveBeenLastCalledWith('door', undefined);
  expect(engines[0].play).toHaveBeenCalledTimes(2);
});
