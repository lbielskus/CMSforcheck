// firebase/firestore.ts
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app, db as firestore } from './init';

const getBlogs = async () => {
  const blogsRef = collection(firestore, 'blogs');
  const querySnapshot = await getDocs(blogsRef);
  const blogs = querySnapshot.docs.map((doc) => doc.data());
  return blogs;
};
