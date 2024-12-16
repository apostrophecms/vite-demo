import apostrophe from 'apostrophe';

apostrophe({
  shortName: 'a4-playground',
  root: import.meta,
  modules: {
    // Apostrophe module configuration
    // *******************************
    //
    // NOTE: most configuration occurs in the respective modules' directories.
    // See modules/@apostrophecms/page/index.js for an example.
    //
    // Any modules that are not present by default in Apostrophe must at least
    // have a minimal configuration here to turn them on: `moduleName: {}`
    // ***********************************************************************
    // `className` options set custom CSS classes for Apostrophe core widgets.
    '@apostrophecms/rich-text-widget': {
      options: {
        className: 'bp-rich-text'
      }
    },
    '@apostrophecms/image-widget': {
      options: {
        className: 'bp-image-widget'
      }
    },
    '@apostrophecms/video-widget': {
      options: {
        className: 'bp-video-widget'
      }
    },
    // The starter kit base styles. Integrates Tailwind CSS for the
    // purpose of this demo. Adds the global counter apps styles as seen
    // in the default `vite create` template.
    asset: {},
    // use vite for asset bundling and HMR in development.
    '@apostrophecms/vite': {},

    // `vite-react` adds React support to the project's Vite configuration.
    // Also adds the React Refresh runtime to the head of the page in HMR mode.
    // All other frameworks are configured in the `apos.vite.config.js` file.
    'vite-react': {},

    // module delivering counter apps backend features (route, templates, etc.)
    counter: {},

    // The page containing the counter apps as widgets. Widgets are also
    // available (shared with) in the Home page (@apostrophecms/home-page).
    'counter-page': {},

    // The counter app widgets
    'counter-vue-widget': {},
    'counter-svelte-widget': {},
    'counter-react-widget': {}
  }
});
