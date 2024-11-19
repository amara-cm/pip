import { createToken, validateToken } from 'paseto';
import dotenv from 'dotenv';

dotenv.config();

const { PASETO_SECRET } = process.env;

export const generateToken = async (userId, exp = '30m') => {
  const token = await V4.sign({ userId, exp }, PASETO_SECRET);
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
