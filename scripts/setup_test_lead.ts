import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const lead = await prisma.lead.findFirst({
    where: { first_name: 'John' }
  })

  const workflow = await prisma.followUpWorkflow.findFirst({
    where: { name: 'Buyer 10-Day Blitz' }
  })

  if (lead && workflow) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        activeWorkflowId: workflow.id,
        currentWorkflowDay: 0,
        next_follow_up_at: new Date() // Due now
      }
    })
    console.log(`Lead ${lead.first_name} assigned to ${workflow.name} and due for follow-up.`)
  } else {
    console.log('Lead or Workflow not found.')
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
