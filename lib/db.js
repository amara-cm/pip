import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Initialize Prisma client for Neon PostgreSQL
const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.PINXSB_SUPABASE_URL; // Get from environment variables
const supabaseKey = process.env.PINXSB_NEXT_PUBLIC_SUPABASE_ANON_KEY; // Get from environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

// Connect to the Neon PostgreSQL database (Prisma)
export const connectToNeonDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the Neon PostgreSQL database.');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Could not connect to the Neon PostgreSQL database.');
  }
  return prisma;
};

// Example function to connect to Supabase (if you need to use Supabase for some tasks)
export const connectToSupabase = () => {
  try {
    console.log('Connected to Supabase.');
    return supabase;
  } catch (error) {
    console.error('Supabase connection error:', error);
    throw new Error('Could not connect to Supabase.');
  }
};

// Export Prisma client (Neon PostgreSQL)
export default prisma;
