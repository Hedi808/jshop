# Jshop

Jshop is a French-first marketplace for imported Chinese gadgets in Tunisia. It combines a black-and-orange storefront with catalogue discovery, persistent guest shopping, customer accounts, Prisma-backed checkout and orders, and an operations dashboard.

## Included

- 12 gadget and lifestyle categories
- 48 realistic products with flexible JSON specifications
- Audio, smart-home, gaming, accessories, connected devices, lifestyle products, and electric mobility
- Technical variants such as storage, capacity, power, configuration, and color
- FR, EN, and AR interface dictionaries with an SSR-compatible locale cookie
- Arabic right-to-left layout for the storefront; admin remains left-to-right
- Persistent cart, wishlist, recently viewed products, checkout, order confirmation, and customer-specific order history
- Customer registration and sign-in with salted password hashes and HTTP-only database sessions
- Signed-in checkout prefilling and automatic ownership of new account orders
- Fixed standard delivery across Tunisia for 7 TND; express delivery is 15 TND
- PostgreSQL/Prisma persistence with a complete in-memory catalogue fallback

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 15+ for customer accounts and persistent admin/order data (optional for storefront preview)

## Environment

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/joshop?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Without `DATABASE_URL`, the application uses its in-process catalogue so the public storefront can be previewed. Customer registration requires PostgreSQL because passwords and sessions must be stored durably.

## Database

Create an empty `joshop` database, then run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

For an existing production database, apply committed migrations during deployment with:

```bash
npm run db:deploy
```

The idempotent seed creates 12 categories, 48 products, product images, variants, specifications, reviews, a sample user/address, and realistic order history.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Main routes

- `/` — imported-gadget marketplace homepage
- `/search` — search, filter, and sort the catalogue
- `/category/[slug]` — category collection
- `/product/[slug]` — gallery, variants, specifications, reviews, and recommendations
- `/cart`, `/wishlist`, `/checkout` — guest commerce flow
- `/register`, `/login` — customer registration and sign-in
- `/account`, `/account/orders` — customer profile and private order history
- `/admin` — operations overview
- `/admin/products` — product CRUD and JSON specification editing
- `/admin/orders` — fulfilment status workflow

## Notes before production

Add authentication and authorization to `/admin`, connect payment and notification providers, add email verification/password recovery and durable rate limiting to authentication and mutation routes, and replace generated catalogue artwork with licensed product photography.
