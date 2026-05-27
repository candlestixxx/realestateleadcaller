# TODO: Immediate Short-Term Tasks

## Phase 7: Tech Debt (Database & Types)
- [x] Add explicit Prisma `@relation` fields to `CallLog` and `Appointment` models to map to `Lead` directly (removing the need for `where { in }` array lookups).
- [x] Refactor `src/app/api/dashboard/route.ts` to utilize the new direct relations for faster counting.
- [x] Run a final `npx prisma db push` and `npx prisma generate`.

## Completed Tasks
- [x] Create `CallLog` aggregation logic in `api/dashboard/route.ts` to track "AI Connect Rates" (calls > 30s).
- [x] Add "Appointments Set" aggregation from the `Appointment` model.
