import { adminDb } from '../../lib/firebaseAdmin';

export default async function handle(req, res) {
  const mediaRef = adminDb.collection('media');

  try {
    if (req.method === 'POST') {
      const { name, description, images, firstBanner, secondBanner, route } =
        req.body;
      const docRef = await mediaRef.add({
        name,
        description,
        images: Array.isArray(images) ? images : [],
        firstBanner,
        secondBanner,
        route,
        createdAt: new Date(),
      });
      const newDoc = await docRef.get();
      res.json({ id: docRef.id, ...newDoc.data() });
    } else if (req.method === 'GET') {
      if (req.query?.id) {
        const doc = await mediaRef.doc(req.query.id).get();
        if (!doc.exists) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
      } else {
        const snapshot = await mediaRef.get();
        const media = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.json(media);
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
      await mediaRef.doc(_id).update({
        name,
        description,
        images: Array.isArray(images) ? images : [],
        firstBanner,
        secondBanner,
        route,
        updatedAt: new Date(),
      });
      const updatedDoc = await mediaRef.doc(_id).get();
      res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } else if (req.method === 'DELETE') {
      const { _id } = req.query;
      await mediaRef.doc(_id).delete();
      res.json({ message: 'Media deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
