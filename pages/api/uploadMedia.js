import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import { mongooseConnect } from '../../lib/mongoose';
import Media from '../../models/Media';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  await mongooseConnect();

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

    const newMedia = new Media({
      title: fields.title[0],
      description: fields.description[0],
      url: links,
    });
    await newMedia.save();

    return res.json({ links });
  } catch (error) {
    console.error('Error uploading media:', error);

    return res.status(500).json({ error: 'Error uploading media' });
  }
}

export const config = {
  api: { bodyParser: false },
};
