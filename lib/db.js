import { PrismaClient } from '@prisma/client';

// Declare the Prisma instance at the module level so it persists across function calls
let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production, reuse the existing Prisma Client instance to avoid creating a new one on every function call
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PINXSB_POSTGRES_PRISMA_URL,  // Supabase connection URL from your .env file
      },
    },
  });
  prisma.$connect();  // Manually connect when needed
} else {
  // In development, use a global variable to preserve the Prisma Client instance across hot reloading
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PINXSB_POSTGRES_PRISMA_URL,  // Supabase connection URL
        },
      },
    });
  }
  prisma = global.prisma;
}

// Function to connect to the database and ensure connection status
export const connectToDatabase = async () => {
  try {
    if (prisma.$isConnected) {
      console.log('Already connected to the database.');
      return prisma;
    }

    // Connect if not connected already
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
