import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [3, 'Product name must be between 3 to 50 characters'],
      maxlength: [50, 'username must be between 3 to 50 characters'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
    },

    category: {
      type: String,
      required: [true, 'Product catergory is required'],
      enum: {
        values: ['electronics', 'fashion', 'food'],
        message: 'Product category must be either electronics, fashion or food',
      },
    },

    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      default: 0,
    },

    imageUrl: {
      type: String,
      required: [true, 'Product images url is required'],
    },
    imageThumbnailUrl: {
      type: String,
      required: [true, 'Product images thumbnailUrl is required'],
    },
    imageFileName: {
      type: String,
      required: [true, 'Product images filename is required'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
