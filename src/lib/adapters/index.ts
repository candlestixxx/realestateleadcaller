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

export class MockSmsProvider implements SmsProvider {
  async sendText(leadId: string, message: string) {
    console.log(`Mock: Sending SMS to lead ${leadId}: ${message}`);
    return true;
  }
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
