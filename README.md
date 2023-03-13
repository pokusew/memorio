# memorio

An app for practicing test questions

👉 Available online at [next.memorio.pokusew.cz](https://next.memorio.pokusew.cz/)

The app offers an effective way for practicing test questions of different types (single-choice,
multiple-choice, images identification, etc.). The main features are:
* **Progress tracking** – the app tracks and calculates success rates for all questions,
  categories and packages. Offers individualized practice tests (concentrate on questions with low success
  rates). Progress synchronization across devices. Requires login.
* **Responsive UI** – works on **mobile** and **desktop** devices.
* **Markdown and LaTeX** – questions can contain Markdown and LaTeX.
* **Question editor** – currently only for admin users.
* Does **NOT** work offline (yet) – for the original version with **full offline support** (but no progress
  synchronization across devices) see 👉 [this branch](https://github.com/pokusew/memorio/tree/main).
* It is a [PWA] (Progressive web app)
  – runs in browser (no installation needed), works on **mobile** and **desktop** devices and can be also
  added to the OS home screen / app launcher for better standalone usage.

The code is written in **[TypeScript]**
and **[React.js]**. See more in the [Architecture](#architecture) section.

🚧 **Note:** This is still work in progress. **The app is already usable.** But some features should be
added/improved to make it more useful. Some of them are mentioned [here](./TODO.md).


## Content

<!-- **Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Description](#description)
- [Architecture](#architecture)
	- [Technology highlights](#technology-highlights)
	- [Project structure](#project-structure)
- [Development](#development)
	- [Requirements](#requirements)
	- [Set up](#set-up)
	- [Available commands](#available-commands)
- [Deployment](#deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Description

The app offers an effective way for practicing test questions of different types (single-choice,
multiple-choice, images identification, etc.). Currently, only multiple-choice questions are implemented.

The content is divided by topic into _packages_. Each package contains one or more _categories_. Categories
group similar _questions_. Contents of packages and categories can be browsed.

The app tracks user's progress across packages, categories and questions. It calculates the ratio between the
correct and wrong answers. The scores can be reset at any time in the settings.

The app features _practice mode_ in which users can practice answering the questions of a selected package.
Within the package, a set of specific categories can se selected for practicing. During the practice, the
questions can be sorted in three different ways depending on user's preferences:
1. by progress (the questions with the lowest success rate first)
2. randomly
3. by order (questions' number)

Furthermore, the answers are checked continuously and the score is immediately updated. Upon an answer
validation, a sound is played (to audibly indicate correct vs wrong answers). The sound effects can be
enabled/disabled in the settings.

Upon first opening of the package, all its data are automatically downloaded for future offline usage. The
downloaded content can be used even when the app is offline. All app data can be purged at any time in the
settings.

The UI of the app is fully translated and localized into Czech and English. By default, the app automatically
detects the locale to be used from the browser preferences. In addition, the locale can be changed manually in
the app settings.


## Architecture

_Currently_, it is a client-side-only application (SPA).
**It runs completely in the browser**, and it
**uses [Firebase's Cloud Firestore][firebase-cloud-firestore] database to store all data**.

The code is written in **[TypeScript]** and **[React.js]**.

The project has [just a few production dependencies](./package.json#L31-L44).
Everything else is implemented from scratch.


### Technology highlights

📌 **Special part** of this project was also the process of extracting test questions from printed books. I
did it using AI-powered **OCR** 👀 and custom semantic parser. The more details can be found in
the **[pokusew/testbook-ocr]** repository.

**Tooling:**
* [webpack] – custom configs, custom plugins
* [Babel]
* [ESLint], [AVA] (tests), GitHub Actions (CI/CD)
* [Netlify] for [Deployment](#deployment)
* CSS written in [Sass] (SCSS), vendor prefixes automatically added by [Autoprefixer] with [Browserslist]

**Features:**
* Service Worker, Cache Storage, Local Storage, IndexedDB
* full offline support (app-shell precache + content downloading)
* [Subresource Integrity (SRI)][]
  for all scripts and styles included from index.html
* PWA, [web app manifest](./app/manifest.json) including [maskable icons][web-dev-maskable-icons]
* custom **routing** solution for React on top of
  the [History API]
* custom state management for React (with persistence to Local Storage)
* **i18, l10n**
	* [Intl API] (time, numbers, plurals), see for example
	  the [LocalizedDate](./app/components/LocalizedDate.tsx) component
	* advanced ICU messages, see for
	  example [this message](https://github.com/pokusew/memorio/blob/master/app/i18n/translations.cs.js#L25)
	* automatic locale detection/negotiation (`navigator.languages`) with support for overwriting the locale
	  on the app-level, see [LocaleLoader](./app/containers/LocaleLoader.tsx) component
* CSS
	* fully responsive
	* Flexbox, Grid [[*]](./app/styles/components/_app.scss), [[*]](./app/styles/components/_card.scss)
	* animations
	  [[*]](https://github.com/pokusew/memorio/blob/master/app/styles/components/_spinkit.scss#L31),
	  transitions
	  [[*]](https://github.com/pokusew/memorio/blob/master/app/styles/components/_option-checkbox.scss#L15),
	  transforms
	  [[*]](https://github.com/pokusew/memorio/blob/master/app/styles/components/_option-checkbox.scss#L31)
	* media queries [[*]](./app/styles/components/_card.scss)
	* advanced CSS selectors (e.g. `.toggle-checkbox-input:checked + .toggle-checkbox-label::before`,
	  `:not(:last-child)`)
* HTML5 semantic elements
* audio effects (HTML5 Audio), see [SoundPlayer](./app/sounds/sound-player.ts)


### Project structure

The source code is in the [app](./app) directory. Some directories contain feature-specific READMEs. The
following diagram briefly describes the main directories and files:

```text
. (project root dir)
├── .github - GitHub config (GitHub Actions)
├── app - the app source code
│   ├── components - common React components
│   ├── containers
│   │   ├── LocaleLoader - locale loader
│   │   ├── PageRouter - top-level app specific routing component
│   │   └── Root - root component
│   ├── data - Firestore queries wrappers and hooks
│   ├── data - Firebase integration wrappers
│   ├── forms-experimental - a custom solution for forms in React (not used)
│   ├── helpers - core functions for different things
│   ├── i18n - translations files
│   ├── images - mainly the PWA app icon
│   ├── router - a custom routing solution
│   ├── sounds - a simple sound player and sound assets
│   ├── store - a custom app state management solution backed by localStorage
│   ├── styles - app styles written in Sass (SCSS)
│   ├── sw - the service worker that handles precaching app shell
│   ├── text - Markdown and LaTeX processing
│   ├── views - pages
│   │   ├── CategoryPage.tsx - category contents browsing
│   │   ├── HomePage.tsx - packages listing
│   │   ├── NotFoundPage.tsx - 404
│   │   ├── PackagePage.tsx - package contents browsing
│   │   ├── PracticePage.tsx - questions practice
│   │   ├── QuestionPage.tsx - question editor
│   │   └── SettingsPage.tsx - app settings form (locale, sounds, data)
│   ├── _headers - Netlify HTTP headers customization
│   ├── _redirects - Netlify HTTP redirects/rewrites customization
│   ├── index.js - the app starting point
│   ├── manifest.json - a web app manifest for PWA
│   ├── robots.txt
│   ├── routes.ts - app routes definitions
│   ├── template.ejs - index.html template to be built by Webpack 
│   └── types.js - data, state and API types
├── test - a few tests
├── tools - custom Webpack plugins
├── types - TypeScript declarations for non-code imports (SVG, MP3)
├── .browserslistrc - Browserslist config
├── .eslintrc.js - ESLint config
├── .nvmrc - Node.js version specification for Netlify
├── ava.config.js - AVA config
├── babel.config.js - Babel config
├── netlify.toml - Netlify main config
├── package.json
├── babel.config.js - PostCSS config
├── tsconfig.json - main TypeScript config
├── webpack.config.*.js - Webpack configs
└── yarn.lock
```


## Development


### Requirements

- [Node.js] >=18.x
- [Yarn][Yarn-v1] 1.x
- You can follow [this Node.js Development Setup guide](./NODEJS-SETUP.md).


### Set up

1. Install all dependencies with Yarn (run `yarn`).
2. You are ready to go.
3. Use `yarn start` to start dev server with HMR.
4. Then open `http://localhost:3000/` in the browser.


### Available commands

* `yarn start` – Starts a webpack development server with [HMR (hot module replacement)][webpack-hmr].

* `yarn build` – Builds the production version and outputs to `dist` dir. Note: Before running an actual
  build, `dist` dir is purged.

* `yarn analyze` – Same as `yarn build` but it also outputs `build/stats.production.json`
  and runs [webpack-bundle-analyzer CLI][webpack-bundle-analyzer-cli].

* `yarn tsc` – Runs TypeScript compiler. Outputs type errors to console.

* `yarn lint` – Runs [ESLint]. Outputs errors to console.

* `yarn test` – Runs tests using [AVA].

* `yarn test-hot` – Runs tests using [AVA] in watch mode.


## Deployment

_Currently_, I use [Netlify] which is practically a CDN on steroids with integrated
builds. There are 3 configuration files that affect the deployment behavior:
* [netlify.toml](./netlify.toml) – global config
* [app/_headers](./app/_headers) – HTTP headers customization (mainly for immutable files)
* [app_redirects](./app/_redirects) – HTTP redirects and rewrites (fallback to index.html for client-side
  routing)

_In the future_, a simple CDN might not be sufficient (in terms of features, speed, costs, ...). Then a
server-rendered app with additional features might be the way.

Cloudflare has always offered state-of-the-art features on the fastest and reliable network all round the
world. So, I might give a chance to the [Cloudflare Workers](https://workers.cloudflare.com/) due
to [its unique design](https://developers.cloudflare.com/workers/learning/how-workers-works).



<!-- links references -->

[pokusew/testbook-ocr]: https://github.com/pokusew/testbook-ocr

[React.js]: https://reactjs.org/

[react-intl]: https://formatjs.io/docs/react-intl/

[classnames]: https://github.com/JedWatson/classnames

[firebase-cloud-firestore]: https://firebase.google.com/docs/firestore

[PWA]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

[History API]: https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API

[Intl API]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

[AVA]: https://github.com/avajs/ava

[Netlify]: https://www.netlify.com/

[Node.js]: https://nodejs.org/en/

[Yarn-v1]: https://classic.yarnpkg.com/lang/en/

[webpack]: https://webpack.js.org/

[webpack-hmr]: https://webpack.js.org/guides/hot-module-replacement/

[webpack-bundle-analyzer-cli]: https://github.com/webpack-contrib/webpack-bundle-analyzer#usage-as-a-cli-utility

[Babel]: https://babeljs.io/

[Sass]: https://sass-lang.com/

[Autoprefixer]: https://github.com/postcss/autoprefixer

[Browserslist]: https://github.com/browserslist/browserslist

[TypeScript]: https://www.typescriptlang.org/

[ESLint]: https://eslint.org/

[mdn-progressive-enhancement]: https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement

[mdn-sri]: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity

[web-dev-maskable-icons]: https://web.dev/maskable-icon/
