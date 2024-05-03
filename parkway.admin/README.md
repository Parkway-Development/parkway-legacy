# React + TypeScript + Vite

## Getting Started

Run `npm install` to get dependencies installed.

Add the following `.env.local` file. Note, leaving the URL empty will allow the vite dev proxy to forward requests to `http://localhost:3000` as configured in `vite.config.js` for requests starting with `/api`. Separate `.env` files can be added later to configure the final API url for build/deployment.
```text
VITE_API_URL=
VITE_APP_KEY='app key here'
VITE_APP_SECRET='app secret here'
```

## Development

Run `npm run dev` to launch dev mode.

## Build

Run `npm run build` to build the app. Output of a production build will be located in the `dist` folder.

## Tests

Run `npm run test` to run the tests.
