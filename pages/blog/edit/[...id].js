import BlogEnhanced from '../../../components/BlogEnhanced';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../lib/firebaseClient';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        router.replace('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!id || !user) {
      return;
    }
    axios
      .get('/api/blog?id=' + id)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error('Error fetching blog post:', error);
        router.push('/blogs');
      });
  }, [id, user, router]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {post && (
        <BlogEnhanced
          _id={post._id}
          title={post.title}
          content={post.content}
          category={post.category}
          images={post.images}
          createdAt={post.createdAt}
          excerpt={post.excerpt}
        />
      )}
    </div>
  );
}
