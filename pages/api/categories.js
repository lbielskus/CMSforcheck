import { adminDb } from '../../lib/firebaseAdmin';

export default async function handle(req, res) {
  const categoriesRef = adminDb.collection('categories');

  try {
    if (req.method === 'POST') {
      const { name, parentCategoryId, images, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const docRef = await categoriesRef.add({
        name,
        parent: parentCategoryId || null,
        images: Array.isArray(images) ? images : [],
        description,
        createdAt: new Date().toISOString(),
      });
      const newDoc = await docRef.get();
      res.json({ id: docRef.id, ...newDoc.data() });
    } else if (req.method === 'GET') {
      if (req.query?.id) {
        const doc = await categoriesRef.doc(req.query.id).get();
        if (!doc.exists) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
      } else {
        const snapshot = await categoriesRef.get();
        const categories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.json(categories);
      }
    } else if (req.method === 'PUT') {
      const { name, parentCategoryId, _id, images, description } = req.body;
      if (!_id) {
        return res.status(400).json({ error: 'Missing _id' });
      }
      await categoriesRef.doc(_id).update({
        name,
        parent: parentCategoryId || null,
        images: Array.isArray(images) ? images : [],
        description,
        updatedAt: new Date().toISOString(),
      });
      const updatedDoc = await categoriesRef.doc(_id).get();
      res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } else if (req.method === 'DELETE') {
      const { _id } = req.query;
      if (!_id) {
        return res.status(400).json({ error: 'Missing _id' });
      }
      await categoriesRef.doc(_id).delete();
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
