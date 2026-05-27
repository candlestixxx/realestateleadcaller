# TODO: Immediate Short-Term Tasks

## Phase 8: Vapi Post-Call Intelligence
- [ ] Create `src/app/api/webhooks/vapi/route.ts` endpoint.
- [ ] Map the Vapi `EndOfCallReport` JSON payload (Duration, Transcript, Summary) to our local Prisma schema (`CallLog` and `Conversation`).
- [ ] Write logic to increment the Lead's `urgency_score` automatically if the call outcome was positive.

## Completed Tasks
- [x] Replace `any` types in NextAuth session overriding (`src/app/api/auth/[...nextauth]/route.ts`).
- [x] Replace `any` types in `src/lib/adapters/index.ts`.
- [x] Add explicit Prisma `@relation` fields to `CallLog` and `Appointment` models to map to `Lead` directly.
- [x] Refactor `src/app/api/dashboard/route.ts` to utilize the new direct relations for faster counting.
