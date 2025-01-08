import jwt from 'jsonwebtoken';
import { User } from './auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '12h';

export const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as User);
    });
  });
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
