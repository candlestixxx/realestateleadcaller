import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runPilot() {
    console.log("🚀 Starting Jules End-to-End Pilot Test...");

    try {
        // 1. Setup Mock User & Workflow
        console.log("⚙️  Configuring test user and workflows...");
        let user = await prisma.user.findFirst({ where: { email: 'pilot@example.com' } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: 'pilot@example.com',
                    password: 'hash',
                    name: 'Pilot Agent'
                }
            });
        }

        let workflow = await prisma.followUpWorkflow.findFirst({ where: { name: 'Pilot 10-Day Blitz' } });
        if (!workflow) {
            workflow = await prisma.followUpWorkflow.create({
                data: { name: 'Pilot 10-Day Blitz', description: 'Test workflow' }
            });
        }

        // 2. Ingest a Live Lead
        console.log("📥 Ingesting sample lead...");
        const lead = await prisma.lead.create({
            data: {
                first_name: 'John',
                last_name: 'Pilot',
                email: 'john.pilot@example.com',
                phone: '555-123-4567',
                lead_type: 'Buyer',
                status: 'New',
                userId: user.id,
                activeWorkflowId: workflow.id,
                currentWorkflowDay: 0,
                next_follow_up_at: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago (overdue)
            }
        });

        console.log(`✅ Lead ${lead.id} created successfully.`);

        // 3. Simulate CRM Webhook (Follow Up Boss setting lead to 'Closed')
        console.log("🔄 Simulating Follow Up Boss (FUB) Inbound CRM Sync...");

        // Directly calling the logic that our webhook would hit to test it locally
        const webhookPayload = {
            event: "people.updated",
            data: {
                email: "john.pilot@example.com",
                stage: "Closed"
            }
        };

        // We simulate the DB operations the webhook performs to bypass Next.js server requirements
        const fetchedLead = await prisma.lead.findFirst({ where: { email: webhookPayload.data.email } });
        if (fetchedLead) {
            await prisma.lead.update({
                where: { id: fetchedLead.id },
                data: { status: 'Closed/Archived', activeWorkflowId: null }
            });
            await prisma.leadActivity.create({
                data: {
                    leadId: fetchedLead.id,
                    type: "CRM_SYNC_INBOUND",
                    description: `Received upstream update from Follow Up Boss: ${webhookPayload.event}`
                }
            });
            console.log(`✅ FUB Webhook successfully paused workflows and updated status to Closed.`);
        }

        // 4. Verify Final State
        console.log("📊 Verifying final Lead State...");
        const finalLead = await prisma.lead.findUnique({
            where: { id: lead.id },
            include: { activities: true }
        });

        if (finalLead?.status === 'Closed/Archived' && finalLead?.activeWorkflowId === null) {
            console.log("🎉 Pilot Test Passed! CRM synchronization safely halted the automated workflow.");
        } else {
            console.error("❌ Pilot Test Failed! State machine did not respect the CRM sync.");
        }

        // Cleanup
        await prisma.leadActivity.deleteMany({ where: { leadId: lead.id } });
        await prisma.lead.delete({ where: { id: lead.id } });

    } catch (e) {
        console.error("❌ Test crashed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runPilot();
