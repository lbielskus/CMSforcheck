import '../styles/globals.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Poppins({
  subsets: ['latin'],
  weight: '400',
});

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <main className={`${inter.className}`}>
      <div className='md:flex'>
        <Header />
        <div className='min-h-screen max-w-screen-2xl mx-auto'>
          <Component {...pageProps} />
          <Toaster position='top-center' />
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default MyApp;
