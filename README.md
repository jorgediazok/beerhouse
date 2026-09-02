# Beer House

Beer delivery e-commerce — catalog, cart, checkout and auth, built on Next.js
(App Router) with Contentful as the headless CMS for products and MongoDB for
users.

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

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Contentful (product catalog)
- MongoDB + Mongoose (users)
- Auth.js (NextAuth v5) — Credentials provider, httpOnly session cookie
- Zustand — cart state, persisted to localStorage
- Zod — form validation
- sonner — toasts
