import { App } from './App';
import { legalLinks } from './SiteChrome';
import { LegalPage } from './legal/LegalPage';

export function Site({ pathname = window.location.pathname }: { pathname?: string }) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const legalRoute = legalLinks.find((route) => route.path === path);
  return legalRoute ? <LegalPage page={legalRoute.id} /> : <App />;
}
