# TODO: Immediate Short-Term Tasks

- [x] Add robust error handling (e.g., try/catch blocks with toast notifications) to all frontend `fetch` calls.
- [x] Implement a webhook receiving endpoint (`/api/webhooks/crm`) to parse incoming leads from Zillow/FollowUpBoss.
- [x] Connect the "Direct Mail Tasks" UI button directly to the POST route to allow manual triggering of mail tasks.
- [x] Add a visual indicator on the Lead Profile page to show which step of the Workflow the lead is currently on.
- [x] Set up a basic GitHub Actions workflow to run ESLint and Next.js builds on push.

## Next Steps for Workflow Engine
- [x] Connect the Visual Workflow Builder UI to the `POST /api/workflows` and `PUT /api/workflows/[id]` endpoints to persist step orders.
- [x] Move the Workflow Engine execution logic from the `/api/engine/tick` cron endpoint to a dedicated background task queue (e.g., Inngest or BullMQ) for better scalability and retry mechanics.
