# TODO: Immediate Short-Term Tasks

## Phase 6: Team Analytics
- [x] Update `src/app/api/dashboard/route.ts` to calculate conversion rates (Hot Leads / Total Leads).
- [x] Add UI components to `src/app/page.tsx` (Dashboard) to render the new conversion metrics.
- [x] Calculate and display the percentage of workflows successfully completed vs. manually paused.

## General Tech Debt
- [ ] Add `.env.example` file based on actual used config variables.

## Completed Tasks
- [x] Create an Email Reply webhook handler for SendGrid/Mailgun to parse incoming emails (`/api/webhooks/sendgrid`).
- [x] Hook the `SentimentAnalyzer` to email replies to update the lead status (e.g. DNC or HOT).
- [x] Pause the workflow engine automatically if a lead responds via email.
