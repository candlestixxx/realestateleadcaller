# DEPLOYMENT INSTRUCTIONS

## Quick Start (Docker)
The easiest way to run the application is using Docker. Ensure Docker and Docker Compose are installed on your machine.

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. **Start the container**
   ```bash
   docker-compose up --build -d
   ```

The application will be available at `http://localhost:3000`. You can log in using the default credentials (`admin@example.com` / `password123`). The SQLite database is automatically persisted in a Docker volume.

---

## Native Local Development Setup

1. **Clone & Install**
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env`. Ensure `DATABASE_URL` is set to `"file:./dev.db"`.

3. **Database Initialization**
   Apply the Prisma schema and seed the initial workflows and mock leads.
   ```bash
   npx prisma db push
   npx prisma generate
   npm run build
   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```

4. **Run Server**
   Access the dashboard at `http://localhost:3000`. Login with the default seed account:
   * Email: `admin@example.com`
   * Password: `password123`

5. **Run Background Workers**
   This application uses Inngest for durable background tasks. To process workflows locally, run the Inngest dev server in a separate terminal.

## Future Production Deployment (Vercel / AWS)

*   **Database:** Migrate from SQLite to PostgreSQL (e.g., Supabase, RDS, Neon). Update the `provider` in `prisma/schema.prisma` and the `DATABASE_URL` in `.env` accordingly.
*   **Background Tasks:** Deploy the Inngest handlers to your Vercel project and sync your Vercel project with the Inngest Cloud dashboard. The `/api/inngest` endpoint will automatically pick up `workflow/tick` events.
*   **Cron Jobs:** Configure Inngest Cloud Cron to fire a `workflow/tick` event every 5-15 minutes to process the state machine engine.
*   **Webhooks:** Your public production URL must be registered in:
    *   SendGrid (Inbound Parse pointing to `/api/webhooks/sendgrid`)
    *   Twilio (Messaging Webhook pointing to `/api/webhooks/twilio`)
    *   Vapi (Server URL pointing to `/api/webhooks/vapi`)
    *   Follow Up Boss (Webhook pointing to `/api/webhooks/fub`)
