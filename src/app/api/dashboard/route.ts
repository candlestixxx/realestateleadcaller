import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalLeads = await prisma.lead.count();
    const newLeads = await prisma.lead.count({ where: { status: 'New' } });
    const hotLeads = await prisma.lead.count({ where: { urgency_score: { gte: 76 } } });

    const now = new Date();
    const overdueFollowUps = await prisma.lead.count({
      where: {
        activeWorkflowId: { not: null },
        next_follow_up_at: { lte: now }
      }
    });

    return NextResponse.json({
      totalLeads,
      newLeads,
      hotLeads,
      overdueFollowUps,
      appointmentsSet: 0, // Mock
      warmTransfersCompleted: 0, // Mock
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
