import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generates a random Date object within the month of October 2025.
 * It schedules appointments from the current day to the end of the month.
 * @returns {Date} A Date object set to a random day and time within October.
 */
function getRandomOctoberDate(): Date {
  const now = new Date(); // Assuming current date is in October 2025
  const year = 2025;
  const month = 9; // Month index for October is 9
  const currentDay = now.getDate();
  
  // The last day of October is 31
  const lastDayOfMonth = 31;

  // Handle case where script is run on the last day of the month
  if (currentDay >= lastDayOfMonth) {
      const date = new Date();
      const hour = Math.floor(Math.random() * (17 - 9) + 9); // 9 AM to 5 PM
      const minute = Math.floor(Math.random() * 60);
      date.setHours(hour, minute, 0, 0);
      return date;
  }

  // Generate a random day from the current day up to the end of the month
  const randomDay = Math.floor(Math.random() * (lastDayOfMonth - currentDay + 1)) + currentDay;

  const futureDate = new Date(year, month, randomDay);

  // Set a random time between 9 AM (9) and 5 PM (17)
  const hour = Math.floor(Math.random() * (17 - 9) + 9);
  const minute = Math.floor(Math.random() * 60);
  futureDate.setHours(hour, minute, 0, 0);

  return futureDate;
}


/**
 * This script finds a specific user, takes their first 13 leads, and creates
 * a random appointment for each of them within the month of October.
 */
async function main() {
  const userEmail = 'rs3296472t@gmail.com';
  console.log(`🚀 Starting appointment creation process for user: ${userEmail}`);

  // 1. Find the specific user by their email.
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error(`❌ User with email "${userEmail}" not found. Please ensure the user exists.`);
  }
  console.log(`👤 Found user: ${user.name} (ID: ${user.id})`);

  // 2. Fetch up to 13 leads for this user.
  const leadsToBook = await prisma.lead.findMany({
    where: { userId: user.id ,state:'APPOINTMENT'},
    take: 13,
    select: { id: true, name: true }, // Select name for better logging
  });

  if (leadsToBook.length === 0) {
    throw new Error(`❌ No leads found for user ${user.name}. Cannot create appointments.`);
  }
  if (leadsToBook.length < 13) {
    console.warn(`⚠️ Warning: Found only ${leadsToBook.length} leads, which is less than 13. Proceeding with available leads.`);
  }
  console.log(`🔍 Found ${leadsToBook.length} leads to process.`);

  // 3. Prepare the data for the new appointments.
  const appointmentsToCreate = leadsToBook.map((lead) => {
    const scheduledAt = getRandomOctoberDate(); // Use the updated function
    console.log(`  - Scheduling for lead "${lead.name}" at: ${scheduledAt.toLocaleString()}`);
    return {
      leadId: lead.id,
      userId: user.id,
      scheduledAt: scheduledAt,
    };
  });

  // 4. Create all the appointments in a single database transaction.
  const result = await prisma.appointment.createMany({
    data: appointmentsToCreate,
  });

  console.log(`✅ Successfully created ${result.count} new appointments.`);
}

// Execute the script and handle potential errors
main()
  .catch((e) => {
    console.error('❌ An error occurred during the appointment creation process:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Ensure the Prisma Client disconnects after the script runs
    await prisma.$disconnect();
    console.log('🔚 Process finished.');
  });
