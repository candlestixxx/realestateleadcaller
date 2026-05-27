# TODO: Immediate Short-Term Tasks

## Phase 9: Workflow Engine Transition (Inngest)
- [x] Install `inngest` via npm.
- [x] Create `src/app/api/inngest/route.ts` to expose the Inngest API endpoint.
- [x] Create `src/inngest/client.ts` for initialization.
- [x] Create `src/inngest/functions.ts` to house the `processWorkflowTick` background job (migrating logic from `/api/engine/tick`).
- [x] Modify `src/app/api/engine/tick/route.ts` to dispatch an event rather than processing everything synchronously.

## Project Tech Debt
- [ ] Migrate final `any` types out of the `inngest` logic mapped functions.
