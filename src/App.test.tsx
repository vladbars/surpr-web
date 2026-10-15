import { render } from './test/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('local demo', () => {
  it('validates whitespace and applies normalized content only on preview', async () => {
    const user = userEvent.setup();
    await render(<App />);
    const name = screen.getByLabelText('01 / Für wen?');
    await user.clear(name);
    await user.type(name, '   ');
    await user.click(screen.getByRole('button', { name: /Vorschau ansehen/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('1 bis 40');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('heading', { name: 'Hey Sophie…' })).toBeInTheDocument();

    await user.clear(name);
    await user.type(name, '  Alex   Marie  ');
    await user.click(screen.getByRole('radio', { name: 'Vampir' }));
    await user.click(screen.getByRole('button', { name: /Vorschau ansehen/ }));
    expect(screen.getByRole('heading', { name: 'Hey Alex Marie…' })).toBeVisible();
    expect(name).toHaveValue('Alex Marie');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vampir' })).toBeChecked();
  });
});
