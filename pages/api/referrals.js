import prisma from '../../lib/db';
import react, { useState } from 'react';
import './global.css';

const friends = [
  { id: 1, name: 'Friend 1', username: '@friend1' },
  { id: 2, name: 'Friend 2', username: '@friend2' },
  // Add more friends...
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { inviterId, inviteeId } = req.body;

  if (!inviterId || !inviteeId) {
    return res.status(400).json({ error: 'Inviter ID and Invitee ID are required' });
  }

  try {
    const inviter = await prisma.user.findUnique({ where: { telegramId: inviterId } });
    if (!inviter) return res.status(404).json({ error: 'Inviter not found' });

    const invitee = await prisma.user.create({
      data: { telegramId: inviteeId, username: 'InviteeUsername' }
    });

    await prisma.user.update({
      where: { telegramId: inviterId },
      data: { referrals: inviter.referrals + 1, points: inviter.points + 1000 },
    });

    res.status(200).json({ success: true, referralId: invitee.telegramId });
  } catch (error) {
    console.error('Error in referrals.js:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

const Friends = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inviteLink, setInviteLink] = useState('');

  const handleInvite = () => {
    // Generate unique invite link
  };

  const handleCopyLink = () => {
    // Copy invite link to clipboard
  };
};
