import { createApp } from 'vue';
import { parse } from '@/counter/src/player';
import App from './app/App.vue';

// Environments are available here (`import.meta.env.PROD`, `import.meta.env.DEV`, etc.)
// https://vite.dev/guide/env-and-mode.html

// Apos widget player is executed when needed - initial page load, widget
// refresh, etc.
export default () => {
  apos.util.widgetPlayers['counter-vue'] = {
    selector: '[data-apos-vue-widget]',
    player
  };
};

function player(el) {
  // 1. Do nothing if no element or if already mounted
  if (!el || el.childNodes.length > 0) {
    return;
  }
  // 2. Grab the data from the `data-*` attributes.
  // See `modules/asset/ui/src/player.js` for the implementation.
  // Showcasing module aliasing (see the import statement at the top).
  const {
    id,
    widget,
    options
  } = parse(el);
  // 3. Mount and render the app
  createApp(App, {
    id,
    widget,
    options
  }).mount(el);
}
