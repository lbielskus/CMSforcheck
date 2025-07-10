import { adminDb } from '../../lib/firebaseAdmin';

export default async function handle(req, res) {
  const productsRef = adminDb.collection('products');
  const { method } = req;

  try {
    if (method === 'POST') {
      const {
        title,
        description,
        price,
        images,
        category,
        details,
        brand,
        gender,
        sizes,
        colors,
        // New travel-specific fields
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice,
        excludedinprice,
        rating,
        reviewCount,
        dayamount,
        travelDays,
      } = req.body;

      if (!title || !description || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const docRef = await productsRef.add({
        title,
        description,
        price,
        images,
        category,
        details,
        brand,
        gender,
        sizes,
        colors,
        // New travel-specific fields
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice: includedinprice || [],
        excludedinprice: excludedinprice || [],
        rating,
        reviewCount,
        dayamount,
        travelDays: travelDays || [],
        createdAt: new Date().toISOString(),
      });

      const newDoc = await docRef.get();
      res.json({ id: docRef.id, ...newDoc.data() });
    } else if (method === 'GET') {
      if (req.query?.id) {
        const doc = await productsRef.doc(req.query.id).get();
        if (!doc.exists) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
      } else {
        const snapshot = await productsRef.get();
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.json(products);
      }
    } else if (method === 'PUT') {
      const {
        title,
        description,
        price,
        _id,
        images,
        category,
        details,
        brand,
        gender,
        sizes,
        colors,
        // New travel-specific fields
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice,
        excludedinprice,
        rating,
        reviewCount,
        dayamount,
        travelDays,
      } = req.body;

      if (!_id) {
        return res.status(400).json({ error: 'Missing _id' });
      }

      await productsRef.doc(_id).update({
        title,
        description,
        price,
        images,
        category,
        details,
        brand,
        gender,
        sizes,
        colors,
        // New travel-specific fields
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice: includedinprice || [],
        excludedinprice: excludedinprice || [],
        rating,
        reviewCount,
        dayamount,
        travelDays: travelDays || [],
        updatedAt: new Date().toISOString(),
      });

      const updatedDoc = await productsRef.doc(_id).get();
      res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } else if (method === 'DELETE') {
      if (req.query?.id) {
        await productsRef.doc(req.query.id).delete();
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Missing id' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
