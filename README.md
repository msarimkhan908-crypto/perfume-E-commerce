 Essence — Perfume E-Commerce Store

A full-featured perfume store built with **Laravel 13** (REST API backend) and **React 19 + Vite + Tailwind CSS** (storefront + admin panel frontend).

## What's included

- **Storefront**: home page, shop with filters (category, brand, gender, price, search, sort), product detail pages, cart, checkout (Cash on Delivery), order confirmation, customer accounts, order history.
- **Admin panel** (`/admin`): dashboard with stats, product CRUD, category & brand CRUD, order management with status updates.
- **Backend**: Laravel API with Sanctum token authentication, role-based access (customer/admin), validation, and a seeder with demo perfume products.

## Project structure

```
E-Commerece/
├── backend/     Laravel API (PHP)
└── frontend/    React storefront + admin panel (Vite)
```

## Prerequisites

- PHP 8.3+ and Composer — if you don't have them, https://php.new has one-line installers for Windows/Mac/Linux
- Node.js 18+ and npm

## 1. Backend setup

```powershell
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API will run at **http://127.0.0.1:8000**. It uses SQLite by default — the migrate command creates `database/database.sqlite` automatically (if it doesn't, create an empty file at `backend/database/database.sqlite` first).

### Demo accounts (created by the seeder)

| Role     | Email                        | Password   |
|----------|-------------------------------|------------|
| Admin    | admin@perfumestore.test       | password   |
| Customer | customer@perfumestore.test    | password   |

## 2. Frontend setup

Open a **second terminal**:

```powershell
cd frontend
npm install
npm run dev
```

The store will run at **http://localhost:5173**. The Vite dev server proxies `/api` requests to `http://127.0.0.1:8000`, so make sure the backend (`php artisan serve`) is running first — no extra CORS configuration is needed for local development.

Visit:
- **http://localhost:5173** — the storefront
- **http://localhost:5173/admin** — the admin panel (log in with the admin account above, then it redirects automatically)

## How it works

- **Auth**: Laravel Sanctum personal access tokens (Bearer tokens stored in `localStorage`), not cookie sessions — simple to use across the separate frontend origin.
- **Cart**: stored client-side (`localStorage`) so guests can browse and add to cart freely; an account is required at checkout so orders can be tracked in "My Orders".
- **Checkout**: Cash on Delivery only — orders are created with `payment_method = cod` and `status = pending`; the admin updates status (processing → shipped → delivered) from the admin panel.
- **Images**: seeded products use placeholder images (`placehold.co`). Swap `image_url` for real product photos via the admin panel's product edit form (paste any image URL).

## Notes on this build

This project's source code was written by hand in a sandboxed cloud environment that could not reach Packagist (Composer's package registry), so the `vendor/` directory (PHP dependencies) and `node_modules/` (JS dependencies) are **not included** — running `composer install` and `npm install` as shown above will fetch them on your machine in a few minutes. All application code (models, controllers, migrations, React components, etc.) is complete and ready to run.

## Next steps you may want

- Add real product photography (replace `image_url` fields).
- Add pagination polish, wishlists, or reviews.
- Add email notifications for order status changes.
- Deploy: backend to any PHP host (Laravel Forge, Render, etc.) with a real MySQL/Postgres database; frontend `npm run build` output (`frontend/dist`) to any static host, pointed at the deployed API URL.
