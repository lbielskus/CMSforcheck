import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import { adminDb } from '../../lib/firebaseAdmin';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const links = [];
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const fileList = files[key];
        for (const file of fileList) {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: 'ecommerce-app',
            public_id: `file_${Date.now()}`,
            resource_type: 'auto',
          });
          links.push(result.secure_url);
        }
      }
    }

    // Save media metadata to Firestore
    await adminDb.collection('media').add({
      title: fields.title ? fields.title[0] : '',
      description: fields.description ? fields.description[0] : '',
      urls: links,
      createdAt: new Date().toISOString(),
    });

    return res.json({ links });
  } catch (error) {
    console.error('Error uploading media:', error);
    return res.status(500).json({ error: 'Error uploading media' });
  }
}
