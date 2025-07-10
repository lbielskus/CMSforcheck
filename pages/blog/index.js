import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient'; // adjust path if needed

const Blog = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        axios.get('/api/blog').then((response) => {
          setPosts(response.data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                  Straipsniai
                </h1>
                <p className='text-gray-600'>
                  Valdykite visus savo straipsnius vienoje vietoje
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-sm text-gray-500'>
                  Iš viso:{' '}
                  <span className='font-semibold text-gray-900'>
                    {posts.length}
                  </span>
                </div>
                <Link
                  href='/blog/new'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white font-medium transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 4.5v15m7.5-7.5h-15'
                    />
                  </svg>
                  Sukurti straipsnį
                </Link>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className='flex items-center justify-center py-20'>
              <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600'></div>
            </div>
          ) : posts.length === 0 ? (
            <div className='text-center py-20'>
              <div className='mb-6'>
                <svg
                  className='mx-auto h-24 w-24 text-gray-300'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-medium text-gray-900 mb-2'>
                Straipsnių nėra
              </h3>
              <p className='text-gray-500 mb-6'>
                Pradėkite kurdami savo pirmą straipsnį
              </p>
              <Link
                href='/blog/new'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white font-medium transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 4.5v15m7.5-7.5h-15'
                  />
                </svg>
                Sukurti straipsnį
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.map((post) => (
                <div
                  key={post._id}
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]'
                >
                  {/* Image placeholder */}
                  <div className='h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center'>
                    {post.images && post.images.length > 0 ? (
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <svg
                        className='w-16 h-16 text-purple-300'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                        />
                      </svg>
                    )}
                  </div>

                  <div className='p-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='inline-block px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full'>
                        {post.category || 'Bendras'}
                      </span>
                      <time className='text-xs text-gray-500'>
                        {post.createdAt}
                      </time>
                    </div>

                    <h3 className='font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]'>
                      {post.title}
                    </h3>

                    <p className='text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]'>
                      {post.excerpt || 'Straipsnio aprašymas nepateiktas...'}
                    </p>

                    <div className='flex items-center gap-2'>
                      <Link href={`/blog/edit/${post._id}`}>
                        <button className='flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors'>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            />
                          </svg>
                          Redaguoti
                        </button>
                      </Link>
                      <Link href={`/blog/delete/${post._id}`}>
                        <button className='flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors'>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                          Ištrinti
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
