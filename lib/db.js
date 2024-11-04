import { Client } from 'pg';

// Use the connection string from your environment variables
const connectionString = process.env.PINK_URL;

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true, // adjust based on your needs
  },
});

export const connectToDatabase = async () => {
  if (!client._connected) {
    try {
      await client.connect();
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Could not connect to the database.');
    }
  }
  return client;
};
