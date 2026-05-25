import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MockVoiceProvider, MockSmsProvider, MockEmailProvider } from '@/lib/adapters';
import { SCRIPTS, compileScript, generateMockSummary } from '@/lib/scripts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, action, agentPhone } = body;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { agent: true }
    });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const voice = new MockVoiceProvider();
    const sms = new MockSmsProvider();
    const email = new MockEmailProvider();

    const scriptData = {
      first_name: lead.first_name,
      last_name: lead.last_name,
      agent_name: lead.agent?.name || 'Local Agent',
      area: lead.city || 'your area',
      property_address: lead.property_address,
      lead_type: lead.lead_type,
      timeline: lead.timeline,
      motivation: lead.motivation
    };

    if (action === 'call') {
      await voice.callLead(leadId);
      const scriptToUse = lead.lead_type === 'Buyer' ? SCRIPTS.buyerFirstCall : SCRIPTS.sellerFirstCall;
      const compiledScript = compileScript(scriptToUse, scriptData);

      await prisma.leadActivity.create({
        data: { leadId, type: 'Call', description: `AI Call: "${compiledScript}"` }
      });
      return NextResponse.json({ success: true, message: 'Call initiated' });
    }

    if (action === 'warm_transfer') {
      await voice.warmTransfer(leadId, agentPhone || '555-0000');

      const bridgeScript = compileScript(SCRIPTS.warmTransferBridge, scriptData);
      const whisperScript = compileScript(SCRIPTS.agentWhisper, scriptData);
      const summaryText = generateMockSummary(scriptData, 'Lead Transferred to Agent');

      // Update lead status
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: 'Warm Transfer Completed',
          urgency_score: 90,
          ai_summary: summaryText
        }
      });

      // Create conversation record
      const conversation = await prisma.conversation.create({
        data: { leadId, transcript: 'Mock transcript data...' }
      });

      await prisma.aIConversationSummary.create({
        data: {
          conversationId: conversation.id,
          summary: summaryText
        }
      });

      await prisma.leadActivity.create({
        data: { leadId, type: 'Warm Transfer', description: `Agent whispered: ${whisperScript}` }
      });

      return NextResponse.json({ success: true, message: 'Warm transfer completed successfully' });
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
    console.error(error);
    return NextResponse.json({ error: 'Failed to trigger workflow' }, { status: 500 });
  }
}
