export interface VoiceProvider {
  callLead(leadId: string): Promise<boolean>;
  warmTransfer(leadId: string, agentPhone: string): Promise<boolean>;
}

export interface SmsProvider {
  sendText(leadId: string, message: string): Promise<boolean>;
}

export interface EmailProvider {
  sendEmail(leadId: string, subject: string, body: string): Promise<boolean>;
}

import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { prisma } from '@/lib/prisma';
import { Lead } from '@prisma/client';

export interface CrmProvider {
  updateLead(leadId: string, data: Partial<Lead>): Promise<boolean>;
}

export interface DirectMailProvider {
  createMailTask(leadId: string, campaignType: string): Promise<boolean>;
}

export interface CalendarProvider {
  createAppointment(leadId: string, date: Date): Promise<boolean>;
}

export interface SocialMessagingProvider {
  sendSocialMessage(leadId: string, platform: string, message: string): Promise<boolean>;
}

export class MockVoiceProvider implements VoiceProvider {
  async callLead(leadId: string) {
    console.log(`Mock: Calling lead ${leadId}`);
    return true;
  }
  async warmTransfer(leadId: string, agentPhone: string) {
    console.log(`Mock: Warm transferring lead ${leadId} to agent ${agentPhone}`);
    return true;
  }
}

export { getCrmProvider } from './crmOutbound';

export class VapiVoiceProvider implements VoiceProvider {
  async callLead(leadId: string) {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || !lead.phone) throw new Error('Lead phone number missing');

      const settings = await prisma.integrationSettings.findMany({
        where: { provider: 'vapi', userId: lead.userId || undefined }
      });
      const vapiKey = settings.find(s => s.provider === 'vapi')?.apiKey;

      if (!vapiKey) {
        console.warn('Vapi credentials missing, falling back to mock provider');
        return new MockVoiceProvider().callLead(leadId);
      }

      // Fetch knowledge base snippets to inject into the AI
      const snippets = await prisma.knowledgeBaseSnippet.findMany({
        where: { userId: lead.userId || undefined }
      });

      let knowledgeContext = "";
      if (snippets.length > 0) {
        knowledgeContext = "\n\nKNOWLEDGE BASE (Use these facts to answer questions):\n" +
          snippets.map(s => `Q: ${s.question}\nA: ${s.answer}`).join("\n\n");
      }

      const response = await fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vapiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumberId: 'your-vapi-phone-number-id', // Assuming static or from settings in a real app
          customer: {
            number: lead.phone,
            name: `${lead.first_name} ${lead.last_name}`,
          },
          assistantOverrides: {
            systemPrompt: `You are Jules, an AI real estate assistant. ${knowledgeContext}`,
            variableValues: {
              leadId: lead.id
            }
          },
          assistantId: 'your-vapi-assistant-id', // Assuming static or from settings
        }),
      });

      if (!response.ok) throw new Error(`Vapi API error: ${response.statusText}`);

      console.log(`Vapi: Successfully initiated call to ${lead.phone}`);
      return true;
    } catch (e) {
      console.error('Vapi Error:', e);
      return false;
    }
  }

  async warmTransfer(leadId: string, agentPhone: string) {
    console.log(`Vapi Mock: Warm transferring lead ${leadId} to agent ${agentPhone}`);
    // Note: Warm transfers in Vapi typically require handling mid-call functions
    // via a Server URL. For MVP outbound, we mock this specific step.
    return true;
  }
}

export function getVoiceProvider(): VoiceProvider {
  return new VapiVoiceProvider();
}

export class SendGridEmailProvider implements EmailProvider {
  async sendEmail(leadId: string, subject: string, body: string) {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || !lead.email) throw new Error('Lead email address missing');

      const settings = await prisma.integrationSettings.findMany({
        where: {
          provider: { in: ['sendgrid_api_key', 'sendgrid_from_email'] },
          userId: lead.userId || undefined
        }
      });

      const apiKey = settings.find(s => s.provider === 'sendgrid_api_key')?.apiKey;
      const fromEmail = settings.find(s => s.provider === 'sendgrid_from_email')?.apiKey;

      if (!apiKey || !fromEmail) {
        console.warn('SendGrid credentials incomplete, falling back to mock provider');
        return new MockEmailProvider().sendEmail(leadId, subject, body);
      }

      sgMail.setApiKey(apiKey);

      const msg = {
        to: lead.email,
        from: fromEmail,
        subject: subject,
        text: body,
      };

      await sgMail.send(msg);
      console.log(`SendGrid: Successfully sent email to ${lead.email}`);
      return true;
    } catch (e) {
      console.error('SendGrid Error:', e);
      return false;
    }
  }
}

export function getEmailProvider(): EmailProvider {
  return new SendGridEmailProvider();
}

export class MockCalendarProvider implements CalendarProvider {
  async createAppointment(leadId: string, date: Date) {
    console.log(`Mock: Setting up calendar appointment for lead ${leadId} at ${date}`);
    return true;
  }
}

export class MockSocialMessagingProvider implements SocialMessagingProvider {
  async sendSocialMessage(leadId: string, platform: string, message: string) {
    console.log(`Mock: Sending ${platform} message to lead ${leadId}: ${message}`);
    return true;
  }
}

export class MockDirectMailProvider implements DirectMailProvider {
  async createMailTask(leadId: string, campaignType: string) {
    console.log(`Mock: Creating Direct Mail Task for lead ${leadId} - Campaign: ${campaignType}`);
    return true;
  }
}

export class MockSmsProvider implements SmsProvider {
  async sendText(leadId: string, message: string) {
    console.log(`Mock: Sending SMS to lead ${leadId}: ${message}`);
    return true;
  }
}

export class TwilioSmsProvider implements SmsProvider {
  async sendText(leadId: string, message: string) {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || !lead.phone) throw new Error('Lead phone number missing');

      const settings = await prisma.integrationSettings.findMany({
        where: {
          provider: { in: ['twilio_sid', 'twilio_token', 'twilio_from_number'] },
          userId: lead.userId || undefined
        }
      });

      const sid = settings.find(s => s.provider === 'twilio_sid')?.apiKey;
      const token = settings.find(s => s.provider === 'twilio_token')?.apiKey;
      const from = settings.find(s => s.provider === 'twilio_from_number')?.apiKey;

      if (!sid || !token || !from) {
        console.warn('Twilio credentials incomplete, falling back to mock provider');
        return new MockSmsProvider().sendText(leadId, message);
      }

      const client = twilio(sid, token);
      await client.messages.create({
        body: message,
        from: from,
        to: lead.phone
      });

      console.log(`Twilio: Successfully sent SMS to ${lead.phone}`);
      return true;
    } catch (e) {
      console.error('Twilio Error:', e);
      return false;
    }
  }
}

export function getSmsProvider(): SmsProvider {
  // Can be configured to switch dynamically based on environment or settings
  return new TwilioSmsProvider();
}

export class MockEmailProvider implements EmailProvider {
  async sendEmail(leadId: string, subject: string, body: string) {
    console.log(`Mock: Sending Email to lead ${leadId} - ${subject}`);
    return true;
  }
}

export class MockCrmProvider implements CrmProvider {
  async updateLead(leadId: string, data: Partial<Lead>) {
    console.log(`Mock: Updating lead ${leadId} in CRM with data:`, data);
    return true;
  }
}
