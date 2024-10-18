import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process if connection fails
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});

connectDatabase();

export default prisma;
