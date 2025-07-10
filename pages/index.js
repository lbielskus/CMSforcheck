import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';

import { FiBox, FiExternalLink } from 'react-icons/fi';
import { RiArticleLine, RiImageLine, RiFolderLine } from 'react-icons/ri';
import { app } from '../lib/firebaseClient'; // adjust path if needed

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const totalImagesCount = products.reduce(
    (total, product) => total + (product.images?.length || 0),
    0
  );
  const totalPrice = products.reduce(
    (total, product) => total + (product.price || 0),
    0
  );

  if (user) {
    return (
      <>
        <main className='min-h-screen'>
          <header>
            <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='text-center sm:text-left'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-gray-700'>
                    Sveiki,
                    <span className='text-purple-800 font-bold block mt-2'>
                      {user.displayName || user.email || ''}
                    </span>
                  </h1>
                  <p className='mt-2 text-sm sm:text-base text-gray-500'>
                    Kelkite naujas keliones ir straipsnius.
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                  <Link
                    href={'/products'}
                    className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-500 px-4 sm:px-5 py-2 sm:py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring text-sm font-medium'
                    type='button'
                  >
                    Peržiūrėti keliones
                    <FiBox className='h-4 w-4' />
                  </Link>
                  <Link
                    href='https://politravel.lt/'
                    target='_blank'
                    className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-purple-500 px-4 sm:px-5 py-2 sm:py-3 text-purple-500 transition hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring text-sm font-medium'
                    type='button'
                  >
                    Peržiūrėti svetainę
                    <FiExternalLink strokeWidth='1.5' className='w-4 h-4' />
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className='px-4 sm:px-6 lg:px-8 pb-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Kelionės
                    </p>
                    <p className='text-2xl font-bold text-gray-900 mt-1'>
                      {products.length}
                    </p>
                  </div>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <RiArticleLine className='w-6 h-6 text-purple-600' />
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Nuotraukos
                    </p>
                    <p className='text-2xl font-bold text-gray-900 mt-1'>
                      {totalImagesCount}
                    </p>
                  </div>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <RiImageLine className='w-6 h-6 text-blue-600' />
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:col-span-2 lg:col-span-1'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Kategorijos
                    </p>
                    <p className='text-2xl font-bold text-gray-900 mt-1'>
                      {categories.length}
                    </p>
                  </div>
                  <div className='bg-green-100 p-3 rounded-full'>
                    <RiFolderLine className='w-6 h-6 text-green-600' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Not logged in: show login link
  return (
    <>
      <main className='flex min-h-screen flex-col items-center justify-center p-5 text-center '>
        <div className='max-w-xl lg:max-w-3xl'>
          <div className='max-w-xl lg:max-w-3xl flex flex-col items-center'>
            <img
              src='https://res.cloudinary.com/dcknlnne1/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1709827936/favicon-32x32_rllh9h.jpg?_s=public-apps'
              alt='Logo'
              width={36}
              height={36}
            />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-700 sm:text-3xl md:text-4xl'>
            Welcome to LB CMS
          </h1>
          <p className='mt-4 leading-relaxed text-gray-500 max-w-sm '>
            This website is only accessible to admins only. Add new products and
            manage database.
          </p>
          <div className='col-span-6 sm:flex sm:items-center sm:gap-4 my-4 flex items-center justify-center mt-10 '>
            <Link href='/login'>
              <button
                disabled={isLoading}
                className='inline-block shrink-0 rounded-md border border-purple-800 bg-purple-800 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-purple-800 focus:outline-none focus:ring active:text-blue-500'
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
