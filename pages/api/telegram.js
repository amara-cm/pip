import prisma from '../../lib/db';

export default async function handler(req, res) {
    console.log(`Received ${req.method} request on /api/telegram`);

    if (req.method === 'POST') {
        const { id, username, first_name } = req.body;
        console.log('POST body:', req.body);

        // Upsert user data into the database
        try {
            await prisma.user.upsert({
                where: { user_id: String(id) },
                update: { username, first_name },
                create: { user_id: String(id), username, first_name },
            });

            return res.status(201).json({ message: 'User created/updated', userId: String(id) });
        } catch (error) {
            console.error('Error upserting user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'GET') {
        const { id } = req.query;
        console.log('GET query:', req.query);

        try {
            const user = await prisma.user.findUnique({
                where: { user_id: String(id) },
            });

            if (user) {
                return res.status(200).json({ userId: user.user_id, username: user.username, firstName: user.first_name });
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error finding user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
}
