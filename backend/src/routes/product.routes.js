import express from 'express';
import multer, { memoryStorage } from 'multer';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { uploadProduct } from '../controllers/product.controllers.js';

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.get('/product', authMiddleware, (req, res) => {
  res.json('Hallo!');
});

router.post(
  '/upload-product',
  authMiddleware,
  roleMiddleware('seller'),
  upload.single('productImage'),
  uploadProduct
);

export default router;
