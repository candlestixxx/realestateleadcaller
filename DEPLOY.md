# DEPLOYMENT INSTRUCTIONS

## MVP Local Development Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/candlestixxx/realestateleadcaller.git
   cd realestateleadcaller
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
   npm run -D ts-node -O '{"module":"CommonJS"}' prisma/seed.ts
   ```

4. **Run Server**
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://localhost:3000`.

## Future Production Deployment (Vercel / AWS)

*   **Database:** Migrate from SQLite to PostgreSQL (e.g., Supabase, RDS, Neon). Update `DATABASE_URL` accordingly.
*   **Cron Jobs:** Configure Vercel Cron or AWS EventBridge to hit the `/api/engine/tick` endpoint every 5-15 minutes to process the workflow engine.
*   **Webhooks:** Expose public endpoints for CRM ingestion and Vapi/Retell SIP call state webhooks.
