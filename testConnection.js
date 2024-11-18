import supabase from '../lib/db.js';

async function main() {
  try {
    const { data, error } = await supabase.from('User').select('*');
    if (error) throw error;
    console.log('Connected to the database successfully:', data);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

main();
