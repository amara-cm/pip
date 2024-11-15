import { PrismaClient } from '@prisma/client';

// Declare the Prisma instance at the module level to preserve the instance
let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production, reuse the existing Prisma Client instance to avoid creating a new one on every function call
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PINXSB_POSTGRES_PRISMA_URL,  // Using Supabase connection URL from your .env file
      },
    },
    log: ['query', 'info', 'warn', 'error'], // Enable detailed logging in production
  });
} else {
  // In development, use a global variable to preserve the Prisma Client instance across hot reloading
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PINXSB_POSTGRES_PRISMA_URL,  // Supabase connection URL
        },
      },
      log: ['query', 'info', 'warn', 'error'], // Enable detailed logging in development
    });
  }
  prisma = global.prisma;
}

// Function to connect to the database (if necessary)
export const connectToDatabase = async () => {
  try {
    // Prisma Client in serverless or development mode handles connection pooling internally
    if (prisma.$connect) {
      await prisma.$connect();
      console.log('Connected to the database.');
    } else {
      console.log('Using existing Prisma connection.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Could not connect to the database.');
  }
  return prisma;
};

// Export Prisma client for use in other parts of your application
export default prisma;
