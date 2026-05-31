import { prisma } from '@/lib/prisma';
import { CrmProvider, MockCrmProvider } from './index';
import { Lead } from '@prisma/client';

export class WebhookCrmProvider implements CrmProvider {
  async updateLead(leadId: string, data: Partial<Lead>): Promise<boolean> {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) throw new Error('Lead not found');

      // Fetch webhook URL from user's integration settings
      const settings = await prisma.integrationSettings.findFirst({
        where: {
          provider: 'crm_webhook_url',
          userId: lead.userId || undefined
        }
      });

      const webhookUrl = settings?.apiKey;

      if (!webhookUrl) {
        console.warn(`[CRM Sync] No crm_webhook_url found for user ${lead.userId}. Falling back to mock sync.`);
        return new MockCrmProvider().updateLead(leadId, data);
      }

      console.log(`[CRM Sync] Pushing update to ${webhookUrl} for lead ${leadId}`);

      const payload = {
        event: "lead_updated",
        lead: {
          ...lead,
          ...data
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`CRM API returned ${response.status} ${response.statusText}`);
      }

      console.log(`[CRM Sync] Success: Lead ${leadId} synced.`);
      return true;

    } catch (e) {
      console.error(`[CRM Sync] Error:`, e);
      return false;
    }
  }
}

export function getCrmProvider(): CrmProvider {
  return new WebhookCrmProvider();
}
