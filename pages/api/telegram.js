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

        return res.status(201).json({ message: 'User created/updated', userId: String(id) });
    }

    if (req.method === 'GET') {
        const { id } = req.query;

        const user = await prisma.user.findUnique({
            where: { user_id: String(id) },
        });

        if (user) {
            return res.status(200).json({ userId: user.user_id, username: user.username, firstName: user.first_name });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
