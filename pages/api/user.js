import prisma from '../../lib/db';

export default async function handler(req, res) {
  // Check for the request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username } = req.body;

  // Validate username
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        username: username,
      },
    });

    res.status(201).json(newUser); // Use 201 for successful resource creation
  } catch (error) {
    console.error('Error creating user:', error); // Log error for debugging
    res.status(500).json({ error: 'User creation failed' });
  }
}
