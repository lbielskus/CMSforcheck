import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Poppins({
  subsets: ['latin'],
  weight: '400',
});

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  const router = useRouter();

  useEffect(() => {
    const handleSessionCheck = async () => {
      const session = await fetch('/api/auth/session');
      if (!session) {
        router.push('/login');
      }
    };
    handleSessionCheck();
  }, [router]);

  return (
    <SessionProvider session={pageProps.session}>
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
    </SessionProvider>
  );
}

export default MyApp;
