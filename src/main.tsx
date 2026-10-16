import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoconProvider } from 'locon/react';
import { Site } from './Site';
import { createWebI18n } from './i18n';
import './styles.css';

const root = createRoot(document.getElementById('root')!);
async function start() {
  const i18n = createWebI18n();
  await i18n.setLocale(i18n.getSnapshot().currentLocale);
  document.documentElement.lang = i18n.getSnapshot().currentLocale;
  document.title = i18n.l('surpr. — Dein Halloween-Streich');
  root.render(<StrictMode><LoconProvider instance={i18n}><Site /></LoconProvider></StrictMode>);
}
function retry() {
  void start().catch(() => {
    root.render(<main className="startup-error"><p>Couldn’t load surpr. / surpr. konnte nicht geladen werden.</p><button onClick={retry}>Try again / Erneut versuchen</button></main>);
  });
}
retry();
