# TODO: Immediate Short-Term Tasks

## Knowledge Base Module
- [x] Create a `KnowledgeBaseSnippet` Prisma model to store FAQs.
- [x] Develop a "Knowledge Base" UI page in the Settings section.
- [x] Connect the Knowledge Base snippets to the Voice AI adapter prompt generation logic.

## Email Intelligence
- [ ] Create an Email Reply webhook handler for SendGrid/Mailgun to parse incoming emails.

## Completed Tasks
- [x] Implement outbound webhooks module to push lead status updates back to upstream CRMs.
- [x] Create UI on the Lead Profile to trigger a manual "Sync to CRM" push.
- [x] Add `crm_webhook_url` configuration field to the Settings > Integrations UI page.
- [x] Create `/api/webhooks/twilio` to receive incoming SMS replies.
- [x] Write an LLM adapter (OpenAI mock for now) to perform Sentiment Analysis on the incoming message.
