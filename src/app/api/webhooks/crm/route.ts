import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simulate parsing a common CRM payload format (e.g. Follow Up Boss / Zillow)
    const firstName = body.firstName || body.person?.firstName || 'Unknown';
    const lastName = body.lastName || body.person?.lastName || 'Lead';
    const email = body.emails?.[0]?.value || body.person?.emails?.[0]?.value || null;
    const phone = body.phones?.[0]?.value || body.person?.phones?.[0]?.value || null;

    // Attempt to parse intent from tags or source
    const rawTags = (body.tags || []).join(' ').toLowerCase();
    const source = (body.source || '').toLowerCase();

    let leadType = 'Buyer'; // Default
    if (rawTags.includes('seller') || source.includes('home value') || source.includes('listing')) {
      leadType = 'Seller';
    }

    let targetWorkflow = null;
    if (leadType === 'Buyer') {
      targetWorkflow = await prisma.followUpWorkflow.findFirst({ where: { name: 'Buyer 10-Day Blitz' } });
    } else if (leadType === 'Seller') {
      targetWorkflow = await prisma.followUpWorkflow.findFirst({ where: { name: 'Seller 14-Day Follow-Up' } });
    }

    // Default to the first user in the system (the admin) to prevent orphaned leads
    const defaultUser = await prisma.user.findFirst();

    const lead = await prisma.lead.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        lead_type: leadType,
        lead_source: body.source || 'CRM Webhook',
        status: 'New',
        userId: defaultUser?.id,
        activeWorkflowId: targetWorkflow ? targetWorkflow.id : undefined,
        currentWorkflowDay: targetWorkflow ? 0 : undefined,
        next_follow_up_at: targetWorkflow ? new Date() : undefined,
      },
    });

    if (targetWorkflow) {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'Workflow Started',
          description: `Assigned to ${targetWorkflow.name} via Webhook`
        }
      });
    }

    return NextResponse.json({ success: true, leadId: lead.id, message: 'Lead received and processed.' }, { status: 201 });
  } catch (error) {
    console.error('CRM Webhook Error:', error);
    return NextResponse.json({ error: 'Failed to process CRM webhook payload' }, { status: 500 });
  }
}
