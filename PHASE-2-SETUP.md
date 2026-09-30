# VIWAH — Phase 2: Database + Seed Data

## 1. Install dependencies

```bash
npm install
```

## 2. Configure MongoDB

Copy `.env.example` to `.env.local` and set `MONGODB_URI`.

Local MongoDB example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/viwah
```

MongoDB Atlas can be used instead.

## 3. Seed the database

```bash
npm run db:seed
```

The seed creates:
- 12 venues
- 18 vendors
- 8 real wedding stories
- 50 reviews
- 5 enquiries
- 1 admin record for the authentication phase

## 4. Start the app

```bash
npm run dev
```

Phase 2 does not yet expose CRUD APIs. Those are implemented in the later API/admin phases so the database remains the single source of truth.
