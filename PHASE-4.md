# VIWAH Phase 4 — Admin Authentication + Dashboard + CRUD

Phase 4 adds the working admin console on top of Phase 3.

## Included
- Secure HTTP-only signed admin session cookie using `AUTH_SECRET`
- `/admin/login` authentication
- Protected `/admin/*` routes via middleware
- Logout
- Admin dashboard statistics and recent activity
- Vendor list/search/filter/pagination
- Vendor create/edit/delete
- Venue list/search/status filter/pagination
- Venue create/edit/delete
- Review approval/rejection/deletion
- Enquiry status management
- Responsive admin navigation
- Same MongoDB data as the public marketplace
- Category-aware vendor pricing including `per_plate` for caterers

## Environment
Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/viwah
AUTH_SECRET=replace-with-a-long-random-secret
```

Keep `.env.local` private.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000/admin/login`.

The Phase 2 seed creates the demo admin:
- Email and password come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`.

Never commit production credentials.

## Important
The admin panel does not maintain a separate copy of vendor/venue data. CRUD writes go to MongoDB and public pages read from the same collections.
