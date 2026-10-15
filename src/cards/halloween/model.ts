import type { CardPresentationProps } from '../types';

export const HALLOWEEN_TEMPLATE_ID = 'halloween-surprise-v1';
export const characters = ['ghost', 'pumpkin', 'vampire'] as const;
export type HalloweenCharacter = (typeof characters)[number];

export interface HalloweenSurpriseProps extends CardPresentationProps {
  character: HalloweenCharacter;
}

export const characterNames: Record<HalloweenCharacter, string> = {
  ghost: 'Geist',
  pumpkin: 'Kürbis',
  vampire: 'Vampir',
};

export const defaultPersonalization = {
  recipientName: 'Sophie',
  message: 'Erwischt! Du schuldest mir jetzt eine Handvoll Süßigkeiten. Wir sehen uns auf der dunklen Seite der Party. Happy Halloween!',
  character: 'ghost' as HalloweenCharacter,
};

export function normalizePersonalization(input: Omit<HalloweenSurpriseProps, 'previewMode'>) {
  return {
    recipientName: input.recipientName.trim().replace(/\s+/g, ' '),
    message: input.message.trim(),
    character: input.character,
  };
}

export function validatePersonalization(input: Omit<HalloweenSurpriseProps, 'previewMode'>) {
  const errors: { recipientName?: string; message?: string; character?: string } = {};
  if (input.recipientName.length < 1 || input.recipientName.length > 40) {
    errors.recipientName = 'error.name';
  }
  if (input.message.length < 1 || input.message.length > 300) {
    errors.message = 'error.message';
  }
  if (!characters.includes(input.character)) {
    errors.character = 'error.character';
  }
  return errors;
}
