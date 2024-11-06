// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.PINXSB_SUPABASE_URL; // Get from environment variables
const supabaseKey = process.env.PINXSB_NEXT_PUBLIC_SUPABASE_ANON_KEY; // Get from environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the supabase client as the default export
export default supabase;
