import { uploadProductImage, deleteProductImage } from '../services/storage.service.js';
import Product from '../models/Product.model.js';

export async function uploadProduct(req, res) {
  try {
    const { name, description, price, category, stock } = req.body;

    const productImage = req.file;
    const result = await uploadProductImage(productImage);

    const product = new Product({
      userId: req.user.id,
      name,
      description,
      price,
      category,
      stock,
      imageUrl: result.url,
      imageThumbnailUrl: result.thumbnailUrl,
      imageFileId: result.fileId,
    });

    const savedProduct = await product.save();
    await savedProduct.populate('userId', 'username');

    return res.status(201).json({
      success: true,
      message: 'Product uploaded successfully!',
      product: savedProduct,
    });
  } catch (err) {
    console.error('error in uploadProduct controller', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find().populate('userId', 'username');
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('error in getAllProducts controller', err);
    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id).select('+imageFileId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await deleteProductImage(product.imageFileId);
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    console.error('error in deleteProduct controller', err);
    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function getAllUserProducts(req, res) {
  try {
    const products = await Product.find(req.user._id).populate('userId', 'username');
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('error in getAllUserProducts controller', err);
    return res.status(500).json({ message: 'internal server error' });
  }
}
