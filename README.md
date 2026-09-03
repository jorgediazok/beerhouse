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
- Instant search on the Tienda page, filtering the catalog as you type
- Credentials-based auth (Auth.js / NextAuth v5) — email/password signup and
  login, bcrypt-hashed passwords, JWT session cookie
- Cart (Zustand, persisted to localStorage) with per-line subtotals, live
  quantity controls, and a free-shipping progress nudge
- Checkout gated behind auth — an unauthenticated visit to `/checkout`
  redirects to `/login` and returns to checkout after signing in; single-page
  form for personal info and shipping, with real payment collected via
  Mercado Pago's Card Payment Brick (test mode — see Setup below for test
  card details)
- Real payment processing (`/api/payments`) via Mercado Pago: the card is
  charged server-side before anything is persisted — totals are recomputed
  from Contentful rather than trusted from the client, per-product stock is
  reserved atomically (rolled back if a later item is out of stock or the
  charge is declined), and an Order is only created once the payment comes
  back `approved`. The confirmation screen shows a real order number
- Flat-rate shipping with a free-shipping threshold, applied consistently in
  the cart, checkout, and the saved order
- "Mis Pedidos" — order history for the signed-in user (two-up on desktop),
  read straight from MongoDB, with a live status stepper (Confirmado →
  Preparando → Enviado → Entregado) derived from how long ago the order was
  placed
- Password recovery — a single-use, SHA-256-hashed reset token with a 1-hour
  expiry, emailed to the account's address; a show/hide toggle on every
  password field
- Transactional email via Resend — contact form, order confirmations, and
  password reset links
- Product reviews and star ratings — any signed-in user can rate and review
  a beer (name, 1-5 stars, comment); one review per user per product, with
  a pencil-icon toggle to edit your own review in place
- Vercel Analytics for page-view tracking in production

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Contentful (product catalog)
- MongoDB + Mongoose (users, orders, stock, reviews)
- Auth.js (NextAuth v5) — Credentials provider, httpOnly session cookie
- bcryptjs — password hashing
- Zustand — cart state, persisted to localStorage
- Embla Carousel — offers and related-products rails
- Zod — form validation
- sonner — toasts
- lucide-react — icons
- Resend — transactional email
- Mercado Pago (`@mercadopago/sdk-react` + `mercadopago`) — real card
  payments via Checkout Bricks, test mode
- Vercel Analytics

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
RESEND_API_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_MP_PUBLIC_KEY=
MP_ACCESS_TOKEN=
```

- `MONGODB_URI`: connection string to a MongoDB database (used for user
  accounts and orders), e.g.
  `mongodb+srv://user:<password>@cluster.mongodb.net/beerhouse`
- `AUTH_SECRET`: random secret used to sign session cookies. Generate one with
  `npx auth secret` or `openssl rand -base64 32`
- `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN`: from a Contentful space
  with a `beerHouseProject` content type (fields: `name`, `price`,
  `description`, `descriptionExtended`, `image`)
- `RESEND_API_KEY`: API key from [Resend](https://resend.com), used to send
  contact messages, order confirmations, and password reset emails. Without
  it, those flows still work but silently skip the email step (logged
  server-side) — sign-up, login, cart, and checkout don't depend on it.
  Emails send from the shared `onboarding@resend.dev` sender, which doesn't
  require a verified domain but won't deliver to obviously fake addresses
  (e.g. `@example.com`)
- `CONTACT_EMAIL`: the address that receives messages from the Contacto form
- `NEXT_PUBLIC_MP_PUBLIC_KEY` / `MP_ACCESS_TOKEN`: a [Mercado Pago](https://www.mercadopago.com.ar/developers)
  application's **test** credentials (both start with `TEST-`). Checkout is
  wired to Mercado Pago's sandbox — no real money moves. To complete a
  purchase, use one of their published test cards, e.g. Visa
  `4509 9535 6623 3704`, any future expiry, CVV `123`, cardholder name
  `APRO` (forces an approved result), any DNI — the checkout page shows
  this same info in a notice box next to the payment form

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
- `npm run test` — run the Vitest suite once
- `npm run test:watch` — run Vitest in watch mode

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, test, and
build on every push and pull request to `master`.

## Testing

[Vitest](https://vitest.dev) covers `src/lib/` (pure logic, plus DB-touching
functions with Mongoose mocked) and the API route handlers (`src/app/api/**/
route.ts`, called directly with a `Request` and mocked at the `lib`
boundary — no real Mongo/Contentful/Resend/Mercado Pago calls, no env vars
required). Tests are colocated as `*.test.ts` next to the file they cover.
React component/page rendering isn't covered yet — Vitest doesn't support
async Server Components, which most pages here are.

## Project structure

```
src/
  app/          routes (App Router) — home, tienda, cart, checkout, login,
                pedidos, forgot-password, reset-password, api/auth,
                api/payments, api/contact, api/reviews
  components/   UI, grouped by feature (cart, home, layout, pedidos, shop,
                providers, ui)
  lib/          Contentful/Mongo/Mercado Pago clients, auth config, shipping
                rules, email (Resend), stock, order status, rate limiting,
                shared utilities
  models/       Mongoose models (User, Order, Stock, Review)
  store/        Zustand stores
  types/        shared TypeScript types
  proxy.ts      route protection (Next.js 16's replacement for middleware.ts),
                gates /checkout and /pedidos behind a valid session
```

## Deployment

Deployed on Vercel, connected to this repo's `master` branch — every push to
`master` auto-deploys. Environment variables are set in the Vercel project
dashboard (not read from `.env.local` in production).
