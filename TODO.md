# TODO: Immediate Short-Term Tasks

## General Tech Debt
- [ ] Add explicit Prisma `@relation` fields to `CallLog` and `Appointment` models to map to `Lead` directly (removing the need for `where { in }` array lookups).

## Completed Tasks
- [x] Update `src/app/api/dashboard/route.ts` to calculate conversion rates.
- [x] Add UI components to `src/app/page.tsx` (Dashboard) to render the new conversion metrics.
- [x] Create `CallLog` aggregation logic in `api/dashboard/route.ts` to track "AI Connect Rates" (calls > 30s).
- [x] Add "Appointments Set" aggregation from the `Appointment` model.
- [x] Add `.env.example` file based on actual used config variables.
