import { mongooseConnect } from '../../lib/mongoose';
import { Category } from '../../models/Category';

export default async function handle(req, res) {
  await mongooseConnect();

  try {
    if (req.method === 'POST') {
      const { name, parentCategoryId, images, description } = req.body;

      const imageUrls = Array.isArray(images) ? images : [];

      const categoryDoc = await Category.create({
        name,
        parent: parentCategoryId || null,
        images: imageUrls,
        description,
      });
      res.json(categoryDoc);
    } else if (req.method === 'GET') {
      if (req.query?.id) {
        const category = await Category.findOne({ _id: req.query.id }).populate(
          'parent'
        );
        res.json(category);
      } else {
        const categories = await Category.find().populate('parent');
        res.json(categories);
      }
    } else if (req.method === 'PUT') {
      const { name, parentCategoryId, _id, images, description } = req.body;

      const imageUrls = Array.isArray(images) ? images : [];

      const categoryDoc = await Category.findOneAndUpdate(
        { _id },
        {
          name,
          parent: parentCategoryId || null,
          images: imageUrls,
          description,
        },
        { new: true }
      );
      res.json(categoryDoc);
    } else if (req.method === 'DELETE') {
      const { _id } = req.query;
      await Category.deleteOne({ _id });
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
