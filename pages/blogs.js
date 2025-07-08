import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Blog = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      axios.get('/api/blogcr').then((response) => {
        setPosts(response.data);
        setLoading(false);
      });
    }
  }, [session]);

  if (!session) {
    return null;
  }

  if (session) {
    return (
      <div className={`mx-auto px-4 py-8  `}>
        <h1 className='text-3xl font-bold text-gray-600 mb-6'>
          All Blog Posts
        </h1>
        <div className='grid grid-cols-1 gap-4'>
          {loading ? (
            <p>Loading...</p>
          ) : posts.length === 0 ? (
            <p>No blog posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className='border p-4 rounded shadow-md'>
                <h2 className='text-xl font-semibold text-gray-700'>
                  {post.title}
                </h2>
                <p className='text-gray-600 mb-2'>
                  Published on {post.createdAt}
                </p>
                <p className='text-gray-700'>{post.excerpt}</p>
                <div className='mt-4'>
                  <Link href={`/blog/edit/${post._id}`} legacyBehavior>
                    <a className='text-green-600 mr-2'>Edit</a>
                  </Link>
                  <Link href={`/blog/delete/${post._id}`} legacyBehavior>
                    <a className='text-red-600'>Delete</a>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className='mt-6 mb-44'>
          <Link
            href={'/blog/new'}
            className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-green-600 px-5 py-3 text-green-600 transition hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring'
            type='button'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='text-sm font-medium'> Add Post </span>
          </Link>
        </div>
      </div>
    );
  }
};

export default Blog;
