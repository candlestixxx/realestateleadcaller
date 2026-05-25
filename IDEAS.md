# IDEAS for Expansion

## Pivot 1: Live Voice Integration (Vapi / Retell)
*   Replace `MockVoiceProvider` with real API calls to Vapi or Retell.
*   The `callLead` function should trigger an outbound call payload passing the compiled script and the Lead ID as metadata.
*   Implement a webhook listener (`/api/webhooks/voice`) to receive the call transcript and AI summary *after* the call ends, dynamically updating the lead's status and score based on sentiment analysis.

## Pivot 2: MCP (Model Context Protocol) Server
*   Build the core engine as an MCP Server.
*   Allow the Voice AI to query the local database in real-time during the call to verify property details or agent availability, rather than relying strictly on the pre-compiled script prompt.

## Pivot 3: CRM Synchronization Engine
*   Replace `MockCrmProvider` with a robust bidirectional sync engine (using OAuth).
*   If a lead is updated in Follow Up Boss, the webhook instantly pauses or alters the Jules workflow state machine to prevent double-contacting.

## Pivot 4: Autonomous Direct Mail Dispatch
*   Integrate Postalytics or Lob API into `MockDirectMailProvider`.
*   When a lead hits Day 14 of the Seller sequence without answering, automatically dispatch a "Just Sold" postcard using the target property address.
