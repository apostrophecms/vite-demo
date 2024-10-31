import { debounce } from 'lodash';
import { mount } from 'svelte';
import App from './app/App.svelte';

const mountDebounced = debounce(mount, 100);

// Environments are available here (`import.meta.env.PROD`, `import.meta.env.DEV`, etc.)
// https://vite.dev/guide/env-and-mode.html
export default () => {
  apos.util.widgetPlayers['counter-svelte'] = {
    selector: '[data-apos-svelte-widget]',
    player: function (el) {
      // 1. Grab the data from the `data-*` attributes.
      // See `modules/asset/ui/src/index.js` for the implementation
      const {
        id,
        editMode,
        widget,
        options
      } = apos.util.parsePlayerData(el);

      // 2. Debounce the mount if we are in edit mode (player triggered multiple times)
      const effectiveMount = editMode === 'true'
        ? mountDebounced
        : mount;

      // 3. Mount and render the app
      effectiveMount(App, {
        target: el,
        props: {
          id,
          widget,
          options
        }
      });
    }
  };
};
