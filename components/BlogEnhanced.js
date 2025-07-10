import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import {
  getCurrentDateForInput,
  formatDateEuropean,
} from '../helpers/dateHelpers';

export default function BlogEnhanced({
  _id,
  title: existingTitle,
  content: existingContent,
  category: selectedCategory,
  images: existingImages,
  createdAt: existingCreatedAt,
  excerpt: existingExcerpt,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [content, setContent] = useState(existingContent || '');
  const [excerpt, setExcerpt] = useState(existingExcerpt || '');
  const [category, setCategory] = useState(selectedCategory || '');
  const [images, setImages] = useState(existingImages || []);
  const [createdAt, setCreatedAt] = useState(
    existingCreatedAt
      ? new Date(existingCreatedAt).toISOString().split('T')[0]
      : ''
  );

  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Antraštė yra privaloma';
    if (!content.trim()) errs.content = 'Turinys yra privalomas';
    if (!category || category === '0') errs.category = 'Pasirinkite kategoriją';
    return errs;
  }

  // Auto-generate excerpt from content
  useEffect(() => {
    if (content && !excerpt) {
      const autoExcerpt = content.substring(0, 200).trim();
      setExcerpt(autoExcerpt + (content.length > 200 ? '...' : ''));
    }
  }, [content, excerpt]);

  async function uploadImages(ev) {
    const files = ev.target?.files || ev.dataTransfer?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const uploadPromises = [];

      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        uploadPromises.push(
          axios.post('/api/upload', data).then((res) => {
            setImages((oldImages) => [...oldImages, ...res.data.links]);
          })
        );
      }

      try {
        await Promise.all(uploadPromises);
        toast.success('Nuotraukos įkeltos sėkmingai!');
      } catch (error) {
        toast.error('Klaida įkeliant nuotraukas!');
      } finally {
        setIsUploading(false);
      }
    }
  }

  function handleDeleteImage(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    toast.success('Nuotrauka ištrinta!');
  }

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    uploadImages(e);
  };

  async function createBlog(ev) {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSaving(true); // Format the date - if empty, use current date
    const finalCreatedAt = createdAt || getCurrentDateForInput();

    // Convert to European format for display but save as ISO for database
    const dateObj = new Date(finalCreatedAt + 'T00:00:00.000Z');

    const data = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      category,
      images,
      createdAt: dateObj.toISOString(), // Save as ISO format
      displayDate: formatDateEuropean(dateObj), // European format for display
    };

    try {
      if (_id) {
        await axios.put('/api/blog', { ...data, _id });
        toast.success('Straipsnis atnaujintas!');
      } else {
        await axios.post('/api/blog', data);
        toast.success('Straipsnis sukurtas!');
      }
      setRedirect(true);
    } catch (error) {
      toast.error('Klaida išsaugant straipsnį!');
      console.error('Error saving blog:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteBlogPost() {
    if (_id && confirm('Ar tikrai norite ištrinti šį straipsnį?')) {
      try {
        await axios.delete(`/api/blog/${_id}`);
        toast.success('Straipsnis ištrintas!');
        router.push('/blogs');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Nepavyko ištrinti straipsnio.');
      }
    }
  }

  if (redirect) {
    router.push('/blogs');
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto p-6'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {_id ? 'Redaguoti straipsnį' : 'Naujas straipsnis'}
          </h1>
          <p className='text-gray-600'>
            Sukurkite arba redaguokite blog straipsnį. Privalomi laukai pažymėti
            *
          </p>
        </div>

        <form onSubmit={createBlog} className='space-y-6'>
          {/* Basic Information Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                1
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Pagrindinė informacija
              </h2>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='lg:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Antraštė *
                </label>
                <input
                  type='text'
                  className={`block w-full rounded-lg border-2 ${
                    errors.title ? 'border-red-300' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-0 p-3 transition-colors`}
                  placeholder='Įveskite straipsnio antraštę...'
                  value={title}
                  onChange={(ev) => setTitle(ev.target.value)}
                />
                {errors.title && (
                  <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Kategorija *
                </label>
                <select
                  className={`block w-full rounded-lg border-2 ${
                    errors.category ? 'border-red-300' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-0 p-3 transition-colors`}
                  value={category}
                  onChange={(ev) => setCategory(ev.target.value)}
                >
                  <option value=''>Pasirinkite kategoriją</option>
                  {categories.length > 0 &&
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className='text-red-500 text-sm mt-1'>{errors.category}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Publikavimo data
                </label>
                <input
                  type='date'
                  className='block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 transition-colors'
                  value={createdAt}
                  onChange={(ev) => setCreatedAt(ev.target.value)}
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Palikite tuščią, jei norite naudoti šiandienos datą
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                2
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Nuotraukos
              </h2>
            </div>

            <div className='mb-6'>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={uploadImages}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  disabled={isUploading}
                />

                <div className='space-y-4'>
                  <div className='mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
                    {isUploading ? (
                      <Spinner className='w-8 h-8' />
                    ) : (
                      <svg
                        className='w-8 h-8 text-blue-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                        />
                      </svg>
                    )}
                  </div>

                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                      {isUploading
                        ? 'Įkeliamos nuotraukos...'
                        : 'Įkelkite nuotraukas'}
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>
                      Vilkite nuotraukas čia arba spustelėkite pasirinkimui
                    </p>

                    <div className='flex flex-wrap gap-2 justify-center text-xs text-gray-500'>
                      <span className='bg-gray-100 px-2 py-1 rounded'>JPG</span>
                      <span className='bg-gray-100 px-2 py-1 rounded'>PNG</span>
                      <span className='bg-gray-100 px-2 py-1 rounded'>
                        WEBP
                      </span>
                      <span className='bg-gray-100 px-2 py-1 rounded'>
                        iki 10MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div>
                <h4 className='font-medium text-gray-900 mb-3'>
                  Įkeltos nuotraukos ({images.length})
                </h4>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {images.map((link, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={link}
                        alt={`Nuotrauka ${index + 1}`}
                        className='w-full h-32 object-cover rounded-lg border-2 border-gray-200 transition-transform group-hover:scale-105'
                      />
                      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg'></div>
                      <button
                        type='button'
                        onClick={() => handleDeleteImage(index)}
                        className='absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center'
                        title='Ištrinti nuotrauką'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                      <div className='absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity'>
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                3
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>Turinys</h2>
            </div>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trumpas aprašymas
                </label>
                <textarea
                  className='block w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-0 p-3 transition-colors'
                  placeholder='Trumpas straipsnio aprašymas (automatiškai generuojamas iš turinio)...'
                  rows={3}
                  value={excerpt}
                  onChange={(ev) => setExcerpt(ev.target.value)}
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Šis aprašymas bus rodomas straipsnių sąraše
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Straipsnio turinys *
                </label>
                <textarea
                  className={`block w-full rounded-lg border-2 ${
                    errors.content ? 'border-red-300' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-0 p-3 transition-colors`}
                  placeholder='Rašykite straipsnio turinį...'
                  rows={12}
                  value={content}
                  onChange={(ev) => setContent(ev.target.value)}
                />
                {errors.content && (
                  <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
                )}
                <p className='text-sm text-gray-500 mt-1'>
                  Simbolių: {content.length}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Actions Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex flex-col sm:flex-row gap-4 justify-between'>
              <div className='flex gap-3'>
                <button
                  type='submit'
                  disabled={isSaving}
                  className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors'
                >
                  {isSaving && <Spinner className='w-4 h-4 mr-2' />}
                  {_id ? 'Atnaujinti straipsnį' : 'Sukurti straipsnį'}
                </button>

                <button
                  type='button'
                  onClick={() => router.push('/blogs')}
                  className='px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors'
                >
                  Atšaukti
                </button>
              </div>

              {_id && (
                <button
                  type='button'
                  onClick={deleteBlogPost}
                  className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors'
                >
                  Ištrinti straipsnį
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
