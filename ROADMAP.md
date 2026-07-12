# ROADMAP: Long-Term Structural Milestones

## Phase 1-24 Completed
- Core architecture (Twilio, SendGrid, Vapi, Auth, MCP, Inngest, Direct Mail, Analytics, Calendar API Scheduling, Bi-Directional CRM Webhooks, OpenAI Structured Output Parsing, Live Tool Execution, Omnichannel UI Mapping, Agent Provisioning) is fully implemented.
- **Phase 21:** Geo-Spatial Coordinate Enrichment completed (Nominatim geocoding on CSV lead import and single lead creation).
- **Phase 22:** Map Rendering and Circle Prospecting complete (Interactive `react-leaflet` mapping with haversine distance filtering and CSV export).
- **Phase 23:** Notification System Improvements (Global toast banner polling for unread `Notification` database rows, triggered by webhooks).
- **Phase 24:** Direct Mail Dispatch Automation (LobDirectMailProvider migrated to Inngest background event jobs to unblock UI).

## Phase 25: Advanced Lead Scoring
- [ ] Transition from heuristic/rule-based scoring to ML-based predictive models analyzing the entire CRM historical lead pool.

## Phase 26: Direct Native Calling
- [ ] Implement WebRTC within the dashboard to allow agents to pick up warm transfers natively in the browser without bridging to external SIPs.
