import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, username, first_name } = req.body;

    // Upsert user data into the database
    await prisma.user.upsert({
      where: { user_id: String(id) },
      update: { username, first_name },
      create: { user_id: String(id), username, first_name },
    });

    return res.status(201).json({ message: 'User created/updated' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
