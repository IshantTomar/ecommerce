import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized, you must be logged in to access this resource.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error('error in authMiddleware', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
