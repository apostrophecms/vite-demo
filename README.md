# ApostropheCMS and Vite demo (based on the essentials starter kit)

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

**Only in the web VSCode editor:**
The easiest way to test HMR is to open the VSCode Preview (Ports tab in the bottom panel, click the Preview icon in the Forwarded Address section for port 3000). You can also open the app in your browser (VSCode will open a new tab with the preview URL) but in order to see the HMR in action you need to make port 3000 Public accessible (right click on the port number in the Ports tab and select Port Visibility -> Public).

The container comes with pre-installed MongoDB and VSCode extension for MongoDB. It will open a new tab in your browser editor and you can connect to the MongoDB server with Open Form -> Connect to MongoDB button. You can then use Create playground to run queries against the database. Replace the default template contents with the following and click Run:

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

You can now create a new page of type "Counter Apps Page". Choose a title, publish and navigate to the page. Edit the page and add the "Vue Counter App", "React Counter App", and "Svelte Counter App" widgets to the main area. The counter apps will "remember" their state (until the application is restarted) even if you navigate away from the page or reload it. You can add multiple instances of the same widget to the page and they will work independently.

Open your favourite editor and navigate to the `ui/src` directories of the `counter-react-widget`, `counter-vue-widget`, and `counter-svelte-widget` modules. You can modify the counter apps (`App.vue`, `App.svelte` and `App.jsx`) and see the changes reflected in the browser without a full page reload (HMR).

## The frameworks setup

All frameworks except ReactJS are integrated via single project level `apos.vite.config.mjs` file. Any additional configuration files are also supported (e.g. Svelte's `svelte.config.js`).

For demonstration purposes, ReactJS is configured via its own project module `vite-react`, using the supported by Apostrophe Vite `build.vite` module configuration. The module also injects the React refresh runtime required for React HMR, using the new conditional injection feature.

Tailwind CSS is integrated site-wide and can be used in both front-end and back-end (nunjucks) code. The configuration steps used while creating the demo are described below.

## Counter apps as widgets

The default template when creating Vite app for React, Vue, or Svelte is a counter app. In this demo those are ported to ApostropheCMS widgets: `counter-react-widget`, `counter-vue-widget`, and `counter-svelte-widget` respectively. The respective UI code can be found in `ui/src` directories of these modules. Every widget has its own bundle, which is loaded only when the widget is present on the page (and no user is logged in).

Additionally, the default counter apps are enhanced to get initial data (props) from the server and communicate their state back to the server.

A page module `modules/counter-page` is created to demonstrate the usage of these widgets. It has an area `main` where you can add the widgets. 

The `modules/asset` module provides common features shared between all widgets and some integrations frameowrk specific integrations:
- a common CSS file to style the original counter app in a similar to the original style
- integrates `tailwindcss` for styling (see below)
- provides common nunjucks filter to stringify objects for `data-*` attributes
- a `counter` API endpoint to save the counter value per widget (with fake in-memory storage instead of a real database - all values will be "forgotten" after a server restart)
- the React refresh runtime injection, required for React HMR with Vite

## Tailwind CSS configuration steps 

The following steps were performed to integrate Tailwind CSS with ApostropheCMS, following the official guide: https://tailwindcss.com/docs/guides/vite

It's not needed to follow these steps to use this demo. They are provided as a reference for those who want to integrate Tailwind CSS with ApostropheCMS.

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
Edit `apos.vite.config.mjs` to exclude the nunjucks templates from triggering page reloads:
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

6. Edit `./modules/@apostrophecms/home-page/views/page.html` and add (server side rendering testing):
```html
    <div class="text-center">
      <span class="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 leading-3">
        Hello World <br />
        From Tailwind CSS
      </span>
    </div>
```

7. `npm run dev`

Tailwind now works for both server-side and client-side rendering (HMR included). The original starter kit styles are preserved.

