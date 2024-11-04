import { PrismaClient } from '@prisma/client';

// Create a Prisma Client instance
const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Could not connect to the database.');
  }

  return prisma; // Return the Prisma client instance
};

// Export Prisma client for use in other parts of your application
export default prisma;
