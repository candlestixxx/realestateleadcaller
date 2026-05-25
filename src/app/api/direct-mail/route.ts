import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MockDirectMailProvider } from '@/lib/adapters';

export async function GET() {
  try {
    const tasks = await prisma.directMailTask.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch direct mail tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, campaignType } = body;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const directMail = new MockDirectMailProvider();
    await directMail.createMailTask(leadId, campaignType);

    const task = await prisma.directMailTask.create({
      data: {
        leadId,
        campaignType,
        status: 'Pending',
      }
    });

    await prisma.leadActivity.create({
      data: { leadId, type: 'Direct Mail', description: `Direct mail task created for ${campaignType}` }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create direct mail task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { taskId, status } = body;

        const updatedTask = await prisma.directMailTask.update({
            where: { id: taskId },
            data: { status }
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update direct mail task' }, { status: 500 });
    }
}
