//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (except users)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.enrichmentQuestion.deleteMany();

  console.log('🗑️ Cleared existing data (users left untouched)');

  // Create Enrichment Questions
  const enrichmentQuestions = await Promise.all([
    prisma.enrichmentQuestion.create({ data: { question: "What is your preferred price range?" } }),
    prisma.enrichmentQuestion.create({ data: { question: "When are you looking to buy/sell?" } }),
    prisma.enrichmentQuestion.create({ data: { question: "What area are you interested in?" } }),
    prisma.enrichmentQuestion.create({ data: { question: "Do you have financing pre-approval?" } }),
    prisma.enrichmentQuestion.create({ data: { question: "What type of property interests you most?" } }),
  ]);

  console.log('✅ Created enrichment questions');

  // Get existing users
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length === 0) throw new Error('No users found. Create users first.');

  const adminUser = existingUsers.find(u => u.role === 'ADMIN') || existingUsers[0];
  const regularUser = existingUsers.find(u => u.role === 'USER' && u.id !== adminUser.id) || existingUsers[0];

  console.log(`✅ Using existing users: Admin=${adminUser.email}, User=${regularUser.email}`);

  // Create Bots
  const buyerBot = await prisma.bot.create({
    data: {
      userid: adminUser.id,
      type: 'BUYER',
      name: 'Home Buyer Assistant',
      bussinessinfo: 'Premium Real Estate Services specializing in residential properties in the greater metropolitan area.',
      appointmentsetter: true,
      islive: true,
      startingmessage: 'Hi! I\'m here to help you find your perfect home. What type of property are you looking for?',
      prompt: 'You are a friendly real estate assistant helping buyers find properties. Be helpful, ask qualifying questions, and try to schedule viewings when appropriate.',
      enrichment: { connect: enrichmentQuestions.slice(0, 4).map(q => ({ id: q.id })) },
    },
  });

  const sellerBot = await prisma.bot.create({
    data: {
      userid: regularUser.id,
      type: 'SELLER',
      name: 'Property Seller Assistant',
      bussinessinfo: 'Expert real estate services for property sellers. We provide market analysis, professional photography, and comprehensive marketing strategies to sell your home quickly.',
      appointmentsetter: true,
      islive: true,
      startingmessage: 'Hello! I can help you sell your property. Would you like to know what your home is worth in today\'s market?',
      prompt: 'You are a real estate assistant helping property sellers. Focus on home valuations, market conditions, and scheduling listing appointments.',
      enrichment: { connect: [enrichmentQuestions[1], enrichmentQuestions[2], enrichmentQuestions[4]].map(q => ({ id: q.id })) },
    },
  });

  const testBot = await prisma.bot.create({
    data: {
      userid: adminUser.id,
      type: 'BUYER',
      name: 'Test Bot (Inactive)',
      bussinessinfo: 'Test bot for development purposes',
      appointmentsetter: false,
      islive: false,
      startingmessage: 'This is a test bot',
      prompt: 'Test prompt for development'
    },
  });

  console.log('✅ Created bots');

  // Helper function to create September 2025 date
  const sep2025 = (day: number, hour = 10, minute = 0) => new Date(2025, 8, day, hour, minute);

  // Create Leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'Michael Johnson',
        email: ['michael.johnson@email.com'],
        phone: ['+15559876543'],
        smscapablephone: ['+15559876543'],
        address: '123 Oak Street, Springfield, IL 62701',
        status: 'HOT',
        state: 'TALKING',
        source: 'HUBSPOT',
        initiated: true,
        userId: adminUser.id,
        botId: buyerBot.id,
        createdAt: sep2025(5),
        updatedAt: sep2025(5, 12),
        data: { budget: '$300,000 - $400,000', bedrooms: '3-4', preferredArea: 'Downtown Springfield', timeline: 'Next 3 months', preApproved: true }
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Emily Davis',
        email: ['emily.davis@gmail.com', 'e.davis.work@company.com'],
        phone: ['+15551234567', '+15559999999'],
        smscapablephone: ['+15551234567'],
        address: '456 Maple Avenue, Springfield, IL 62702',
        status: 'HOT',
        state: 'APPOINTMENT',
        source: 'GOOGLE_SHEETS',
        initiated: true,
        userId: regularUser.id,
        botId: sellerBot.id,
        createdAt: sep2025(6),
        updatedAt: sep2025(6, 12),
        data: { propertyType: 'Single Family Home', estimatedValue: '$450,000', sellingReason: 'Relocating for job', timeline: 'ASAP' }
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Robert Wilson',
        email: ['robert.wilson@outlook.com'],
        phone: ['+15555678901'],
        smscapablephone: ['+15555678901'],
        address: '789 Pine Road, Springfield, IL 62703',
        status: 'WARM',
        state: 'REPLIED',
        source: 'REDX',
        initiated: true,
        userId: adminUser.id,
        botId: buyerBot.id,
        createdAt: sep2025(7),
        updatedAt: sep2025(7, 12),
        data: { budget: '$200,000 - $300,000', bedrooms: '2-3', timeline: 'Next 6 months' }
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Lisa Thompson',
        email: ['lisa.t@email.com'],
        phone: ['+15552345678'],
        smscapablephone: ['+15552345678'],
        address: '321 Elm Drive, Springfield, IL 62704',
        status: 'WARM',
        state: 'INITIATED',
        source: 'MANUAL',
        initiated: false,
        userId: regularUser.id,
        botId: sellerBot.id,
        createdAt: sep2025(8),
        updatedAt: sep2025(8, 12),
        data: { propertyType: 'Condo', bedrooms: 2, yearBuilt: 2010 }
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Spam User',
        email: ['spam@fakeemail.com'],
        phone: ['+15551111111'],
        smscapablephone: [],
        address: 'Unknown Address',
        status: 'JUNK',
        source: 'HUBSPOT',
        initiated: false,
        userId: adminUser.id,
        botId: buyerBot.id,
        createdAt: sep2025(9),
        updatedAt: sep2025(9, 12),
        data: { notes: 'Marked as spam - irrelevant inquiry' }
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Jane Smith',
        email: ['jane.smith@email.com'],
        phone: ['+15556789012'],
        smscapablephone: ['+15556789012'],
        address: '654 Cedar Lane, Springfield, IL 62705',
        status: 'WARM',
        source: 'GOOGLE_SHEETS',
        initiated: true,
        userId: adminUser.id,
        botId: buyerBot.id,
        createdAt: sep2025(10),
        updatedAt: sep2025(10, 12),
        data: { budget: '$400,000 - $500,000', bedrooms: '4+', timeline: 'Next year' }
      },
    })
  ]);

  console.log('✅ Created leads');

  // Create Contacts
  for (const lead of leads) {
    for (const email of lead.email) {
      await prisma.contact.create({ data: { leadId: lead.id, type: 'EMAIL', value: email } });
    }
    for (const phone of lead.phone) {
      await prisma.contact.create({ data: { leadId: lead.id, type: 'PHONE', value: phone } });
    }
  }

  console.log('✅ Created contacts');

  // Create Conversations
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        leadId: leads[0].id,
        userId: adminUser.id,
        type: 'BUYER',
        status: 'TALKING',
        botId: buyerBot.id,
        aiSummary: 'Lead is interested in 3-4 bedroom homes in downtown Springfield, budget $300-400k, pre-approved for financing.',
        createdAt: sep2025(5, 11),
        updatedAt: sep2025(5, 12)
      }
    }),
    prisma.conversation.create({
      data: {
        leadId: leads[1].id,
        userId: regularUser.id,
        type: 'SELLER',
        status: 'APPOINTMENTSETTING',
        botId: sellerBot.id,
        appointmentdataprompt: 'Schedule home evaluation appointment for property at 456 Maple Avenue',
        aiSummary: 'Seller wants quick sale due to job relocation, property estimated at $450k.',
        createdAt: sep2025(6, 11),
        updatedAt: sep2025(6, 12)
      }
    }),
    prisma.conversation.create({
      data: {
        leadId: leads[2].id,
        userId: adminUser.id,
        type: 'BUYER',
        status: 'TALKING',
        botId: buyerBot.id,
        aiSummary: 'Interested buyer with $200-300k budget, looking for 2-3 bedrooms, timeline 6 months.',
        createdAt: sep2025(7, 11),
        updatedAt: sep2025(7, 12)
      }
    })
  ]);

  console.log('✅ Created conversations');

  // Create Messages
  const messages = [
    { conversationId: conversations[0].id, botId: buyerBot.id, leadId: leads[0].id, sender: 'AI', content: 'Hi! I\'m here to help you find your perfect home.', timestamp: sep2025(5, 11, 5) },
    { conversationId: conversations[0].id, botId: buyerBot.id, leadId: leads[0].id, sender: 'LEAD', content: 'Looking for 3-4 bedroom house downtown.', timestamp: sep2025(5, 11, 10) },
    { conversationId: conversations[1].id, botId: sellerBot.id, leadId: leads[1].id, sender: 'AI', content: 'Hello! I can help you sell your property.', timestamp: sep2025(6, 11, 5) },
    { conversationId: conversations[1].id, botId: sellerBot.id, leadId: leads[1].id, sender: 'LEAD', content: 'Yes, I need to sell quickly.', timestamp: sep2025(6, 11, 10) },
    { conversationId: conversations[2].id, botId: buyerBot.id, leadId: leads[2].id, sender: 'AI', content: 'Hi! I\'m here to help you find your perfect home.', timestamp: sep2025(7, 11, 5) },
    { conversationId: conversations[2].id, botId: buyerBot.id, leadId: leads[2].id, sender: 'LEAD', content: 'I want 2-3 bedroom house.', timestamp: sep2025(7, 11, 10) }
  ];

  for (const msg of messages) await prisma.message.create({ data: msg });

  console.log('✅ Created messages');

  // Create Appointments
  await Promise.all([
    prisma.appointment.create({ data: { leadId: leads[1].id, userId: regularUser.id, scheduledAt: sep2025(15, 14), status: 'CONFIRMED' } }),
    prisma.appointment.create({ data: { leadId: leads[0].id, userId: adminUser.id, scheduledAt: sep2025(20, 10, 30), status: 'PENDING' } }),
    prisma.appointment.create({ data: { leadId: leads[2].id, userId: adminUser.id, scheduledAt: sep2025(21, 15), status: 'PENDING' } })
  ]);

  console.log('✅ Created appointments');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch(e => { console.error('❌ Error during seeding:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
