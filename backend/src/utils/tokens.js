import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';

export function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, config.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
