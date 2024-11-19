import { V4 } from 'paseto';
import dotenv from 'dotenv';
import { types } from 'util';

dotenv.config();

const { PASETO_SECRET } = process.env;

export const generateToken = async (userId) => {
  const token = await V4.sign({ userId, exp: '30m' }, PASETO_SECRET);
  return token;
};

export const validateToken = async (token) => {
  try {
    const { payload } = await V4.verify(token, PASETO_SECRET);
    if (Date.now() > new Date(payload.exp)) {
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
