import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { FiBox, FiExternalLink } from 'react-icons/fi';
import { RiArticleLine, RiImageLine, RiFolderLine } from 'react-icons/ri';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const totalImagesCount = products.reduce(
    (total, product) => total + product.images.length,
    0
  );
  const totalPrice = products.reduce(
    (total, product) => total + product.price,
    0
  );

  if (session) {
    return (
      <>
        <main
          className={` min-h-screen p-4 md:custom-margin lg:custom-margin xl:custom-margin 2xl:custom-margin`}
        >
          <header>
            <div className='mx-auto  px-4 py-14 sm:px-6 sm:py-16 lg:px-8'>
              <div className='sm:flex sm:items-center sm:justify-between  '>
                <div className='text-center sm:text-center'>
                  <h1 className='text-3xl font-bold text-gray-700 sm:text-3xl '>
                    Sveiki,
                    <span className='text-purple-800 font-bold flex flex-col   py-2  sm:py-4  '>
                      {session.user.fullName || ''} !
                    </span>
                  </h1>

                  <p className='mt-1.5 text-md text-gray-500 max-w-md'>
                    Kelkite naujas keliones ir straipsnius.
                  </p>
                </div>

                <div className='mt-4 md:ml-11 lg:ml-11 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center'>
                  <Link
                    href={'/products'}
                    className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-500 px-5 py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring'
                    type='button'
                  >
                    <span className='text-sm font-medium'>
                      {' '}
                      Peržiūrėti keliones{' '}
                    </span>
                    <FiBox className='h-4 w-4' />
                  </Link>
                  <Link
                    href='https://politravel.lt/'
                    target='_blank'
                    className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-purple-500 px-5 py-3 text-purple-500 transition hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring'
                    type='button'
                  >
                    <span className='text-sm font-medium'>
                      Peržiūrėti svetainę
                    </span>
                    <FiExternalLink strokeWidth='1.5' className='w-4 h-4' />
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-8 pb-[150px]'>
            <div className='h-32 rounded-lg bg-gray-200 flex items-center justify-center '>
              <article className='flex max-md:flex-col items-end justify-between rounded-lg gap-4 text-center'>
                <div>
                  <p className='text-sm text-gray-500'>Kelionės</p>

                  <p className='text-2xl font-medium text-gray-700'>
                    {products.length}
                  </p>
                </div>
                <div className='inline-flex gap-2 rounded bg-purple-100 p-1 text-purple-600'>
                  <RiArticleLine className='w-4 h-4' />

                  <span className='text-xs font-medium'>{products.length}</span>
                </div>
              </article>
            </div>
            <div className='h-32 rounded-lg bg-gray-200 flex items-center justify-center text-center'>
              <article className='flex max-md:flex-col items-end justify-between rounded-lg gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Nuotraukos</p>

                  <p className='text-2xl font-medium text-gray-700'>
                    {totalImagesCount}
                  </p>
                </div>
                <div className='inline-flex gap-2 rounded bg-purple-100 p-1 text-purple-600'>
                  <RiImageLine className='w-4 h-4' />

                  <span className='text-xs font-medium'>
                    {totalImagesCount}
                  </span>
                </div>
              </article>
            </div>
            <div className='h-32 rounded-lg bg-gray-200 flex items-center justify-center text-center '>
              <article className='flex max-md:flex-col items-end justify-between rounded-lg gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Kategorijos</p>

                  <p className='text-2xl font-medium text-gray-700'>
                    {categories.length}
                  </p>
                </div>
                <div className='inline-flex gap-2 rounded bg-purple-100 p-1 text-purple-600'>
                  <RiFolderLine className='w-4 h-4' />

                  <span className='text-xs font-medium '>
                    {categories.length}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-5 text-center `}
      >
        <div className='max-w-xl lg:max-w-3xl'>
          <div className='max-w-xl lg:max-w-3xl flex flex-col items-center'>
            <Image
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
            <button
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                signIn('google');
              }}
              className='inline-block shrink-0 rounded-md border border-purple-800 bg-purple-800 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-purple-800 focus:outline-none focus:ring active:text-blue-500'
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
