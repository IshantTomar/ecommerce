import config from '../config/config.js';

import ImageKit from '@imagekit/nodejs';

const ImageKitClient = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

async function uploadProductImage(file) {
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

export default uploadProductImage;
