# JoShop

JoShop is a French-first marketplace for imported Chinese gadgets in Tunisia. It combines a black-and-orange storefront with catalogue discovery, persistent guest shopping, customer accounts, Supabase-backed checkout and orders, and an operations dashboard.

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
- Supabase persistence for catalogue, accounts, sessions, orders, and admin data

## Requirements

- Node.js 20+
- npm 10+
- A Supabase project for all storefront and customer data

## Environment

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SECRET_KEY="sb_secret_your-server-only-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Find the HTTPS project URL in Supabase's **Connect** panel and create/copy a secret key from **Settings → API Keys**. `SUPABASE_SECRET_KEY` is server-only: never expose it in browser code, commit it, or prefix it with `NEXT_PUBLIC_`.

Without both Supabase variables, the application fails closed instead of silently using temporary in-memory data.

## Database

For a fresh Supabase project, run these files in order from the Supabase SQL Editor:

- `supabase/migrations/20260819000000_initial_schema.sql`
- `supabase/migrations/20260819010000_customer_sessions.sql`

To load the optional sample catalogue after the tables exist:

```bash
npm run db:seed
```

If the current Supabase database already contains the tables created by the former Prisma migrations, do not rerun the SQL files; only configure the Supabase variables. The idempotent seed creates 12 categories, 48 products, product images, variants, specifications, reviews, a sample user/address, and realistic order history.

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
