import '../styles/globals.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Poppins({
  subsets: ['latin'],
  weight: '400',
});

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <main className={`${inter.className}`}>
      <Header />
      {/* Main content area with proper spacing for sidebar */}
      <div className='sm:ml-64 transition-all duration-300'>
        <div className='p-4'>
          <Component {...pageProps} />
        </div>
      </div>
      <Toaster position='top-center' />
    </main>
  );
}

export default MyApp;
