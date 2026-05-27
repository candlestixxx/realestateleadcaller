# TODO: Immediate Short-Term Tasks

## Email Intelligence
- [x] Create an Email Reply webhook handler for SendGrid/Mailgun to parse incoming emails (`/api/webhooks/sendgrid`).
- [x] Hook the `SentimentAnalyzer` to email replies to update the lead status (e.g. DNC or HOT).
- [x] Pause the workflow engine automatically if a lead responds via email.

## Next Phase: Team Analytics
- [ ] Add lead conversion metrics to the Dashboard.

## Completed Tasks
- [x] Create a `KnowledgeBaseSnippet` Prisma model to store FAQs.
- [x] Develop a "Knowledge Base" UI page in the Settings section.
- [x] Connect the Knowledge Base snippets to the Voice AI adapter prompt generation logic.
- [x] Implement outbound webhooks module to push lead status updates back to upstream CRMs.
- [x] Create UI on the Lead Profile to trigger a manual "Sync to CRM" push.
