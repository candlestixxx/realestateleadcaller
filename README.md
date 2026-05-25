# AI Real Estate Concierge Follow-Up System

This is a Minimum Viable Product (MVP) for "Jules", an AI Real Estate Concierge designed to automatically contact, qualify, nurture, and warm-transfer real estate leads.

## Architecture

*   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS.
*   **Backend**: Next.js API Routes.
*   **Database**: SQLite via Prisma ORM.
*   **Adapters**: A modular adapter pattern (`src/lib/adapters`) is used to mock external communications (Voice, SMS, Email, CRM, Direct Mail, Calendar, Social Messaging) for the MVP phase.

## Features

1.  **Dashboard**: Centralized view of lead statistics and overdue follow-ups.
2.  **Lead Management**: View all leads, add new leads, and view detailed lead profiles with communication history and AI summaries.
3.  **Workflow Engine**: An automated state-machine (triggered via `/api/engine/tick`) that processes leads through structured follow-up sequences (e.g., "Buyer 10-Day Blitz").
4.  **AI Script Engine**: Compiles dynamic conversation scripts based on lead data.
5.  **Warm Transfers**: Mocks the process of qualifying a lead and bridging them to a human agent, generating an AI summary of the conversation.
6.  **Direct Mail System**: A UI and API for generating and tracking direct mail tasks.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Set Environment Variables**:
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
3.  **Initialize the Database**:
    Push the Prisma schema to the SQLite database and seed the default workflows:
    ```bash
    npx prisma db push
    npm run build # if types are missing
    npx ts-node -O '{"module":"CommonJS"}' prisma/seed.ts
    ```
4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Workflow Engine

To simulate the background cron job that processes automated follow-ups:

1.  Click **"Run Workflow Engine"** on the Dashboard, OR
2.  Run the following `curl` command:
    ```bash
    curl -X POST http://localhost:3000/api/engine/tick
    ```

## Recommended Next Steps

1.  **Implement Real Providers**: Replace the `Mock` classes in `src/lib/adapters` with actual API integrations (e.g., Retell/Vapi for Voice, Twilio for SMS).
2.  **Cron Job Scheduler**: Set up a real cron job (e.g., using GitHub Actions, Vercel Cron, or a Node scheduler) to hit `/api/engine/tick` automatically.
3.  **Authentication**: Add NextAuth or similar to secure the dashboard and API routes.
4.  **Webhooks**: Build inbound webhooks to receive live lead data from external CRMs (Follow Up Boss, KVCore, etc.).
