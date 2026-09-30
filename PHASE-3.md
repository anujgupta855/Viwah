# VIWAH — Phase 3

Phase 3 connects the public marketplace to MongoDB and adds live discovery/enquiry flows.

## Included
- MongoDB-backed `/api/venues`, `/api/vendors`, detail APIs, wedding stories API
- Live venue listing filters: search, city, venue type, capacity, sorting
- Live vendor listing filters: search, category, city, rating, sorting
- Venue detail pages with approved reviews and enquiry form
- Vendor profile pages with packages, portfolio, approved reviews and enquiry form
- Real Weddings masonry-style data from MongoDB
- Functional home search panel
- Featured venues on homepage from MongoDB
- Contact form persisted to MongoDB via a new `ContactMessage` model
- Loading, empty and basic error states

## Run
1. Keep the Phase 2 `.env.local` in the project root.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

The database must be reachable and the Phase 2 seed should already have been run.

## Next
Phase 4 should implement secure admin authentication and protected admin routes. Then build dashboard, vendor CRUD, venue CRUD, review moderation and enquiry management against these same MongoDB collections.
