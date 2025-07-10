import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { app } from '../../lib/firebaseClient';
import axios from 'axios';
import { formatDate } from '../../utils/firebase'; // or the correct path to your formatDate utility

const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};

const pageSize = 10;

export default function ProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(
      async (firebaseUser) => {
        setUser(firebaseUser);
        if (!firebaseUser) {
          router.replace('/login');
        } else {
          try {
            setLoading(true);
            const response = await axios.get('/api/products');
            setProducts(response.data);
          } catch (err) {
            setError('Failed to fetch products');
          } finally {
            setLoading(false);
          }
        }
      }
    );
    return () => unsubscribe();
  }, [router]);

  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, products.length);
  const productsToDisplay = products.slice(startIndex, endIndex);

  const changePage = (page) => {
    setCurrentPage(page);
    setLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
                Kelionės
              </h1>
              <p className='text-gray-600'>
                Valdykite visas savo keliones vienoje vietoje
              </p>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
              <div className='text-sm text-gray-500'>
                Iš viso:{' '}
                <span className='font-semibold text-gray-900'>
                  {products.length}
                </span>
              </div>
              <Link
                href='/products/new'
                className='w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-3 text-white font-medium transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
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
                Pridėti kelionę
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700'>
            {error}
          </div>
        )}

        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600'></div>
          </div>
        ) : products.length === 0 ? (
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
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-medium text-gray-900 mb-2'>
              Kelionių nėra
            </h3>
            <p className='text-gray-500 mb-6'>
              Pradėkite kurdami savo pirmą kelionę
            </p>
            <Link
              href='/products/new'
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
              Pridėti kelionę
            </Link>
          </div>
        ) : (
          <>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Kelionė
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Kaina
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Sukurta
                      </th>
                      <th className='px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Veiksmai
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {productsToDisplay.map((product, index) => (
                      <tr
                        key={product.id}
                        className='hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-12 w-12'>
                              <img
                                src={product.images?.[0] || '/product.png'}
                                alt={product.title}
                                className='h-12 w-12 rounded-xl object-cover'
                              />
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
                                {product.title}
                              </div>
                              <div className='text-sm text-gray-500'>
                                #{startIndex + index + 1}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            €{formatPrice(product.price)}
                          </div>
                          <div className='text-sm text-gray-500'>EUR</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {product.createdAt
                            ? formatDate(product.createdAt)
                            : '–'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex items-center justify-end gap-2'>
                            <Link href={`/products/edit/${product.id}`}>
                              <button className='inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors'>
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
                            <Link href={`/products/delete/${product.id}`}>
                              <button className='inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-8'>
                <button
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className='p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      i + 1 === currentPage
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    changePage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className='p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
