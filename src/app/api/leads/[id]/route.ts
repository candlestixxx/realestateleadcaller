import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const leadId = p.id;
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        agent: true,
        activeWorkflow: true,
        activities: { orderBy: { createdAt: 'desc' } },
        scores: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const leadId = p.id;
    const body = await request.json();
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: body,
    });
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
