# TODO: Immediate Short-Term Tasks

## Phase 21: Geo-Spatial Coordinate Enrichment
- [x] Currently, the `src/app/leads/import/page.tsx` CSV importer only expects `first_name, last_name, email, phone, lead_type`. Update the UI to accept `property_address`, `city`, `state`, and `zip`.
- [x] Create an adapter to hook into the Nominatim OpenStreetMap Geocoding API (`src/lib/adapters/geocoding.ts`).
- [x] Intercept the `POST /api/leads` route. When a lead is created with an address, automatically ping the Geocoding API to resolve the `latitude` and `longitude` fields so they instantly appear on the Phase 20 Circle Prospecting Map.

## Phase 22: Circle Prospecting Map Rendering
- [ ] Build the `/map` dashboard to visualize leads using `react-leaflet`.
- [ ] Filter leads by proximity to a given address to generate targeted calling lists for "Just Sold" or "Just Listed" campaigns.

## Project Finalization
- [ ] Hand off codebase cleanly.
