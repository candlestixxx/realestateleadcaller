# TODO: Immediate Short-Term Tasks

## Inbound Communications (In Progress)
- [ ] Create `/api/webhooks/twilio` to receive incoming SMS replies.
- [ ] Write an LLM adapter (OpenAI mock for now) to perform Sentiment Analysis on the incoming message.
- [ ] Automatically update lead status to `Do Not Contact` if the intent is "STOP" or "Unsubscribe".
- [ ] Automatically update lead status to `Hot Lead` if the sentiment is highly positive or asks for a showing.
- [ ] Auto-pause active workflows for leads that respond to prevent double-messaging.

## Completed Tasks
- [x] Add robust error handling (e.g., try/catch blocks with toast notifications) to all frontend `fetch` calls.
- [x] Implement a webhook receiving endpoint (`/api/webhooks/crm`) to parse incoming leads from Zillow/FollowUpBoss.
- [x] Connect the "Direct Mail Tasks" UI button directly to the POST route to allow manual triggering of mail tasks.
- [x] Add a visual indicator on the Lead Profile page to show which step of the Workflow the lead is currently on.
- [x] Set up a basic GitHub Actions workflow to run ESLint and Next.js builds on push.
- [x] Connect the Visual Workflow Builder UI to the `POST /api/workflows` and `PUT /api/workflows/[id]` endpoints to persist step orders.
- [x] Move the Workflow Engine execution logic from the `/api/engine/tick` cron endpoint to a dedicated background task queue (e.g., Inngest or BullMQ) for better scalability and retry mechanics.
