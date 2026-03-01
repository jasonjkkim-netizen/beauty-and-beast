# Beauty & Beast

## Overview

Beauty & Beast is a dual-category e-commerce platform serving Hong Kong consumers. It offers authentic Korean skincare products (K-beauty) alongside premium pet care products — all sourced from top Korean online malls (Olive Young, Coupang, Gmarket). The platform features a public-facing storefront organized by categories for both beauty and pet products, plus an admin dashboard for managing inventory, pricing, and a "discovery" system that simulates finding new products from Korean online shops.

The pricing model adds transparent shipping costs and a configurable margin on top of Korean wholesale prices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Structure

The project follows a monorepo layout with three main directories:

- **`client/`** — React frontend (Single Page Application)
- **`server/`** — Express.js backend API
- **`shared/`** — Shared types and database schema (used by both client and server)

### Frontend

- **Framework:** React with TypeScript
- **Routing:** Wouter (lightweight client-side router) — two main routes: `/` (storefront) and `/admin` (dashboard)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite` plugin, plus shadcn/ui component library (new-york style, sharp edges/no border radius for a premium Escentual-inspired look)
- **Data Fetching:** TanStack React Query with a custom `apiRequest` helper and query function factory
- **Fonts:** Playfair Display (serif, for headings) and Plus Jakarta Sans (sans-serif, for body) via Google Fonts
- **Build Tool:** Vite with React plugin, path aliases (`@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`)

### Backend

- **Framework:** Express.js v5 running on Node.js with TypeScript (via `tsx`)
- **API Pattern:** RESTful JSON API under `/api/` prefix
- **Key API Routes:**
  - `GET /api/products` — live storefront products only
  - `GET /api/products/featured` — featured live products
  - `GET /api/products/category/:category` — filter by category (live only)
  - `GET /api/products/:slug` — single product by slug
  - `GET /api/admin/products` — all products (including draft)
  - `POST /api/admin/products` — create product
  - `PUT /api/admin/products/:id` — update product (margins, pricing, status)
  - `DELETE /api/admin/products/:id` — remove product
  - `GET /api/admin/discovery` — list discovered product candidates
  - `POST /api/admin/discovery/run` — simulate crawling Korean malls for high-review products
  - `POST /api/admin/discovery/:id/approve` — approve candidate with margin/shipping and create draft product
  - `POST /api/admin/discovery/:id/reject` — reject candidate
  - `GET /api/admin/orders` — list all orders (newest first)
  - `POST /api/admin/orders` — create order (online or offline)
  - `PUT /api/admin/orders/:id` — update order (status, items, customer info)
  - `DELETE /api/admin/orders/:id` — remove order
- **Dev Server:** Vite dev server integrated as middleware (via `server/vite.ts`) for HMR during development
- **Production:** Client built to `dist/public`, server bundled with esbuild to `dist/index.cjs`, served as static files

### Database

- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Connection:** `pg` (node-postgres) Pool, configured via `DATABASE_URL` environment variable
- **Schema Location:** `shared/schema.ts`
- **Tables:**
  - `products` — Main product catalog (slug, name, brand, category, pricing in HKD/KRW, images, tags, stock status, source mall, margin info, status field for live/draft)
  - `discovery_products` — Simulated product discoveries from Korean malls (price in KRW, review data, approval status)
  - `orders` — Order tracking (orderNumber, channel online/offline, customer info, items as JSON, pricing, payment method, status workflow, timestamps)
  - `users` — Basic user table
- **Migrations:** Managed via `drizzle-kit push` command (schema push approach, not migration files)
- **Validation:** `drizzle-zod` generates Zod schemas from Drizzle table definitions for insert/update validation

### Storage Layer

- `server/storage.ts` defines an `IStorage` interface and `DatabaseStorage` implementation
- This abstraction allows swapping storage backends if needed
- All database operations go through this layer

### Build Process

- `script/build.ts` handles production builds:
  1. Vite builds the client to `dist/public`
  2. esbuild bundles the server to `dist/index.cjs`
  3. Commonly used server dependencies are bundled (allowlisted) to reduce cold start times
  4. Other dependencies remain external

### Seed Data

- `server/seed.ts` contains initial product data (6 curated K-beauty products with Korean wholesale pricing and HKD retail prices)
- Discovery simulation uses hardcoded mock data in `server/routes.ts`

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable
- **connect-pg-simple** — Session store (included in dependencies, likely for future auth)

### Stripe Payment Integration
- **stripe** + **stripe-replit-sync** — Stripe payment processing with auto-synced schema
- `server/stripeClient.ts` — Fetches Stripe credentials from Replit connection API
- `server/webhookHandlers.ts` — Processes Stripe webhooks via stripe-replit-sync
- Stripe Checkout Sessions use `price_data` (dynamic pricing from products table, not pre-created Stripe prices)
- Webhook route registered BEFORE `express.json()` in `server/index.ts`
- On startup: `runMigrations()` → `findOrCreateManagedWebhook()` → `syncBackfill()`

### WhatsApp Contact
- Seller contact: +852-94448661
- Floating WhatsApp button (bottom-right corner) on all storefront pages
- WhatsApp link in footer "Contact Us"

### Shopping Cart
- Client-side cart context (`client/src/lib/cart.tsx`) with CartProvider wrapping the app
- Cart drawer slides out from right with item management, quantity controls, totals
- Checkout redirects to Stripe Checkout, then to success/cancel pages
- Free shipping over HK$500, otherwise HK$45

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit** — Database ORM and schema management
- **express** v5 — HTTP server
- **stripe** — Stripe payment SDK
- **stripe-replit-sync** — Stripe webhook and data sync
- **@tanstack/react-query** — Client-side data fetching and caching
- **react-day-picker** — Calendar component
- **embla-carousel-react** — Carousel functionality
- **recharts** — Charting library (likely for admin analytics)
- **react-icons** — Payment method icons (Alipay, WeChat, Visa, Mastercard, WhatsApp)
- **wouter** — Client-side routing
- **zod** — Schema validation
- **vaul** — Drawer component

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal** — Error overlay in development
- **@replit/vite-plugin-cartographer** — Dev tooling (dev only)
- **@replit/vite-plugin-dev-banner** — Dev banner (dev only)
- Custom `vite-plugin-meta-images` — Updates OpenGraph meta tags with correct Replit deployment URL