import config from '../config/config.js';

import ImageKit from '@imagekit/nodejs';

const ImageKitClient = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadProductImage(file) {
  try {
    const result = await ImageKitClient.files.upload({
      file: file.buffer.toString('base64'),
      fileName: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
      folder: 'E-Commerce/products',
    });

    return result;
  } catch (err) {
    console.error('error in storage.service.js', err);
  }
}

export async function deleteProductImage(fileId) {
  try {
    await ImageKitClient.files.delete(fileId);
  } catch (err) {
    if (err?.code === 404) {
      console.warn('Image already deleted or not found');
    } else {
      console.error('Error deleting image:', err);
      throw err;
    }
  }
}
