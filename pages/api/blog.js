import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getApp, getApps, cert, initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const snapshot = await db
        .collection('blog')
        .orderBy('createdAt', 'desc')
        .get();
      const posts = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, excerpt, ...rest } = req.body;
      if (!title || !content) {
        return res
          .status(400)
          .json({ message: 'Title and content are required' });
      }
      const docRef = await db.collection('blog').add({
        title,
        content,
        excerpt: excerpt || '',
        createdAt: Timestamp.now(),
        ...rest,
      });
      res
        .status(201)
        .json({ _id: docRef.id, title, content, excerpt, ...rest });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
