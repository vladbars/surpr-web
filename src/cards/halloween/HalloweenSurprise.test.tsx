import { render } from '../../test/render';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HalloweenSurprise } from './HalloweenSurprise';
import { characters, defaultPersonalization } from './model';
import { setReducedMotion } from '../../test/setup';

describe('HalloweenSurprise', () => {
  it.each(characters)('plays all five scenes with %s and resets on replay', async (character) => {
    const user = userEvent.setup();
    const { container } = await render(<HalloweenSurprise {...defaultPersonalization} character={character} />);
    expect(screen.getByRole('heading', { name: 'Hey Sophie…' })).toBeVisible();
    expect(container.querySelector('[aria-current="step"]')).toHaveAttribute('aria-label', '1. Die Einladung');

    await user.click(screen.getByRole('button', { name: /Überraschung öffnen/ }));
    const doorHeading = screen.getByRole('heading', { name: 'Traust du dich?' });
    expect(doorHeading).toHaveFocus();
    await user.click(screen.getByRole('button', { name: /Anklopfen/ }));
    expect(screen.getByRole('heading', { name: 'Buh, Sophie!' })).toBeVisible();
    expect(container.querySelector(`[data-character="${character}"]`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Nachricht lesen/ }));
    expect(screen.getByRole('heading', { name: 'Für dich, Sophie.' })).toHaveFocus();
    expect(container.querySelector('.personal-message > [aria-hidden="true"]')).toHaveTextContent(defaultPersonalization.message);
    expect(screen.queryByRole('button', { name: 'Alles anzeigen' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Zum großen Finale/ }));
    expect(screen.getByRole('heading', { name: 'Happy Halloween!' })).toBeVisible();
    expect(screen.getByRole('link', { name: /Auch eine Überraschung erstellen/ })).toHaveAttribute('href', '/');

    await user.click(screen.getByRole('button', { name: /Noch einmal ansehen/ }));
    expect(screen.getByRole('heading', { name: 'Hey Sophie…' })).toHaveFocus();
    expect(container.querySelector('[data-scene]')).toHaveAttribute('data-scene', 'intro');
    expect(container.querySelector('[aria-current="step"]')).toHaveAttribute('aria-label', '1. Die Einladung');
  });

  it('renders user input as text, including HTML payloads and line breaks', async () => {
    const user = userEvent.setup();
    const recipientName = '<img src=x onerror=alert(1)>';
    const message = '<script>alert(1)</script>\nMit Liebe 🧡';
    const { container } = await render(<HalloweenSurprise recipientName={recipientName} message={message} character="ghost" previewMode />);
    expect(screen.getByRole('heading')).toHaveTextContent(recipientName);
    await user.click(screen.getByRole('button', { name: /Überraschung öffnen/ }));
    await user.click(screen.getByRole('button', { name: /Anklopfen/ }));
    await user.click(screen.getByRole('button', { name: /Nachricht lesen/ }));
    expect(container.querySelector('.personal-message > [aria-hidden="true"]')?.textContent).toBe(message);
    expect(container.querySelector('img, script')).toBeNull();
    await user.click(screen.getByRole('button', { name: /Zum großen Finale/ }));
    expect(screen.queryByRole('link', { name: /Auch eine Überraschung erstellen/ })).not.toBeInTheDocument();
    expect(screen.getByText('VORSCHAU')).toBeVisible();
  });

  it('opens the animated door, reveals text and can skip typing', async () => {
    setReducedMotion(false);
    const user = userEvent.setup();
    const { container } = await render(<HalloweenSurprise {...defaultPersonalization} />);
    await user.click(screen.getByRole('button', { name: /Überraschung öffnen/ }));
    await user.click(screen.getByRole('button', { name: /Anklopfen/ }));
    expect(screen.getByRole('button', { name: /Die Tür öffnet sich/ })).toBeDisabled();
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Buh, Sophie!' })).toBeInTheDocument(), { timeout: 4000 });
    await user.click(screen.getByRole('button', { name: /Nachricht lesen/ }));
    await user.click(screen.getByRole('button', { name: 'Alles anzeigen' }));
    expect(container.querySelector('.personal-message > [aria-hidden="true"]')).toHaveTextContent(defaultPersonalization.message);
    expect(screen.queryByRole('button', { name: 'Alles anzeigen' })).not.toBeInTheDocument();
  });

  it('responds to reduced motion changing while the door is opening', async () => {
    setReducedMotion(false);
    const user = userEvent.setup();
    await render(<HalloweenSurprise {...defaultPersonalization} />);
    await user.click(screen.getByRole('button', { name: /Überraschung öffnen/ }));
    await user.click(screen.getByRole('button', { name: /Anklopfen/ }));
    act(() => { setReducedMotion(true); });
    expect(screen.getByRole('heading', { name: 'Buh, Sophie!' })).toBeInTheDocument();
  });
});
