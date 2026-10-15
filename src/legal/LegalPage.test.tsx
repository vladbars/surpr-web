import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../test/render';
import { Site } from '../Site';

describe('legal pages', () => {
  it('keeps the legal route and updates content and document metadata when changing language', async () => {
    const user = userEvent.setup();
    await render(<Site pathname="/impressum/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Impressum');
    expect(screen.getByText('DE442622151')).toBeVisible();
    expect(screen.getByRole('link', { name: 'kontakt@vlad.mobi' })).toHaveAttribute('href', 'mailto:kontakt@vlad.mobi');
    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Imprint');
    expect(document.title).toBe('Imprint — surpr.');
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByRole('link', { name: 'Imprint' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('removes only Surpr preferences and leaves the current language usable', async () => {
    localStorage.setItem('surpr.locale', 'en');
    localStorage.setItem('surpr.sound', 'off');
    localStorage.setItem('unrelated', 'keep');
    const user = userEvent.setup();
    await render(<Site pathname="/delete" />, 'en');
    await user.click(screen.getByRole('button', { name: 'Reset saved preferences' }));
    expect(localStorage.getItem('surpr.locale')).toBeNull();
    expect(localStorage.getItem('surpr.sound')).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep');
    expect(screen.getByRole('status')).toHaveTextContent('have been removed');
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not report successful removal when browser storage is blocked', async () => {
    const user = userEvent.setup();
    await render(<Site pathname="/delete" />);
    const blocked = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Blocked'); });
    try {
      await user.click(screen.getByRole('button', { name: 'Gespeicherte Einstellungen zurücksetzen' }));
      expect(screen.getByRole('status')).toHaveTextContent('blockiert');
    } finally { blocked.mockRestore(); }
  });
});
