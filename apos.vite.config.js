import { defineConfig } from '@apostrophecms/vite/vite';

// import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// import tailwindcss from '@tailwindcss/vite';

import path from 'node:path';

export default defineConfig({
  plugins: [
    // See ./modules/vite-react/index.js for ReactJS integration via module
    // `build` configuration.
    vue(),
    svelte({
      // We need to tell Svelte where to find the config file,
      // because the Vite root is not the same as the Apostrophe root.
      configFile: path.join(process.cwd(), 'svelte.config.js')
    })
    // We are not using the recommended vite plugin yet,
    // but postcss. The reason for that is a strange, buggy behavior.
    // There is a chance tailwind vite plugin is built for Vite v6.
  ],
  server: {
    watch: {
      // So that Tailwind CSS changes in the nunjucks templates do not trigger Vite
      // page reloads. This is done by `nodemon` because we need a process restart.
      ignored: [
        '**/modules/views/**/*.html',
        '**/views/**/*.html'
      ]
    }
  }
});
