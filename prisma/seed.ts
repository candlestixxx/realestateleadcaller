import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  })

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      name: 'Jules AI Agent',
      userId: user.id,
    },
  })

  // Create Workflows
  const buyerWorkflow = await prisma.followUpWorkflow.create({
    data: {
      name: 'Buyer 10-Day Blitz',
      description: 'Aggressive 10-day follow up for new buyers',
      steps: {
        create: [
          { day: 0, channel: 'Call', script: 'Immediate buyer call' },
          { day: 1, channel: 'Email', message: 'Market snapshot' },
        ],
      },
    },
  })

  const sellerWorkflow = await prisma.followUpWorkflow.create({
    data: {
      name: 'Seller 14-Day Follow-Up',
      description: '14-day sequence for seller leads',
      steps: {
        create: [
          { day: 1, channel: 'Call', script: 'Immediate seller call' },
        ],
      },
    },
  })

  // Create Leads
  await prisma.lead.create({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-1234',
      lead_type: 'Buyer',
      assigned_agent_id: agent.id,
      status: 'New',
    },
  })

  await prisma.lead.create({
    data: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-5678',
      lead_type: 'Seller',
      assigned_agent_id: agent.id,
      status: 'New',
    },
  })

  console.log('Database seeded successfully!')
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
