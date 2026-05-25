import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MockVoiceProvider, MockSmsProvider, MockEmailProvider } from '@/lib/adapters';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, action, agentPhone } = body;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const voice = new MockVoiceProvider();
    const sms = new MockSmsProvider();
    const email = new MockEmailProvider();

    if (action === 'call') {
      await voice.callLead(leadId);
      await prisma.leadActivity.create({
        data: { leadId, type: 'Call', description: 'AI Call Initiated' }
      });
      return NextResponse.json({ success: true, message: 'Call initiated' });
    }

    if (action === 'warm_transfer') {
      await voice.warmTransfer(leadId, agentPhone || '555-0000');
      await prisma.leadActivity.create({
        data: { leadId, type: 'Warm Transfer', description: 'Warm transfer initiated' }
      });
      return NextResponse.json({ success: true, message: 'Warm transfer initiated' });
    }

    if (action === 'sms') {
      await sms.sendText(leadId, 'Hello from Jules AI');
      await prisma.leadActivity.create({
        data: { leadId, type: 'SMS', description: 'SMS Sent' }
      });
      return NextResponse.json({ success: true, message: 'SMS sent' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger workflow' }, { status: 500 });
  }
}
