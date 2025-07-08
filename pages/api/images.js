import { mongooseConnect } from '../../lib/mongoose';
import { Media } from '../../models/Media';

export default async function handle(req, res) {
  await mongooseConnect();

  try {
    if (req.method === 'POST') {
      const { name, description, images, firstBanner, secondBanner, route } =
        req.body;

      const imageUrls = Array.isArray(images) ? images : [];

      const mediaDoc = await Media.create({
        name,
        description,
        images: imageUrls,
        firstBanner,
        secondBanner,
        route,
      });
      res.json(mediaDoc);
    } else if (req.method === 'GET') {
      if (req.query?.id) {
        const media = await Media.findOne({ _id: req.query.id });
        res.json(media);
      } else {
        const categories = await Media.find();
        res.json(categories);
      }
    } else if (req.method === 'PUT') {
      const {
        name,
        description,
        _id,
        images,
        firstBanner,
        secondBanner,
        route,
      } = req.body;

      const imageUrls = Array.isArray(images) ? images : [];

      const mediaDoc = await Media.findOneAndUpdate(
        { _id },
        {
          name,
          description,
          images: imageUrls,
          firstBanner,
          secondBanner,
          route,
        },
        { new: true }
      );
      res.json(mediaDoc);
    } else if (req.method === 'DELETE') {
      const { _id } = req.query;
      await Media.deleteOne({ _id });
      res.json({ message: 'Media deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
