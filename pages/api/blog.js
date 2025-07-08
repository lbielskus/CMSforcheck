import { mongooseConnect } from '../../lib/mongoose';
import BlogPost from '../../models/Blog';

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'POST') {
    const { title, content, category } = req.body;

    const blogDoc = await BlogPost.create({
      title,
      content,
      category,
    });

    res.json(blogDoc);
  }

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await BlogPost.findOne({ _id: req.query.id }));
    } else {
      res.json(await BlogPost.find());
    }
  }

  if (method === 'PUT') {
    const { title, content, _id, category } = req.body;
    await BlogPost.updateOne(
      { _id },
      {
        title,
        content,
        category,
      }
    );
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await BlogPost.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
