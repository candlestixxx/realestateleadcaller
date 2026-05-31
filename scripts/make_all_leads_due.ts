import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const leads = await prisma.lead.findMany()
  const workflows = await prisma.followUpWorkflow.findMany()

  for (const lead of leads) {
    const workflow = workflows.find(w => 
      (lead.lead_type === 'Buyer' && w.name.includes('Buyer')) || 
      (lead.lead_type === 'Seller' && w.name.includes('Seller'))
    )

    if (workflow) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          activeWorkflowId: workflow.id,
          currentWorkflowDay: lead.currentWorkflowDay || 0,
          next_follow_up_at: new Date() // Force due now
        }
      })
      console.log(`Updated ${lead.first_name} (${lead.lead_type}) to be due for workflow: ${workflow.name}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
