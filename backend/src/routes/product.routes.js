import express from 'express';
import multer, { memoryStorage } from 'multer';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import {
  getAllProducts,
  uploadProduct,
  deleteProduct,
} from '../controllers/product.controllers.js';

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.get('/products', authMiddleware, getAllProducts);

router.post(
  '/upload-product',
  authMiddleware,
  roleMiddleware('seller'),
  upload.single('productImage'),
  uploadProduct
);

router.post('/delete-product/:id', authMiddleware, roleMiddleware('seller'), deleteProduct);

export default router;
