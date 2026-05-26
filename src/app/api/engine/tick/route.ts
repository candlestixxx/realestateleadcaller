import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVoiceProvider, getSmsProvider, getEmailProvider } from '@/lib/adapters';

export async function POST() {
  try {
    const now = new Date();

    // Find all leads with an active workflow that are due for a follow-up
    const dueLeads = await prisma.lead.findMany({
      where: {
        activeWorkflowId: { not: null },
        next_follow_up_at: { lte: now }
      },
      include: {
        activeWorkflow: {
          include: { steps: true }
        }
      }
    });

    const results = [];

    for (const lead of dueLeads) {
      if (!lead.activeWorkflow || lead.currentWorkflowDay === null) continue;

      // Fetch integration settings specific to this lead's owner (tenant)
      const settings = await prisma.integrationSettings.findMany({
        where: { userId: lead.userId || undefined }
      });

      // Providers will need to accept settings context. For now, since adapters
      // fetch their own settings, we must pass the userId to them.
      const voice = getVoiceProvider();
      const sms = getSmsProvider();
      const email = getEmailProvider();

      // Find the step for the current day
      const currentSteps = lead.activeWorkflow.steps.filter(s => s.day === lead.currentWorkflowDay);

      let stepExecuted = false;

      for (const step of currentSteps) {
        // Execute the action based on the channel
        if (step.channel === 'Call') {
          await voice.callLead(lead.id);
        } else if (step.channel === 'SMS') {
          await sms.sendText(lead.id, step.message || 'Automated SMS');
        } else if (step.channel === 'Email') {
          await email.sendEmail(lead.id, 'Follow-up', step.message || 'Automated Email');
        }

        await prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            type: `Automated ${step.channel}`,
            description: `Executed step for Day ${step.day}: ${step.script || step.message || ''}`
          }
        });
        stepExecuted = true;
      }

      // Progress to the next day
      const nextDay = (lead.currentWorkflowDay || 0) + 1;

      // Check if workflow has more steps
      const hasMoreSteps = lead.activeWorkflow.steps.some(s => s.day >= nextDay);

      if (hasMoreSteps) {
        // Schedule for tomorrow
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);

        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            currentWorkflowDay: nextDay,
            next_follow_up_at: nextDate
          }
        });
        results.push({ leadId: lead.id, action: 'progressed', nextDay });
      } else {
        // Workflow complete
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            activeWorkflowId: null,
            currentWorkflowDay: null,
            next_follow_up_at: null
          }
        });
        await prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            type: 'Workflow Complete',
            description: `${lead.activeWorkflow.name} finished.`
          }
        });
        results.push({ leadId: lead.id, action: 'completed' });
      }
    }

    return NextResponse.json({ success: true, processed: dueLeads.length, results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to execute engine tick' }, { status: 500 });
  }
}
