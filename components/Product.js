import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';
import toast from 'react-hot-toast';
import TinyMCEEditor from './TinyMCEEditor';

export default function Product(props) {
  const {
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: selectedCategory,
    details: existingDetails,
    brand: existingBrand,
    colors: existingColors,
    gender: existingGender,
    sizes: existingSizes,
  } = props;

  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [details, setDetails] = useState(existingDetails || '');
  const [brand, setBrand] = useState(existingBrand || '');
  const [colors, setColors] = useState(existingColors || '');
  const [gender, setGender] = useState(existingGender || '');
  const [sizes, setSizes] = useState(existingSizes || '');
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const uploadImagesQueue = [];
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(selectedCategory || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  function validate() {
    const errs = {};
    if (!title) errs.title = 'Antraštė yra privaloma';
    if (!category || category === '0') errs.category = 'Pasirinkite kategoriją';
    if (!price) errs.price = 'Kaina yra privaloma';
    return errs;
  }

  async function createProduct(ev) {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSaving(true);
    if (isUploading) {
      await Promise.all(uploadImagesQueue);
    }

    const data = {
      title,
      description,
      price,
      details,
      images,
      category,
      brand,
      gender,
      sizes,
      colors,
    };
    try {
      if (_id) {
        await axios.put('/api/products', { ...data, _id });
        toast.success('Product updated!!');
      } else {
        await axios.post('/api/products', data);
        toast.success('Product created!!');
      }
      setRedirect(true);
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        uploadImagesQueue.push(
          axios.post('/api/upload', data).then((res) => {
            setImages((oldImages) => [...oldImages, ...res.data.links]);
          })
        );
      }
      await Promise.all(uploadImagesQueue);
      setIsUploading(false);
      toast.success('Image uploaded');
    } else {
      toast.error('An error occurred!');
    }
  }

  if (redirect) {
    router.push('/products');
    return null;
  }

  function updateImagesOrder(newImages) {
    setImages(newImages);
  }

  function handleDeleteImage(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    toast.success('Image deleted successfully!!');
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <form onSubmit={createProduct} className='space-y-8'>
        {/* Section: Main Info */}
        <h2 className='text-xl font-bold mb-2'>Pagrindinė informacija</h2>
        <div className='mb-4'>
          <label className='block text-lg font-medium text-gray-700 mb-1'>
            Antraštė <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            className={`block w-full rounded-md border p-3 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
            placeholder='Kelionės antraštė'
            required
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <div id='title-error' className='text-red-500 text-sm mt-1'>
              {errors.title}
            </div>
          )}
        </div>

        {/* Section: Category */}
        <div className='mb-4'>
          <label
            htmlFor='category'
            className='block text-lg font-medium text-gray-900'
          >
            Rinktis kategoriją <span className='text-red-500'>*</span>
          </label>
          <select
            id='category'
            className={`mt-1.5 p-3 w-full rounded-md border ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            } text-gray-700`}
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option key='none' value='0'>
              {categories.length === 0
                ? 'Nėra kategorijų'
                : 'Kategorija nepasirinkta'}
            </option>
            {categories.length > 0 &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          {errors.category && (
            <div id='category-error' className='text-red-500 text-sm mt-1'>
              {errors.category}
            </div>
          )}
        </div>

        {/* Section: Images */}
        <h2 className='text-xl font-bold mb-2'>Nuotraukos</h2>
        <div className='flex items-center gap-2 mb-2'>
          <label className='text-lg font-medium text-gray-700'>
            Pridėti nuotraukas
          </label>
          <label
            htmlFor='fileInput'
            className='flex items-center gap-1.5 px-3 py-2 text-center text-sm font-medium text-gray-500 border cursor-pointer hover:border-primary-400 rounded'
            tabIndex={0}
            title='Įkelkite nuotraukas'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='h-4 w-4'
            >
              <path d='M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z' />
              <path d='M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z' />
            </svg>
            Įkelti
          </label>
          <input
            id='fileInput'
            type='file'
            className='hidden'
            accept='image/*'
            multiple
            onChange={uploadImages}
            aria-label='Įkelti nuotraukas'
          />
          {isUploading && <Spinner className='ml-2' />}
        </div>
        <div className='grid grid-cols-2 items-center rounded'>
          {!isUploading && images.length === 0 && (
            <div className='text-gray-400 text-sm'>Nėra įkeltų nuotraukų</div>
          )}
        </div>
        {!isUploading && images.length > 0 && (
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-2'>
            <ReactSortable
              list={images}
              setList={updateImagesOrder}
              className='w-[350px] h-auto gap-2 flex justify-between align-items-center'
            >
              {images?.map((link, index) => (
                <div key={link} className='relative group'>
                  <img
                    src={link}
                    alt='image'
                    width={400}
                    height={300}
                    className='object-cover rounded-md border p-2 cursor-pointer transition-transform transform-gpu group-hover:scale-105'
                  />
                  <div className='absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100'>
                    <button
                      type='button'
                      onClick={() => handleDeleteImage(index)}
                      aria-label='Ištrinti nuotrauką'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-6 h-6 text-orange-600 bg-white rounded-full'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}

        {/* Section: Descriptions */}
        <h2 className='text-xl font-bold mb-2'>Aprašymai</h2>
        <div className='mb-4'>
          <label className='block text-lg font-medium text-gray-700 mb-1'>
            Pagrindinis aprašymas
          </label>
          <TinyMCEEditor
            value={description}
            onEditorChange={(content) => setDescription(content)}
          />
          <div className='text-xs text-gray-400 mt-1'>
            Galite naudoti formatavimą.
          </div>
        </div>
        <div className='mb-4'>
          <label className='block text-lg font-medium text-gray-700 mb-1'>
            Trumpas aprašymas
          </label>
          <TinyMCEEditor
            value={details}
            onEditorChange={(content) => setDetails(content)}
          />
          <div className='text-xs text-gray-400 mt-1'>
            Trumpas tekstas, rodomas sąrašuose.
          </div>
        </div>

        {/* Section: Additional Info */}
        <h2 className='text-xl font-bold mb-2'>Papildoma informacija</h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label>Šalis</label>
            <input
              className='w-full rounded-lg border border-gray-200 p-3 text-sm'
              placeholder='Šalis'
              type='text'
              value={brand}
              onChange={(ev) => setBrand(ev.target.value)}
            />
          </div>
          <div>
            <label>Kelionės tipas</label>
            <input
              className='w-full rounded-lg border border-gray-200 p-3 text-sm'
              placeholder='Kelionės tipas'
              type='text'
              value={gender}
              onChange={(ev) => setGender(ev.target.value)}
            />
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label>Lankomi miestai</label>
            <input
              className='w-full rounded-lg border border-gray-200 p-3 text-sm'
              placeholder='Lankomi miestai'
              type='text'
              value={sizes}
              onChange={(ev) => setSizes(ev.target.value)}
            />
          </div>
          <div>
            <label>Kelionės trukmė</label>
            <input
              className='w-full rounded-lg border border-gray-200 p-3 text-sm'
              placeholder='Kelionės trukmė'
              type='text'
              value={colors}
              onChange={(ev) => setColors(ev.target.value)}
            />
          </div>
        </div>

        {/* Section: Price */}
        <h2 className='text-xl font-bold mb-2'>Kaina</h2>
        <div className='mb-4'>
          <label className='block text-lg font-medium text-gray-700 mb-1'>
            Kaina <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            className={`block w-full rounded-md border p-3 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
            placeholder='Kaina'
            required
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
          {errors.price && (
            <div id='price-error' className='text-red-500 text-sm mt-1'>
              {errors.price}
            </div>
          )}
        </div>

        {/* Save/Cancel Buttons */}
        <div className='flex gap-4 items-center my-4 pb-11'>
          <button
            type='submit'
            className='rounded-lg border border-slate-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-black shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300 flex items-center gap-2'
            disabled={isSaving}
            aria-busy={isSaving}
          >
            {isSaving && <Spinner className='w-4 h-4' />}
            Išsaugoti
          </button>
          <button
            type='button'
            className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-100 focus:ring focus:ring-gray-200'
            onClick={() => router.push('/products')}
            tabIndex={0}
          >
            Atšaukti
          </button>
        </div>
      </form>
    </div>
  );
}
