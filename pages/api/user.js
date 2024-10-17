import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  const { username } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        username: username
      }
    });
    
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'User creation failed' });
  }
}
