# VIWAH Production Setup

## Required environment variables

Create `.env.local` from `.env.example` and set:

- `MONGODB_URI` — MongoDB Atlas connection string.
- `AUTH_SECRET` — long random secret, 32+ random bytes recommended.
- `ADMIN_EMAIL` — the production admin email.
- `ADMIN_PASSWORD` — the initial production admin password.
- `CLOUDINARY_*` — add when enabling managed media uploads.

Never commit `.env.local`.

## First database setup

```bash
npm install
npm run db:seed
npm run build
npm run start
```

`db:seed` resets demo marketplace collections and creates the admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Do not run it against a production database containing live records.

## Admin

Open `/admin/login`. The login email is whatever `ADMIN_EMAIL` is set to; it is not hard-coded in the UI.

## Marketplace pricing

Admin → Settings controls public price-filter options. Vendor records control their actual starting price and pricing unit. Caterer filters can be expressed per plate, while every category's filter labels/values remain editable by the admin.

## Deployment

Set the same environment variables in the hosting provider, use a production MongoDB database, restrict the Atlas network access list to the application's egress IPs where supported, and keep `AUTH_SECRET`/`ADMIN_PASSWORD` in the provider's secret manager.
