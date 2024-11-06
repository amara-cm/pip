import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.PINXSB_SUPABASE_URL; // Get from environment variables
const supabaseKey = process.env.PINXSB_NEXT_PUBLIC_SUPABASE_ANON_KEY; // Get from environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

export const connectToSupabase = () => {
  try {
    console.log('Connected to Supabase.');
    return supabase;
  } catch (error) {
    console.error('Supabase connection error:', error);
    throw new Error('Could not connect to Supabase.');
  }
};

export default supabase;
