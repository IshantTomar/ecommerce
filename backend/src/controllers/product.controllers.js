import uploadProductImage from '../services/storage.service.js';
import Product from '../models/Product.model.js';

export async function uploadProduct(req, res) {
  try {
    const { name, description, price, category, stock } = req.body;

    const productImage = req.file;

    const result = await uploadProductImage(productImage);

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl: result.url,
      imageThumbnailUrl: result.thumbnailUrl,
      imageFileName: result.name,
    });

    const savedProduct = await product.save();

    return res.status(201).json(savedProduct);
  } catch (err) {
    console.error('error in uploadProduct controller', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal server error' });
  }
}
