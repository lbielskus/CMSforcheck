import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

export default function Blog({
  _id,
  title: existingTitle,
  content: existingContent,
  category: selectedCategory,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [content, setContent] = useState(existingContent || '');
  const [category, setCategory] = useState(selectedCategory || '');
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImagesQueue = [];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function deleteBlogPost() {
    if (_id) {
      try {
        await axios.delete(`/api/blog/${_id}`);
        toast.success('Blog post deleted!!');

        router.push('/blog');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post.');
      }
    }
  }

  async function createBlog(ev) {
    ev.preventDefault();

    if (!category) {
      toast.error('Please select a category.');
      return;
    }

    const data = { title, content, category };
    if (_id) {
      await axios.put('/api/blog', { ...data, _id });
      toast.success('Blog post updated!!');
    } else {
      await axios.post('/api/blog', data);
      toast.success('Blog post created!!');
    }

    setRedirect(true);
  }
  if (redirect) {
    router.push('/blog');
    return null;
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <form onSubmit={createBlog} className='space-y-5'>
        <div className='grid grid-cols-2 items-center my-4'>
          <label className='col-span-1 block text-lg font-medium text-gray-700 mb-3'>
            Antraštė
          </label>
          <div className='col-span-2'>
            <input
              type='text'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 border p-3'
              placeholder='Antraštė'
              required
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='category'
            className='block text-lg font-medium text-gray-900'
          >
            Kategorija
          </label>
          <select
            id='category'
            className='mt-1.5 p-3 w-full rounded-md border border-gray-300 text-gray-700'
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
          >
            <option value='0'>Nepasirinkta kategorija</option>
            {categories.length > 0 &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className='grid grid-cols-2 items-center my-4'>
          <label className='col-span-1 block text-lg font-medium text-gray-700 mb-3'>
            Straipsnis
          </label>
          <div className='col-span-2'>
            <textarea
              type='text'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 border p-3'
              placeholder='Straipsnis'
              rows={6}
              required
              value={content}
              onChange={(ev) => setContent(ev.target.value)}
            />
          </div>
        </div>

        <div className='items-center my-4'>
          <div className='col-span-2 col-start-2'>
            <button
              type='submit'
              className='rounded-lg border border-slate-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-black shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300'
            >
              Išsaugoti
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
