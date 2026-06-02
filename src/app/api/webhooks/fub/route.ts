import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This endpoint receives incoming webhooks from Follow Up Boss (FUB)
export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Example FUB Payload structure
    // { event: 'people.updated', uri: 'https://api.followupboss.com/v1/people/12345', data: { personId: 12345, ... } }

    // We'll mock the extraction process for the MVP
    const event = payload.event;
    const personEmail = payload.data?.email || payload.person?.email;

    if (!personEmail) {
       return NextResponse.json({ success: true, note: "Ignored, missing identifiable email or phone in payload." });
    }

    console.log(`[FUB Webhook] Received event: ${event} for ${personEmail}`);

    const lead = await prisma.lead.findFirst({
      where: {
        email: personEmail
      }
    });

    if (!lead) {
      console.log(`[FUB Webhook] No local lead found matching email: ${personEmail}`);
      return NextResponse.json({ success: true, note: "Ignored, no matching lead." });
    }

    let newStatus = lead.status;
    let pauseWorkflow = false;

    // Determine intent from the CRM event
    // In a real system, you'd fetch the full lead profile from FUB via the URI to check the exact "Stage"
    if (event === "people.deleted" || payload.data?.stage === "Trash" || payload.data?.stage === "Closed") {
        newStatus = "Closed/Archived";
        pauseWorkflow = true;
    } else if (payload.data?.stage === "Appointment Set") {
        newStatus = "Appointment Set";
        pauseWorkflow = true;
    }

    // Update local lead state
    const updateData: any = {
        status: newStatus
    };

    if (pauseWorkflow) {
        updateData.activeWorkflowId = null;
        console.log(`[FUB Webhook] Halting active workflows for Lead ${lead.id} based on upstream CRM state.`);
    }

    await prisma.lead.update({
        where: { id: lead.id },
        data: updateData
    });

    // Log the sync
    await prisma.leadActivity.create({
        data: {
            leadId: lead.id,
            type: "CRM_SYNC_INBOUND",
            description: `Received upstream update from Follow Up Boss: ${event}`
        }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[FUB Webhook] Error processing Follow Up Boss webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
