import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [3, 'Product name must be between 3 to 50 characters'],
      maxlength: [50, 'Product name must be between 3 to 50 characters'],
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
      required: [true, 'Product category is required'],
      enum: {
        values: ['electronics', 'fashion', 'food', 'others'],
        message: 'Product category must be either electronics, fashion, food or others',
      },
    },
    stock: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image url is required'],
    },
    imageThumbnailUrl: {
      type: String,
      required: [true, 'Product image thumbnailUrl is required'],
    },
    imageFileId: {
      type: String,
      select: false,
      required: [true, 'Product image file id is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.imageFileId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
