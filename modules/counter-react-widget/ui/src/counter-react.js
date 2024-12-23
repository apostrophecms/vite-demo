import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { parse } from '@/counter/src/player';
import App from './app/App.jsx';

// Environments are available here (`import.meta.env.PROD`, `import.meta.env.DEV`, etc.)
// https://vite.dev/guide/env-and-mode.html

// Apos widget player is executed when needed - initial page load, widget
// refresh, etc.
export default () => {
  apos.util.widgetPlayers['counter-react'] = {
    selector: '[data-apos-react-widget]',
    player
  };
};

function player(el) {
  // 1. Do nothing if no element or if already mounted
  if (!el || el.childNodes.length > 0) {
    return;
  }
  // 2. Grab the data from the `data-*` attributes.
  // See `modules/asset/ui/src/index.js` for the implementation
  const {
    id,
    widget,
    options
  } = parse(el);
  // 3. Mount and render the app
  const app = createElement(App, {
    id,
    widget,
    options
  });
  createRoot(el).render(app);
}
