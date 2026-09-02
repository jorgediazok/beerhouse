# Beer House

Beer delivery e-commerce — catalog, cart, checkout and auth, built on Next.js
(App Router) with Contentful as the headless CMS for products and MongoDB for
users.

**Live:** https://beerhouse-eta.vercel.app

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Contentful (product catalog)
- MongoDB + Mongoose (users)
- Auth.js (NextAuth v5) — Credentials provider, httpOnly session cookie
- Zustand — cart state, persisted to localStorage
- Zod — form validation
- sonner — toasts

## Setup

Install dependencies:

```
npm install
```

Create a `.env.local` file in the project root with:

```
MONGODB_URI=
AUTH_SECRET=
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
```

- `MONGODB_URI`: connection string to a MongoDB database (used for user
  accounts), e.g. `mongodb+srv://user:<password>@cluster.mongodb.net/beerhouse`
- `AUTH_SECRET`: random secret used to sign session cookies. Generate one with
  `npx auth secret` or `openssl rand -base64 32`
- `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN`: from a Contentful space
  with a `beerHouseProject` content type (fields: `name`, `price`,
  `description`, `descriptionExtended`, `image`)

Run the dev server:

```
npm run dev
```

Then open http://localhost:3000. Note: the Home and Tienda pages require
valid Contentful credentials to render (they fetch the beer catalog
server-side); Login, Cart, Checkout and the 404 page work without them.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm start` — run a production build
- `npm run lint` — lint with ESLint

## Project structure

```
src/
  app/          routes (App Router) — home, tienda, cart, checkout, login, api/auth
  components/   UI, grouped by feature (cart, home, layout, shop, providers, ui)
  lib/          Contentful/Mongo clients, auth config, shared utilities
  models/       Mongoose models
  store/        Zustand stores
  types/        shared TypeScript types
```

## Deployment

Deployed on Vercel, connected to this repo's `master` branch — every push to
`master` auto-deploys. Environment variables are set in the Vercel project
dashboard (not read from `.env.local` in production).
