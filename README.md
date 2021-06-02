# memorio

App for effective learning

Written in the latest TypeScript and JavaScript (ES2020+) using React.js, GraphQL (Apollo React Client).

🚧 **THIS IS WORK IN PROGRESS, SEE [TODO](./TODO.md)**


## Content

<!-- **Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Architecture](#architecture)
- [Development](#development)
	- [Requirements](#requirements)
	- [Set up](#set-up)
	- [Available commands](#available-commands)
- [Deployment](#deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Architecture

It is _currently_ a client-side-only application (SPA).
**It runs completely in the browser** and it **communicates with the backend via APIs**.

In the future, this might be an isomorphic app based on Cloudflare Workers.


## Development


### Requirements

- [Node.js](https://nodejs.org/) 16.x
- [Yarn](https://yarnpkg.com/) 1.x


### Set up

1. Install all dependencies with Yarn (run `yarn`).
2. You are ready to go.
3. Use `yarn start` to start dev server with HMR.
4. Then open `http://localhost:3000/` in the browser.


### Available commands

* `yarn start` – Starts a development server with hot replacements.

* `yarn build` – Builds the production version and outputs to `dist` folder. Note: Before running an actual
  build, `dist` folder is purged.

* `yarn analyze` – Same as `yarn build` but it also outputs `stats.json`
  and
  run [webpack-bundle-analyzer CLI](https://github.com/webpack-contrib/webpack-bundle-analyzer#usage-as-a-cli-utility)
  .

* `yarn tsc` – Runs TypeScript compiler. Outputs type errors to console.

* `yarn lint` – Runs [ESLint](https://eslint.org/). Outputs errors to console.

* `yarn test` – Runs tests using [AVA](https://github.com/avajs/ava).

* `yarn test-hot` – Runs tests using [AVA](https://github.com/avajs/ava) in watch mode.


## Deployment

Currently, I use [Netlify](https://www.netlify.com/) which is practically a CDN on steroids with integrated
builds.

In the future, the simple CDN might not be sufficient (in terms of features, speed, costs, ...). Then
server-rendered app with additional features might be the way.

Cloudflare has always offered state-of-the-art features on the fastest and reliable network all round the
world. So, I might give a chance to the [Cloudflare Workers](https://workers.cloudflare.com/) due
to [its unique design](https://developers.cloudflare.com/workers/about/how-it-works/).

