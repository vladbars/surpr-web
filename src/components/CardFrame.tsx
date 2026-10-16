import { L, useLocon } from 'locon/react';
import type { ReactNode } from 'react';
import './card-frame.css';

interface CardFrameProps {
  step: number;
  steps: readonly string[];
  previewMode: boolean;
  children: ReactNode;
  controls?: ReactNode;
}

/** Shared presentation only; each occasion owns its artwork and scene logic. */
export function CardFrame({ step, steps, previewMode, children, controls }: CardFrameProps) {
  const { l } = useLocon();
  return (
    <div className="card-frame">
      <header className="card-topline">
        <span className="wordmark wordmark--small">surpr<span>.</span></span>
        <div className="card-controls"><span className="card-edition"><L>{previewMode ? 'VORSCHAU' : 'FÜR DICH'}</L></span>{controls}</div>
      </header>
      {children}
      <footer className="card-bottomline">
        <span className="scene-counter">0{step + 1} / 0{steps.length}</span>
        <ol className="scene-progress" aria-label={l('Fortschritt')}>
          {steps.map((label, index) => (
            <li key={label} aria-label={`${index + 1}. ${label}`} aria-current={step === index ? 'step' : undefined} className={index <= step ? 'is-complete' : undefined} />
          ))}
        </ol>
        <span className="card-signature">{steps[step]}</span>
      </footer>
    </div>
  );
}
