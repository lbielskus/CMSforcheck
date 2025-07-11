import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getApp, getApps, cert, initializeApp } from 'firebase-admin/app';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      if (req.query?.id) {
        // Return a single post by ID
        const doc = await db.collection('blog').doc(req.query.id).get();
        if (!doc.exists) {
          return res.status(404).json({ message: 'Not found' });
        }
        const data = doc.data();
        // Convert Firestore Timestamps to ISO strings
        Object.keys(data).forEach((key) => {
          if (
            data[key] &&
            typeof data[key] === 'object' &&
            '_seconds' in data[key] &&
            '_nanoseconds' in data[key]
          ) {
            data[key] = new Date(data[key]._seconds * 1000).toISOString();
          }
        });
        return res.status(200).json({ _id: doc.id, ...data });
      }
      // Return all posts
      const snapshot = await db
        .collection('blog')
        .orderBy('createdAt', 'desc')
        .get();
      const posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert all Firestore Timestamp fields to ISO strings
        Object.keys(data).forEach((key) => {
          if (
            data[key] &&
            typeof data[key] === 'object' &&
            '_seconds' in data[key] &&
            '_nanoseconds' in data[key]
          ) {
            data[key] = new Date(data[key]._seconds * 1000).toISOString();
          }
        });
        return {
          _id: doc.id,
          ...data,
        };
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, excerpt, images, createdAt, category, ...rest } =
        req.body;
      if (!title || !content) {
        return res
          .status(400)
          .json({ message: 'Title and content are required' });
      }

      // Handle creation date - use provided date or current date
      let blogCreatedAt;
      if (createdAt) {
        blogCreatedAt = Timestamp.fromDate(new Date(createdAt));
      } else {
        blogCreatedAt = Timestamp.now();
      }

      const docRef = await db.collection('blog').add({
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        images: images || [],
        category: category || '',
        createdAt: blogCreatedAt,
        updatedAt: Timestamp.now(),
        ...rest,
      });

      res.status(201).json({
        _id: docRef.id,
        title,
        content,
        excerpt,
        images: images || [],
        category,
        createdAt: blogCreatedAt.toDate().toISOString(),
        ...rest,
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        _id,
        title,
        content,
        excerpt,
        images,
        createdAt,
        category,
        ...rest
      } = req.body;
      if (!_id) {
        return res.status(400).json({ message: 'Missing blog post ID' });
      }
      if (!title || !content) {
        return res
          .status(400)
          .json({ message: 'Title and content are required' });
      }

      // Handle creation date - use provided date or keep existing
      let blogCreatedAt;
      if (createdAt) {
        blogCreatedAt = Timestamp.fromDate(new Date(createdAt));
      } else {
        // Keep existing createdAt if not provided
        const existingDoc = await db.collection('blog').doc(_id).get();
        blogCreatedAt = existingDoc.data()?.createdAt || Timestamp.now();
      }

      await db
        .collection('blog')
        .doc(_id)
        .update({
          title,
          content,
          excerpt: excerpt || content.substring(0, 200) + '...',
          images: images || [],
          category: category || '',
          createdAt: blogCreatedAt,
          updatedAt: Timestamp.now(),
          ...rest,
        });

      res.status(200).json({
        _id,
        title,
        content,
        excerpt,
        images: images || [],
        category,
        createdAt: blogCreatedAt.toDate().toISOString(),
        message: 'Blog updated successfully',
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'Missing id' });
      }
      // Fetch the blog post to get its images
      const doc = await db.collection('blog').doc(id).get();
      const data = doc.data();
      const images = data?.images || [];
      // Delete images from Cloudinary
      for (const imageUrl of images) {
        if (
          typeof imageUrl === 'string' &&
          imageUrl.includes('cloudinary.com')
        ) {
          // Extract public_id from the URL
          const matches = imageUrl.match(/ecommerce-app\/([^./]+)\./);
          const publicId = matches ? `ecommerce-app/${matches[1]}` : null;
          if (publicId) {
            try {
              await cloudinary.v2.uploader.destroy(publicId);
            } catch (err) {
              console.error('Cloudinary delete error:', err);
            }
          }
        }
      }
      await db.collection('blog').doc(id).delete();
      res.status(200).json({ message: 'Blog deleted' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
