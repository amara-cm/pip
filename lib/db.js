import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Could not connect to the database.');
  }
  return prisma;
};

export default prisma;
