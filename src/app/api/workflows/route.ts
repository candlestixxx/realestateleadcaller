import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const workflows = await prisma.followUpWorkflow.findMany({
      include: {
        steps: {
          orderBy: { day: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(workflows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}
