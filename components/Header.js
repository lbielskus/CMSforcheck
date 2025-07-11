import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { BsFillImageFill } from 'react-icons/bs';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebaseClient'; // adjust path if needed

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 870) {
      setIsSidebarOpen(false);
    }
  };

  const active = 'active-class';
  const inActive = 'inactive-class';

  if (user) {
    return (
      <>
        {/* Mobile menu button - only visible on mobile */}
        <button
          data-drawer-target='separator-sidebar'
          data-drawer-toggle='separator-sidebar'
          aria-controls='separator-sidebar'
          type='button'
          className='fixed top-4 left-4 z-50 sm:hidden inline-flex border-2 border-purple-900 items-center p-2 text-sm text-purple-900 rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-lg'
          onClick={toggleSidebar}
        >
          <span className='sr-only'>Open sidebar</span>
          <svg
            className='w-6 h-6 text-purple-900'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              fillRule='evenodd'
              d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
            ></path>
          </svg>
        </button>

        <aside
          id='separator-sidebar'
          className={`z-40 fixed top-0 left-0 w-64 h-screen transition-transform ${
            isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0'
          }`}
          aria-label='Sidebar'
        >
          {/* Mobile close button */}
          {isSidebarOpen && (
            <button
              type='button'
              className='sm:hidden absolute top-2 right-2 p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 z-50'
              onClick={toggleSidebar}
            >
              <span className='sr-only'>Close sidebar</span>
              <svg
                className='w-6 h-6'
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14.848 5.152a.75.75 0 0 1 1.061 1.061L11.061 10l4.848 4.848a.75.75 0 1 1-1.061 1.061L10 11.061l-4.848 4.848a.75.75 0 1 1-1.061-1.061L8.939 10 4.091 5.152a.75.75 0 0 1 1.061-1.061L10 8.939l4.848-4.848z'
                />
              </svg>
            </button>
          )}

          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div
              className='sm:hidden fixed inset-0 bg-black bg-opacity-50 z-30'
              onClick={toggleSidebar}
            ></div>
          )}
          <div className='h-full px-3 py-4 overflow-y-auto bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 pt-11 flex flex-col'>
            {/* Logo and App Name */}
            <div className='mb-8 px-2'>
              <div className='flex items-center gap-3 mb-2'>
                <img
                  src='https://res.cloudinary.com/dcknlnne1/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1709827936/favicon-32x32_rllh9h.jpg?_s=public-apps'
                  alt='Logo'
                  width={32}
                  height={32}
                  className='h-8 w-8 rounded-lg'
                />
                <span className='text-xl font-bold text-purple-900 dark:text-white'>
                  Politravel CMS
                </span>
              </div>
              <p className='text-sm text-purple-700 dark:text-gray-300'>
                Turinio valdymas
              </p>
            </div>

            {/* Navigation Menu */}
            <nav className='flex-1'>
              <ul className='space-y-3 font-medium'>
                <li>
                  <Link href='/' onClick={handleLinkClick}>
                    <div
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        pathname === '/'
                          ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:text-white dark:hover:bg-gray-400'
                      }`}
                    >
                      <svg
                        className='w-5 h-5 transition duration-200'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 22 21'
                      >
                        <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                        <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
                      </svg>
                      <span className='ms-3 font-medium'>Pagrindinis</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href='/images' onClick={handleLinkClick}>
                    <div
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        pathname.startsWith('/images')
                          ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:text-white dark:hover:bg-gray-400'
                      }`}
                    >
                      <BsFillImageFill className='w-5 h-5' />
                      <span className='ms-3 font-medium'>Nuotraukos</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href='/categories' onClick={handleLinkClick}>
                    <div
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        pathname.startsWith('/categories')
                          ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:text-white dark:hover:bg-gray-400'
                      }`}
                    >
                      <svg
                        className='w-5 h-5 transition duration-200'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 18 18'
                      >
                        <path d='M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z' />
                      </svg>
                      <span className='ms-3 font-medium'>Kategorijos</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href='/products' onClick={handleLinkClick}>
                    <div
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        pathname.startsWith('/products')
                          ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:text-white dark:hover:bg-gray-400'
                      }`}
                    >
                      <svg
                        className='w-5 h-5 transition duration-200'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 18 20'
                      >
                        <path d='M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z' />
                      </svg>
                      <span className='ms-3 font-medium'>Kelionės</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href='/blog' onClick={handleLinkClick}>
                    <div
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        pathname.startsWith('/blog')
                          ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:text-white dark:hover:bg-gray-400'
                      }`}
                    >
                      <svg
                        className='w-5 h-5 transition duration-200'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z' />
                        <path d='M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z' />
                        <path d='M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z' />
                      </svg>
                      <span className='ms-3 font-medium'>Straipsniai</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Settings and Footer */}
            <div className='mt-auto pt-6 border-t border-purple-200 dark:border-gray-700'>
              <Link href='/settings' onClick={handleLinkClick}>
                <div
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group mb-4 ${
                    pathname.startsWith('/settings')
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:text-white dark:hover:bg-gray-400'
                  }`}
                >
                  <svg
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    height='1em'
                    width='1em'
                    className='h-5 w-5'
                  >
                    <path d='M15 12 A3 3 0 0 1 12 15 A3 3 0 0 1 9 12 A3 3 0 0 1 15 12 z' />
                    <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z' />
                  </svg>
                  <span className='ms-3 font-medium'>Nustatymai</span>
                </div>
              </Link>

              {/* Footer in Sidebar */}
              <div className='text-center text-xs text-purple-600 dark:text-gray-400 px-2'>
                <p className='mb-1'>Sukurta Lets Be Visible</p>
                <p>© 2024</p>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Optionally, render nothing or a minimal header if not logged in
  return null;
}
