import { Timestamp } from 'firebase/firestore';

/**
 * Converts Firebase Timestamp to JavaScript Date
 */
export const convertFirebaseTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
  if (typeof timestamp === 'string' || typeof timestamp === 'number')
    return new Date(timestamp);
  return null;
};

/**
 * Formats a date for display
 */
export const formatDate = (date) => {
  const d = convertFirebaseTimestamp(date);
  if (!d || isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Processes a Firestore document snapshot
 */
export const processFirebaseDocument = (doc) => {
  if (!doc.exists()) return null;
  const data = doc.data();
  const processed = { id: doc.id };
  Object.keys(data).forEach((key) => {
    if (key.match(/At|Date|Time/i)) {
      processed[key] = convertFirebaseTimestamp(data[key]);
    } else {
      processed[key] = data[key];
    }
  });
  return processed;
};

/**
 * Processes a Firestore query snapshot
 */
export const processFirebaseCollection = (querySnapshot) => {
  return querySnapshot.docs.map((doc) => processFirebaseDocument(doc));
};
