import prisma from '../../lib/db'; // Adjust the import path as necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, username } = req.body;

    try {
      const user = await prisma.user.upsert({
        where: { user_id: userId },
        update: {}, // No updates necessary since we want to do nothing on conflict
        create: { user_id: userId, username: username },
      });
      return res.status(201).json({ message: 'User added or already exists.', user });
    } catch (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
