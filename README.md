# ApostropheCMS & Vite Demo (based on the Essentials Starter Kit)<!-- omit from toc -->

This is a demo project that showcases advanced features of ApostropheCMS and Vite integration. It is based on the [Essentials Starter Kit](https://github.com/apostrophecms/starter-kit-assembly-essentials/tree/next). The Vite integration is still experimental (beta) and this demo uses a "nightly" version of ApostropheCMS and Apostrophe Vite module. The goal of this demo is to showcase the familiar for Vite based products features (like HMR, fast builds, and modern front-end frameworks support), configuration (the usual root level configuration files), but also some more powerful ways to integrate Vite specific features from within the ApostropheCMS project.

- [Installation](#installation)
  - [GitHub Codespaces](#github-codespaces)
  - [Local installation](#local-installation)
- [The demo](#the-demo)
- [The frameworks setup](#the-frameworks-setup)
- ["Smarter" Counter apps as widgets](#smarter-counter-apps-as-widgets)
  - [In depth setup explanation](#in-depth-setup-explanation)
    - [`modules/asset`](#modulesasset)
    - [`modules/counter`](#modulescounter)
    - [`modules/counter-page`](#modulescounter-page)
    - [`modules/@apostrophecms/home-page`](#modulesapostrophecmshome-page)
    - [`modules/counter-{vue|svelte|react}-widget`](#modulescounter-vuesveltereact-widget)
- [Tailwind CSS configuration steps](#tailwind-css-configuration-steps)
- [How it works (for nerds)](#how-it-works-for-nerds)
  - [Sources discovery](#sources-discovery)
  - [Sources aggregation](#sources-aggregation)
  - [Synthetic entrypoints](#synthetic-entrypoints)
  - [Build pipelines](#build-pipelines)
  - [Dev Server \& HMR](#dev-server--hmr)
- [The known problems and limitations](#the-known-problems-and-limitations)


## Installation

### GitHub Codespaces

You can use GitHub Codespaces to run this demo in the cloud. Click the button below to create a new Codespace:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/apostrophecms/vite-demo/tree/PRO-6807-demo-features)

Open a new terminal when the Codespace is ready and run the following commands:

```bash
$ node app @apostrophecms/user:add admin admin
## Type `admin` as the password when prompted
$ npm run dev
```

**Only if in the web VSCode editor:**
The easiest way to test HMR is to open the VSCode Preview (Ports tab in the bottom panel, click the Preview icon in the Forwarded Address section for port 3000). You can also open the app in your browser (VSCode will open a new tab with the preview URL) but in order to see the HMR in action you need to make port 3000 Public accessible (right click on the port number in the Ports tab and select Port Visibility -> Public).

ApostropheCMS uses MongoDB to store and manage data. The container comes with pre-installed MongoDB. Although not necessary for the demo, the container also has the VSCode extension for MongoDB installed so you can inspect the DB. You can use the `mongodb://llocalhost:27017` connection string and directly browse the dbu or use a mongodb playground to run e.g.:

```js
/* global use, db */
use('a4-playground');
db.getCollection('aposDocs').findOne({
  type: '@apostrophecms/home-page',
  aposMode: 'draft'
});
```

### Local installation

Clone the repository and install the dependencies:

```bash
$ git clone https://github.com/apostrophecms/vite-demo.git
$ cd vite-demo
$ npm install
```

If you don't have a MongoDB server running and you have docker compose installed, you can start a MongoDB server with:

```bash
$ docker compose up -d --remove-orphans
```

You can stop the MongoDB server later with:

```bash
$ docker-compose down
```

If this is the first time you are running the application, you will need to create an admin user:

```bash
$ node app @apostrophecms/user:add admin admin
```
Type `admin` as the password when prompted.

Finally, start the ApostropheCMS application:

```bash
$ npm run dev
```

You can test a production build with:

```bash
$ npm run build
$ npm run serve
```

## The demo

Open your browser and navigate to `http://localhost:3000`. Follow the login link and login with the username `admin` and the password `admin`. 

Hit Edit on the home page and add any desired number of "Vue Counter App", "Svelte Counter App", and "React Counter App" widgets by clicking on the "Add Content" button. After publishing using the button in the upper right corner (Update then Preview), you will see the counter apps in action.

You can also create a new page of type "Counter Apps Page" by going to the pages menu, selecting "New Page" and then selecting the page type from the menu on the right. Choose a title, publish and navigate to the page. Edit the page and add the "Vue Counter App", "React Counter App", and "Svelte Counter App" widgets to the main area. Widgets can be shared between basically any document type.

The counter apps will "remember" their state (until the application is restarted) even if you navigate away from the page or reload it. You can add multiple instances of the same widget to the page and they will work independently.

The apps are not loading the counter state via HTTP requests, but are using the server-side rendered initial data.

Open your favourite code editor and navigate to the `modules` folder. Inside you will find the code for each of the widgets and some other modules we will discuss. The `ui/src/app` directories of the `counter-react-widget`, `counter-vue-widget`, and `counter-svelte-widget` modules contain the files for the main app code of each. You can modify the counter apps (`App.vue`, `App.svelte` and `App.jsx`) and see the changes reflected in the browser without a full page reload (HMR).

## The frameworks setup

All frameworks except ReactJS are integrated via single project level `apos.vite.config.mjs` file. Any additional configuration files are also supported (e.g. `svelte.config.js`, `postcss.config.js`, etc).

For demonstration purposes (and because by default it requires additional page injection), ReactJS is configured via its own project module `vite-react`. Looking inside the `index.js` file of that module, this is accomplished using the Apostrophe Vite `build.vite` configuration that can be added to any project module. The module also injects the React refresh runtime required for React HMR, using the new conditional injection feature within the `init(self)` block. You can read more about this in the [documentation](https://docs.apostrophecms.org/guide/vite.html#development-specific-features).

This demo also has Tailwind CSS integrated site-wide and can be used in both front-end and back-end (Nunjucks) code. The configuration steps used while creating the demo are described below.

## "Smarter" Counter apps as widgets

The default template when creating a Vite app for React, Vue, or Svelte is a counter app. In this demo those are ported to the ApostropheCMS widgets: `counter-react-widget`, `counter-vue-widget`, and `counter-svelte-widget` respectively. The respective UI code can be found in `ui/src` directories of these modules. Every widget has its own bundle, which is loaded only when the widget is present on the page (and no user is logged in).

The widgets are registering [widget players](https://docs.apostrophecms.org/guide/custom-widgets.html#client-side-javascript-for-widgets) as a standard approach in ApostropheCMS. These players are client-side code that is registered by ApostropheCMS to be handled during page edit or refresh. This ensures that our apps will be re-mounted when the page is reloaded, but also when widget configuration changes.

Additionally, the default counter apps are enhanced to get initial data (props) from the server and save their state back to the server.

The Counter Apps are made available in the Home page widget area.

A page module `modules/counter-page` is created to demonstrate sharing these widgets between different document types. It has an area `main` where the widgets are registered. 

### In depth setup explanation

Let's demystify the counter apps and follow their integration step by step. There is ApostropheCMS specific context along the way, that I'll try to explain in the most simple way.

#### `modules/asset`

The module is inherited from the original Starter Kit Essentials repository and is simply a convenience for organizing some of our assets. It provides the original CSS used in the starter kit. For the purposes of this demo, we added the Tailwind CSS entrypoint (see `ui/src/index.js`) and a common `svg` asset files (`ui/svg`) referenced by the Counter App UI components.

#### `modules/counter`

This module contributes the back-end logic required to save the counter value per App Counter widget (on counter button click). The module provides: 
- A simple API endpoint using the Apostrophe `apiRoutes(self)` configuration method to save the counter value in the MongoDB database per widget instance.
- A method, `getWidgetCounter(id)`, to get the counter value per widget instance, used in the async server component to pass that value as a prop to the front-end app.
- A Nunjucks helper filter (`toAttributeValue(obj)`) and a server component. The component is defined in the `counterApp()` component method and the template is located in the `views` folder. In ApostropheCMS, components act much like they do in other frameworks, allowing you to add specific functionality to any of your templates. In this case, we are serializing server-side data and sending it to the front-end app via `data-*` attributes.

#### `modules/counter-page`

A simple Apostrophe page that provides a widget area containing only the Counter App widgets. In ApostropheCMS, you can configure many modules site-wide by configuring the `options` object in the `index.js` file of the module. Many widgets also allow for configuration options to be added "per area". In other words, each area can have widgets with different configurations. This module demonstrates sending `options` defined within the widget configuration object to the front-end app. The `example` property can be seen in the JSON object seen by the "Show Debug" toggle for any of the counters.

#### `modules/@apostrophecms/home-page`

It [improves](https://docs.apostrophecms.org/reference/module-api/module-overview.html#improve) the Apostrophe core Home page module. It's originally used by the Starter Kit to provide a styled home page. In this demo, we are adding the Counter App widgets to the widget area, alongside the existing Rich Text, Image, and Video widgets.

#### `modules/counter-{vue|svelte|react}-widget`

`counter-vue-widget`, `counter-svelte-widget`, and `counter-react-widget` are the Counter App widgets. They use an identical setup, with the only difference being the front-end framework used (`App.vue`, `App.svelte`, and `App.jsx` respectively). The widgets are registering a widget player within the `ui/src` folder that mounts the front-end app on the page, importing the App from the `ui/src/app` folder. No initial HTTP requests for the counter value are made, the initial data is passed from the server to the front-end app via `data-*` attributes. On every counter button click, the counter value is saved to the server. After refreshing the page, the counter server value is used as the initial value for the counter app.

**Be careful**, the counter back-end doesn't like the number `9` for some reason! The reason is artificial for the purposes of this demo. However, the UI apps are smart enough to handle server errors and display a message to the user.

Let's look at the `counter-vue-widget` as an example:

- `index.js` - The module definition. It adds a single schema field `title` to the widget. You can [extend the schema with additional fields](https://docs.apostrophecms.org/reference/field-types/). The widget data is sent to `App.vue` as the `widget` prop. There is also `build.vite.bundles` configuration that tells ApostropheCMS to bundle the UI source of this widget separately and load it only when the widget is present on the page (if an editor is logged in, all bundles are loaded). The UI entrypoint becomes the bundle name `ui/src/counter-vue.js` instead of the default `ui/src/index.js`.
- `views/widget.html` - The widget template. It invokes the Nunjucks server component `counterApp` created in `modules/counter` to generate the markup for the widget.
- `ui/src/counter-vue.js` - The entrypoint for the widget UI. Every module UI entrypoint should have a default export function that acts as an "application" bootstrap. In this case, the entrypoint registers a [Widget Player](https://docs.apostrophecms.org/guide/custom-widgets.html#client-side-javascript-for-widgets) (a selector and handling function) that mounts the Vue app on the page and passing server data as props.
- `ui/src/app/App.vue` - The Vue Counter app. It receives the `widget` prop with the initial data from the server. The app has a single `counter` state that is updated on the button click. The counter value is saved to the server on every button click. The app is using the `svg` assets provided by the `modules/asset` module. The "Show Debug" toggle shows the component props received from the server.

## Tailwind CSS configuration steps 

The following steps were performed to integrate Tailwind CSS with ApostropheCMS, following the official guide: https://tailwindcss.com/docs/guides/vite

It's not necessary to follow these steps to use the demo. They are provided as a reference for those who want to integrate Tailwind CSS with ApostropheCMS.

1. Install Tailwind CSS (we skip `postcss` because it's internally managed by `vite`):
```bash
npm install -D tailwindcss autoprefixer
```

2. Init
```bash
npx tailwindcss init -p
```

3. Edit the created `tailwind.config.js` to become:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apos-build/@apostrophecms/vite/default/src/**/*.{js,jsx}',
    './modules/**/views/**/*.html',
    './views/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
Edit `apos.vite.config.js` to exclude the nunjucks templates from triggering page reloads:
```js
  // ...
  server: {
    watch: {
      // So that Tailwind CSS changes in the nunjucks templates do not trigger
      // page reloads. This is done by `nodemon` because we need a process restart.
      ignored: [
        path.join(__dirname, 'modules/views/**/*.html'),
        path.join(__dirname, 'views/**/*.html')
      ]
    }
  }
  // ...
```

4. Create `./modules/asset/ui/src/tailwind.css` with the following content:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Edit `./modules/asset/ui/src/index.js` to import the CSS file:
```js
import './tailwind.css'
// The rest is the same
```
> The `tailwind.css` file could also be imported into a `./modules/asset/ui/src/index.scss` file. Here we were adapting a site with existing styling, so it was cleaner to bring it into the `index.js` file.

6. Edit `./modules/@apostrophecms/home-page/views/page.html` and add (server side rendering testing):
```html
    <div class="text-center">
      <span class="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 leading-3">
        Hello World From Tailwind CSS
      </span>
    </div>
```

7. `npm run dev`

Tailwind now works for both server-side and client-side rendering (HMR included). The original starter kit styles are preserved.

## How it works (for nerds)

The demo uses our brand new `@apostrophecms/vite` module to integrate Vite with ApostropheCMS. In order for us to achieve that, we developed a brand new system in the core to support "external build tools" and went from hardcoded page script injection to a manifest-based approach. Additionally, we added an abstract public API to the core, that simplifies source discovery and synthetic entrypoints, so that build tools can concentrate on bundle vendor specific logic. This architecture allows us to support multiple build tools and configurations in the future, if the need for that arises.

The internal Apostrophe Webpack build is still fully supported, using the legacy build system. 

### Sources discovery

ApostropheCMS is a fully "module-based" platform. Every piece of code is contributed by an Apostrophe module - both front and server side. Modules can be `npm` packages or local directories. Local modules live in `./modules` directory of the project. Local modules can also extend or improve other modules, including npm and ApostropheCMS core modules.

Every module can contribute to the front-end code. The front-end code is located in the `ui/` directory of the module. A module can also extend the Apostrophe admin UI, by providing/overriding additional Vue components, CSS, or JavaScript code. 

There is a clear distinction between "public" and "admin" UI code. We call them `public` and `apos` builds respectively. We are building those in separate pipelines, with separate configurations, and we are serving the code from separate directories. The project can only configure the `public` build, the `apos` build is managed entirely internally.

The entrypoints for the `public` build are discovered by scanning the `ui/src` directories of all modules registered in `app.js`. The default entrypoint is `ui/src/index.js`, but modules can also define `bundles` in their configuration (which is done in this demo) that results in `ui/src/[bundle-name].js` being used as an entrypoint. Additionally, bundles are only loaded when the module that defines them is present on the page (or if a user is logged in).

 Every entrypoint should have a default export function that acts as "application" bootstrap - it's internally called by ApostropheCMS when the page is loaded.

The `apos` build sources are scanned in a similar way, but in `ui/apos` directories. I'm not going to deep dive into the `apos` build specifics here, for those interested there is [extensive documentation in the ApostropheCMS documentation site](https://docs.apostrophecms.org/guide/custom-ui.html#components-with-a-logic-mixin-are-safer-and-easier-to-override).

### Sources aggregation

It's impractical to build/watch sources scattered across multiple directory trees, including inside `node_modules/`. Furthermore, smart bundlers are optimizing sources located in `node_modules/` and doesn't allow HMR for them - something that we don't want in some cases. Keep in mind that the Apostrophe admin UI is also not pre-built, the entire UI is built in and for the project, so that any module can modify it.

We are aggregating all sources into a single directory tree, that is then used by Vite to build the final bundles. This is done by computing something we call `build metadata` that contains every file considered a UI `source` and its relation to an Apostrophe module. This opens a lot of awesome possibilities, but also (there is no free lunch) introduces unique (fun) problems to solve.

All sources are copied to `./apos-build` directory of the project. To be more precise - `./apos-build/@apostrophecms/vite/default/src` is the exact location, where that same path excluding the `src` folder is the build (Vite) root. The namespacing is required to avoid conflicts between different build tools (in the future) and configurations (configured project namespace, Apostrophe Assembly multisite just to name a few). When copying the sources, we are preserving the original directory structure by only "skipping" the `ui/` part of the path. This way building the sources becomes a trivial task for Vite. The "smart copy" is also handling (in an extremely efficient way) source overrides as a result of module inheritance (extend/improve).

We can also easily support editor autocompletion and other goodies, by introducing a universal alias `@/` that points to the `./apos-build/@apostrophecms/vite/default/src` directory and configure it in `jsconfig.json` or `tsconfig.json` of the project (to make editors happy). 

### Synthetic entrypoints

The `build metadata` is used to generate synthetic entrypoints for Vite. They are internally registered as `build.rollupOptions.input` in the Vite configuration. 

For `public` builds, every `input` is an auto-generated `[input-name].js` file that imports previously discovered module sources. All `ui/src/index.js` apps are imported and executed in a single `input`, while every configured `bundle` is imported and executed in a separate `input`. The import paths are relative to the `./apos-build/@apostrophecms/vite/default/src` directory. 

The `apos` build contains a single auto-generated `input` that handles everything, from component registration, 3rd party modules integration to admin UI specific `apps`.

### Build pipelines

Historically, ApostropheCMS builds `apos` (admin UI) and `public` (site UI) code in separate pipelines. There is a good reason for that - we don't want the admin UI to interfere with the project UI and vice versa. The same problem exists with the Vite integration. We made an attempt to build everything in a single pipeline, but it was a disaster. The main problem comes from configration that can't be shared between the two builds, mostly Sass and PostCSS (generally CSS) configuration.

Keep in mind that the `apos` bundle is loaded on a page only when editor is logged in, so the performance impact is not that big an issue.

### Dev Server & HMR

As a consequence of the above, the dev server (Vite middleware) can run in only "one mode" - `public` or `apos` (Apostrophe `asset` module configuration). While not ideal, this was a good compromise that allows us to have a fast and reliable development experience.

The Vite module is reusing (in-memory) the same metadata used for copying sources in order to deliver another feature that makes HMR possible - watch mode handling. The core system is using `chokidar` to watch for changes in every known `ui/` directory of the project or in symlinked npm package. The Vite module is using additional index to ensure fast reaction on changes including "smart copy" of the changed files to the `./apos-build` directory. This is the trigger for Vite to deliver HMR to the browser.

## The known problems and limitations

- The `apos` HMR is not working when the `public` build contains Vue apps. The reason for that lies in the fact that the `apos` and `public` builds can't share the same Vue instance. As a result of that, HMR is available to the "first" Vue instance that is loaded on the page. There are some ideas that we are exploring to solve this problem.
- No SSR yet. UI Apps can receive initial data from the server, but the real server-side rendering (render on the server per framework, mount and hydrate on the client) is yet to be planned and implemented.
- Following alias imports (`@/path/to/file`) in an editor will lead to the `apos-build` directory, not the original source. This is confusing and far from a good DX. We are exploring ways to solve this problem for all editors that support Typescript configuration files.

