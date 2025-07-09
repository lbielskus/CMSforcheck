import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '../../lib/firebaseAdmin';

// Helper to verify Firebase ID token
async function verifyFirebaseToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : null;
  if (!token) return null;
  try {
    return await getAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const user = await verifyFirebaseToken(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Example: Access Firestore as authenticated user
  // const userDoc = await adminDb.collection('users').doc(user.uid).get();

  res.status(200).json({
    message: 'You are authenticated!',
    uid: user.uid,
    email: user.email,
    // userDoc: userDoc.exists ? userDoc.data() : null,
  });
}
