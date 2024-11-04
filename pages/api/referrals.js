// pages/api/referrals.js
import { connectDB } from '../../lib/db';

export default async function handler(req, res) {
  const client = await connectDB();

  if (req.method === 'POST') {
    const { inviterId, inviteeId } = req.body;

    try {
      // Logic for handling referrals
      await client.query(
        'INSERT INTO referrals (inviter_id, invitee_id) VALUES ($1, $2)',
        [inviterId, inviteeId]
      );
      return res.status(200).json({ success: true, message: 'Referral recorded.' });
    } catch (error) {
      console.error('Error recording referral:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
