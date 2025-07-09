// pages/products/edit/[..id].js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { app } from '../../../lib/firebaseClient'; // adjust path if needed
import Product from '../../../components/Product';

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { id = [] } = router.query;

  const actualId = Array.isArray(id) && id.length ? id[0] : null;

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
    if (!actualId || !user) return;

    axios.get(`/api/products?id=${actualId}`).then((res) => {
      setProductInfo(res.data);
    });
  }, [actualId, user]);

  if (!user) return null;

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>
        {actualId ? 'Redaguoti produktą' : 'Naujas produktas'}
      </h1>
      {productInfo || !actualId ? (
        <Product {...(productInfo || {})} />
      ) : (
        <p>Įkeliama...</p>
      )}
    </div>
  );
}
