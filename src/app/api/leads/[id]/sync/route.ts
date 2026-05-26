import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCrmProvider } from '@/lib/adapters';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const leadId = p.id;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        activities: { orderBy: { createdAt: 'desc' }, take: 5 }
      }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const crmProvider = getCrmProvider();
    const success = await crmProvider.updateLead(leadId, lead as any);

    if (!success) {
        return NextResponse.json({ error: 'CRM Sync failed. Check integration settings or logs.' }, { status: 500 });
    }

    // Log the sync activity
    await prisma.leadActivity.create({
        data: {
            leadId: lead.id,
            type: 'CRM_SYNC',
            description: 'Manually synced lead data to external CRM.'
        }
    });

    return NextResponse.json({ message: 'Lead successfully synced to CRM', success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process sync' }, { status: 500 });
  }
}
