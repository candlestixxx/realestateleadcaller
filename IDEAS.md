# IDEAS for Expansion (v2 and beyond)

*Note: All original "Pivot" ideas from the v1 design document (Live Vapi Integration, MCP Server, Bi-Directional CRM Sync, and Lob Direct Mail Dispatch) have been successfully built into the v1.0 MVP.*

## Pivot 5: AI-Driven Email Generation
*   Integrate the OpenAI SDK to generate highly personalized follow-up emails dynamically, rather than relying solely on static templates. The prompt would use the `LeadActivity` history and `AIConversationSummary` to contextually craft the exact email.

## Pivot 6: Multi-Channel Messaging via Agent Number
*   Migrate Twilio logic to support WhatsApp and iMessage via the same numbers.

## Pivot 7: Real Estate MLS Integration
*   Build a pipeline using the RETS/RESO Web API to ingest live local MLS data, allowing Jules to automatically reference specific active properties during the `10-Day Buyer Blitz` sequence.
