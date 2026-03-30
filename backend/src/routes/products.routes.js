import { authMiddleware } from '../middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/products', authMiddleware, (req, res) => {
  res.json('Hallo!');
});

export default router;
