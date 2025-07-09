import { getAuth } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import img1 from '../../public/product.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { app } from '../../lib/firebaseClient'; // adjust path if needed

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const pageSize = 10;

export default function ProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      axios.get('/api/products').then((response) => {
        setProducts(response.data);
        setLoading(false);
      });
    }
  }, [user]);

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

  console.log('Product import:', ProductsPage);

  return (
    <>
      <header className='max-w-[900px] ml-24'>
        <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 max-md:flex-col'>
          <div className='text-center sm:text-center'>
            <h1 className='text-xl font-bold text-gray-600 sm:text-xl'>
              Visos kelionės
            </h1>
            <p className='mt-1.5 text-sm text-gray-500'>
              Sukurkite naują kelionę!
            </p>
            <Link
              href={'/products/new'}
              className='mt-6 inline-flex items-center justify-center gap-1.5 rounded-lg border border-green-600 px-5 py-3 text-green-600 transition hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring'
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
              <span className='text-sm font-medium'> Pridėti kelionę </span>
            </Link>
          </div>
          <div className='sm:flex sm:items-center sm:justify-between'>
            <div className='mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center max-w-md'></div>
          </div>
          <hr className='my-8 h-px border-0 bg-gray-300' />
        </div>
      </header>

      <div className={`overflow-x-auto mx-auto px-4 ml-24`}>
        {products.length === 0 ? (
          <p className='w-full text-center'>Nėra sukurtų kelionių.</p>
        ) : (
          <>
            <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm border rounded mb-44'>
              <thead>
                <tr>
                  <th>Nr.</th>
                  <th>Pavadinimas</th>
                  <th>Kaina</th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {productsToDisplay.map((product, index) => (
                  <tr key={product._id}>
                    <td className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='whitespace-nowrap px-4 py-2 font-medium text-gray-900 flex items-center  gap-1'>
                      <div className='h-10 w-10'>
                        <Image
                          src={product.images?.[0] || img1}
                          alt={product.title}
                          width={100}
                          height={100}
                          className='rounded-full object-cover object-center bg-gray-200'
                        />
                      </div>
                      {product.title}
                    </td>
                    <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                      € {formatPrice(product.price)}
                    </td>
                    <td className='whitespace-nowrap px-4 py-2 gap-4 flex'>
                      <Link
                        href={'/products/edit/' + product._id}
                        className='inline-block rounded bg-green-500 px-4 py-2 text-xs font-medium text-white hover:bg-green-700'
                      >
                        Redaguoti
                      </Link>
                      <Link
                        href={'/products/delete/' + product._id}
                        className='inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700'
                      >
                        Ištrinti
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center mt-4'>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`mx-2 px-3 py-2 rounded ${
                      i + 1 === currentPage
                        ? 'bg-blue-300 text-slate-900'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
