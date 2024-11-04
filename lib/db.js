import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.NEON_DB_URL, // your Neon DB URL from Vercel
  ssl: {
    rejectUnauthorized: false, // adjust based on your needs
  },
});

export const connectToDatabase = async () => {
  if (!client._connected) {
    await client.connect();
  }
  return client;
};
