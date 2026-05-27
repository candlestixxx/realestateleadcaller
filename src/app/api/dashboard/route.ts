import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = user.id;

    const totalLeads = await prisma.lead.count({ where: { userId } });
    const newLeads = await prisma.lead.count({ where: { userId, status: 'New' } });
    const hotLeads = await prisma.lead.count({ where: { userId, status: 'Hot Lead' } });
    const dncLeads = await prisma.lead.count({ where: { userId, status: 'Do Not Contact' } });

    // Active vs Paused/Null workflows
    const activeWorkflows = await prisma.lead.count({ where: { userId, activeWorkflowId: { not: null } } });
    const pausedWorkflows = await prisma.lead.count({ where: { userId, activeWorkflowId: null, status: { not: 'New' } } });

    const now = new Date();
    const overdueFollowUps = await prisma.lead.count({
      where: {
        userId,
        activeWorkflowId: { not: null },
        next_follow_up_at: { lte: now }
      }
    });

    // KPI Metrics
    const conversionRate = totalLeads > 0 ? ((hotLeads / totalLeads) * 100).toFixed(1) : "0.0";
    const dncRate = totalLeads > 0 ? ((dncLeads / totalLeads) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      totalLeads,
      newLeads,
      hotLeads,
      dncLeads,
      activeWorkflows,
      pausedWorkflows,
      overdueFollowUps,
      conversionRate,
      dncRate,
      appointmentsSet: 0, // Pending phase 6 expansion
      warmTransfersCompleted: 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
