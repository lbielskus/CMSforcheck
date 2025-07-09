import { adminDb } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  try {
    const ordersRef = adminDb.collection('orders');
    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(orders);
  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
