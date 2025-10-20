const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAppointments() {
  try {
    console.log('Starting appointment seeding...');

    // Fetch the user with specific email
    const user = await prisma.user.findUnique({
      where: {
        email: 'rs3296472t@gmail.com'
      }
    });

    if (!user) {
      throw new Error('User with email rs3296472t@gmail.com not found');
    }

    console.log(`Found user: ${user.id}`);

    // Fetch 10 leads from the database
    const leads = await prisma.lead.findMany({
      take: 10
    });

    if (leads.length === 0) {
      throw new Error('No leads found in database');
    }

    console.log(`Found ${leads.length} leads`);

    // Appointment statuses to use
    const statuses = ['PENDING', 'COMPLETED'];

    // Create appointments for each lead
    const appointments = [];
    const now = new Date();

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      // Create appointments with varying scheduled times (today, tomorrow, in 2 days, etc.)
      const daysToAdd = i % 5; // Spread across 5 days
      const hoursToAdd = (i % 3) * 2 + 9; // 9 AM, 11 AM, 1 PM
      
      const scheduledAt = new Date(now);
      scheduledAt.setDate(scheduledAt.getDate() + daysToAdd);
      scheduledAt.setHours(hoursToAdd, 0, 0, 0);

      const appointment = {
        leadId: lead.id,
        userId: user.id,
        scheduledAt: scheduledAt,
        duration: [30, 45, 60][i % 3], // Vary duration: 30, 45, or 60 minutes
        status: statuses[i % statuses.length], // Rotate through statuses
        completed: i % 4 === 0 ? true : false // Every 4th appointment is completed
      };

      appointments.push(appointment);
    }

    // Create all appointments
    const createdAppointments = await prisma.appointment.createMany({
      data: appointments,
      skipDuplicates: true
    });

    console.log(`✅ Successfully created ${createdAppointments.count} appointments`);
    
    // Display summary
    console.log('\nAppointment Summary:');
    console.log(`- User: ${user.email}`);
    console.log(`- Total appointments created: ${createdAppointments.count}`);
    console.log(`- Leads assigned: ${leads.length}`);

  } catch (error) {
    console.error('❌ Error seeding appointments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAppointments()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });