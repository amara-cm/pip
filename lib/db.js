import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PINXSB_SUPABASE_URL;
const supabaseKey = process.env.PINXSB_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const connectToDatabase = async () => {
  try {
    const { data, error } = await supabase.from('User').select('*'); // Example query to test connection
    if (error) throw error;
    console.log('Connected to the database successfully:', data);
    return supabase;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Could not connect to the database.');
  }
};

export default supabase;
