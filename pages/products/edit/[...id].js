// pages/products/edit/[..id].js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Product from '../../../components/Product';

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id = [] } = router.query;

  const actualId = id.length ? id[0] : null;

  useEffect(() => {
    if (!actualId) return;

    axios.get(`/api/products?id=${actualId}`).then((res) => {
      setProductInfo(res.data);
    });
  }, [actualId]);

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
