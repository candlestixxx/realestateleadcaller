# TODO: Immediate Short-Term Tasks

## Phase 7: Strict Types & Polish
- [ ] Ensure loading states exist for remaining UI forms.

## Completed Tasks
- [x] Replace `any` types in NextAuth session overriding (`src/app/api/auth/[...nextauth]/route.ts`).
- [x] Replace `any` types in `src/lib/adapters/index.ts` (e.g., `updateLead(leadId: string, data: Partial<Lead>)`).
- [x] Add explicit Prisma `@relation` fields to `CallLog` and `Appointment` models to map to `Lead` directly.
- [x] Refactor `src/app/api/dashboard/route.ts` to utilize the new direct relations for faster counting.
- [x] Run a final `npx prisma db push` and `npx prisma generate`.
