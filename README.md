# Beer House

Beer delivery e-commerce — catalog, cart, checkout and auth, built on Next.js
(App Router) with Contentful as the headless CMS for products and MongoDB for
users and orders.

**Live:** https://beerhouse-eta.vercel.app

## Features

- Catalog with category filtering (color/style — Rubias, Rojas y Ámbar,
  Negras, IPA, Trigo, Especiales) and pagination
- Featured offers carousel on the home page (discounted price, badge)
- Product page: related products by category, WhatsApp/native share,
  copy link, live subtotal, back navigation
- Credentials-based auth (Auth.js / NextAuth v5) — email/password signup and
  login, bcrypt-hashed passwords, JWT session cookie
- Cart (Zustand, persisted to localStorage) with per-line subtotals, live
  quantity controls, and a free-shipping progress nudge
- Checkout gated behind auth — an unauthenticated visit to `/checkout`
  redirects to `/login` and returns to checkout after signing in; single-page
  form (personal info, shipping, payment) validated with one combined Zod
  schema instead of a multi-step wizard
- Orders persisted to MongoDB (`/api/orders`) with totals recomputed
  server-side rather than trusted from the client; the confirmation screen
  shows a real order number
- Flat-rate shipping with a free-shipping threshold, applied consistently in
  the cart, checkout, and the saved order

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Contentful (product catalog)
- MongoDB + Mongoose (users, orders)
- Auth.js (NextAuth v5) — Credentials provider, httpOnly session cookie
- bcryptjs — password hashing
- Zustand — cart state, persisted to localStorage
- Embla Carousel — offers and related-products rails
- Zod — form validation
- sonner — toasts
- lucide-react — icons

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
  accounts and orders), e.g.
  `mongodb+srv://user:<password>@cluster.mongodb.net/beerhouse`
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
  app/          routes (App Router) — home, tienda, cart, checkout, login, api/auth, api/orders
  components/   UI, grouped by feature (cart, home, layout, shop, providers, ui)
  lib/          Contentful/Mongo clients, auth config, shipping rules, shared utilities
  models/       Mongoose models (User, Order)
  store/        Zustand stores
  types/        shared TypeScript types
  proxy.ts      route protection (Next.js 16's replacement for middleware.ts),
                gates /checkout behind a valid session
```

## Deployment

Deployed on Vercel, connected to this repo's `master` branch — every push to
`master` auto-deploys. Environment variables are set in the Vercel project
dashboard (not read from `.env.local` in production).
