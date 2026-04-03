import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';

export function generateAccessToken(userId, role) {
  return jwt.sign({ id: userId, role }, config.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId, role) {
  return jwt.sign({ id: userId, role }, config.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
