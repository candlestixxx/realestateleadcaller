# TODO: Immediate Short-Term Tasks

## Phase 21: Geo-Spatial Coordinate Enrichment
- [ ] Currently, the `src/app/leads/import/page.tsx` CSV importer only expects `first_name, last_name, email, phone, lead_type`. Update the UI to accept `property_address`, `city`, `state`, and `zip`.
- [ ] Create an adapter to hook into the Google Maps Geocoding API (`src/lib/adapters/geocoding.ts`).
- [ ] Intercept the `POST /api/leads` route. When a lead is created with an address, automatically ping the Geocoding API to resolve the `latitude` and `longitude` fields so they instantly appear on the Phase 20 Circle Prospecting Map!

## Project Finalization
- [ ] Hand off codebase cleanly.
