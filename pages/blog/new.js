import BlogPost from '../../components/Blog';

export default function NewBlogPost() {
  return (
    <section className='p-4'>
      <div className='sm:flex sm:items-center sm:justify-center'>
        <div className='text-center sm:text-left'>
          <p className='mt-1.5 text-lg text-red-600'>
            Užpildykite visus laukus!
          </p>
        </div>
      </div>

      <hr className='my-8 h-px border-0 bg-gray-300' />
      <div className='my-10 max-sm:my-12 pb-[100px]'>
        <BlogPost />
      </div>
    </section>
  );
}
