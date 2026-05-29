import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SentimentAnalyzer } from "@/lib/adapters/sentiment";
import { getCrmProvider } from "@/lib/adapters";

const prisma = new PrismaClient();

// This endpoint receives incoming emails via SendGrid's Inbound Parse webhook.
// SendGrid posts data as multipart/form-data.
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract required fields
    const fromRaw = formData.get("from") as string || "";
    const bodyText = formData.get("text") as string || "";
    const subject = formData.get("subject") as string || "No Subject";

    // "From" usually comes in as "John Doe <john@example.com>"
    // Extract just the email part using a basic regex
    const emailMatch = fromRaw.match(/<([^>]+)>/);
    const fromEmail = emailMatch ? emailMatch[1].trim().toLowerCase() : fromRaw.trim().toLowerCase();

    if (!fromEmail) {
       return NextResponse.json({ error: "Missing 'from' parameter" }, { status: 400 });
    }

    console.log(`[SendGrid Webhook] Received email from ${fromEmail}. Subject: ${subject}`);

    // Look up the lead by email
    const lead = await prisma.lead.findFirst({
      where: {
        email: fromEmail
      }
    });

    if (!lead) {
      console.log(`[SendGrid Webhook] No lead found matching email: ${fromEmail}`);
      return NextResponse.json({ success: true, note: "Ignored, no matching lead." });
    }

    // 1. Log the incoming message
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "INBOUND_EMAIL",
        description: `Subject: ${subject}\n\nBody: ${bodyText.substring(0, 200)}...`
      }
    });

    // 2. Perform Sentiment & Intent Analysis
    const analysis = await SentimentAnalyzer.analyze(bodyText, lead.userId || undefined);

    let newStatus = lead.status;

    // 3. Update Lead Status based on Intent
    if (analysis.intent === "DNC" || analysis.intent === "UNSUBSCRIBE") {
      newStatus = "Do Not Contact";
    } else if (analysis.intent === "HOT" || analysis.sentiment === "POSITIVE") {
      newStatus = "Hot Lead";
    } else {
      newStatus = "Contacted";
    }

    // 4. Auto-Pause active workflows to prevent double-messaging
    const updatedLeadData = {
        status: newStatus,
        activeWorkflowId: null,
        urgency_score: analysis.intent === "HOT" ? Math.min((lead.urgency_score || 0) + 50, 100) : lead.urgency_score
    };

    await prisma.lead.update({
      where: { id: lead.id },
      data: updatedLeadData
    });

    if (newStatus === "Hot Lead" && lead.userId) {
        await prisma.notification.create({
            data: {
                userId: lead.userId,
                title: "Hot Lead Alert! (Email)",
                message: `${lead.first_name} replied positively via email. Workflow paused.`,
                link: `/leads/${lead.id}`
            }
        });
    }

    console.log(`[SendGrid Webhook] Lead ${lead.id} status updated to ${newStatus}. Workflow PAUSED.`);

    // 5. Trigger CRM Outbound Sync
    const crmProvider = getCrmProvider();
    await crmProvider.updateLead(lead.id, updatedLeadData as any);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[SendGrid Webhook] Error processing Email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
