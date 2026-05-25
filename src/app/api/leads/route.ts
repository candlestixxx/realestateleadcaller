import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { agent: true, activeWorkflow: true }
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Determine the workflow to assign based on lead type
    let targetWorkflow = null;
    if (body.lead_type === 'Buyer') {
      targetWorkflow = await prisma.followUpWorkflow.findFirst({ where: { name: 'Buyer 10-Day Blitz' } });
    } else if (body.lead_type === 'Seller') {
      targetWorkflow = await prisma.followUpWorkflow.findFirst({ where: { name: 'Seller 14-Day Follow-Up' } });
    }

    const lead = await prisma.lead.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        lead_type: body.lead_type || 'Buyer',
        status: 'New',
        activeWorkflowId: targetWorkflow ? targetWorkflow.id : undefined,
        currentWorkflowDay: targetWorkflow ? 0 : undefined,
        next_follow_up_at: targetWorkflow ? new Date() : undefined, // Schedule immediately
      },
    });

    if (targetWorkflow) {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'Workflow Started',
          description: `Assigned to ${targetWorkflow.name}`
        }
      });
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
