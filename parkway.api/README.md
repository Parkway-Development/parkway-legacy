# API

## Getting Started

Run `npm install` to get dependencies installed.

Add the following `.env` file. Note, leaving the URL empty will allow the vite dev proxy to forward requests to `http://localhost:3000` as configured in `vite.config.js` for requests starting with `/api`.
```text
DATABASE_URL=mongodb://user:pass@server/
PORT=3000
MINIMUM_PASSWORD_LENGTH=12
MINIMUM_PASSWORD_LOWERCASE=1
MINIMUM_PASSWORD_UPPERCASE=1
MINIMUM_PASSWORD_NUMBERS=1
MINIMUM_PASSWORD_SYMBOLS=1
JWT_SECRET="super secret jwt secret"
JWT_EXPIRATION="20m"
```

## Development

Run `npm run start` to launch api.
