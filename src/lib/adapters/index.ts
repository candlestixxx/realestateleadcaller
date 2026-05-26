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

export interface CrmProvider {
  updateLead(leadId: string, data: any): Promise<boolean>;
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

import twilio from 'twilio';
import { prisma } from '@/lib/prisma';

export class TwilioSmsProvider implements SmsProvider {
  async sendText(leadId: string, message: string) {
    try {
      const settings = await prisma.integrationSettings.findMany({
        where: { provider: { in: ['twilio_sid', 'twilio_token', 'twilio_from_number'] } }
      });

      const sid = settings.find(s => s.provider === 'twilio_sid')?.apiKey;
      const token = settings.find(s => s.provider === 'twilio_token')?.apiKey;
      const from = settings.find(s => s.provider === 'twilio_from_number')?.apiKey;

      if (!sid || !token || !from) {
        console.warn('Twilio credentials incomplete, falling back to mock provider');
        return new MockSmsProvider().sendText(leadId, message);
      }

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || !lead.phone) throw new Error('Lead phone number missing');

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
  async updateLead(leadId: string, data: any) {
    console.log(`Mock: Updating lead ${leadId} in CRM with data:`, data);
    return true;
  }
}
