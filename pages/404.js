import Link from 'next/link';

export default function ErrorPage() {
  return (
    <>
      <div className='grid h-screen px-4 bg-white place-content-center'>
        <div className='text-center'>
          <h1 className='font-black text-gray-200 text-9xl'>404</h1>

          <p className='mt-4 text-gray-500'>Puslapis nerastas.</p>

          <Link
            href='/'
            className='inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-purple-900 rounded hover:bg-purple-800 focus:outline-none focus:ring'
          >
            Grįžti į pagrindinį
          </Link>
        </div>
      </div>
    </>
  );
}
