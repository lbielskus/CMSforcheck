import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { app } from '../../lib/firebaseClient'; // adjust path if needed
import Product from '../../components/Product';
import ReactSortable from 'react-sortablejs';

export default function NewProduct() {
  const [user, setUser] = useState(null);
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

  if (!user) return null;

  return (
    <>
      <section className='p-4'>
        <div className='sm:flex sm:items-center sm:justify-center'>
          <div className='text-center sm:text-left'>
            <p className='mt-1.5 text-lg text-red-500'>
              Užpildykite visus laukus!
            </p>
          </div>
        </div>

        <hr className='my-8 h-px border-0 bg-gray-300' />
        <div className='my-10 max-sm:my-12'>
          <Product />
        </div>
      </section>
    </>
  );
}
