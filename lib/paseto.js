import { V4 } from 'paseto';
import dotenv from 'dotenv';

dotenv.config();

const { PASETO_SECRET } = process.env;

export const generateToken = async (userId, exp = '30m') => {
  const payload = {
    userId,
    exp: new Date(Date.now() + parseExpiry(exp)).toISOString()
  };
  const token = await V4.sign(payload, PASETO_SECRET);
  return token;
};

export const validateToken = async (token) => {
  try {
    const payload = await V4.verify(token, PASETO_SECRET);
    const expiryDate = new Date(payload.exp);
    if (Date.now() > expiryDate) {
      throw new Error('Token expired');
    }
    return payload.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const refreshToken = async (userId, currentToken) => {
  try {
    const payload = await validateToken(currentToken);
    if (payload.userId !== userId) throw new Error('Invalid token');
    return await generateToken(userId);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const parseExpiry = (exp) => {
  const match = exp.match(/^(\\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid expiry format');
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error('Invalid time unit');
  }
};
