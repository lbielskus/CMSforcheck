import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import TinyMCEEditor from './TinyMCEEditor';

export default function ProductNew(props) {
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
    // New travel-specific fields
    country: existingCountry,
    travelType: existingTravelType,
    cities: existingCities,
    duration: existingDuration,
    shortDescription: existingShortDescription,
    includedinprice: existingIncludedInPrice,
    excludedinprice: existingExcludedInPrice,
    rating: existingRating,
    reviewCount: existingReviewCount,
    dayamount: existingDayAmount,
    travelDays: existingTravelDays,
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

  // New travel-specific state
  const [country, setCountry] = useState(existingCountry || '');
  const [travelType, setTravelType] = useState(existingTravelType || '');
  const [cities, setCities] = useState(existingCities || '');
  const [duration, setDuration] = useState(existingDuration || '');
  const [shortDescription, setShortDescription] = useState(
    existingShortDescription || ''
  );
  const [includedinprice, setIncludedInPrice] = useState(
    existingIncludedInPrice || []
  );
  const [excludedinprice, setExcludedInPrice] = useState(
    existingExcludedInPrice || []
  );
  const [rating, setRating] = useState(existingRating || '');
  const [reviewCount, setReviewCount] = useState(existingReviewCount || '');
  const [dayamount, setDayAmount] = useState(existingDayAmount || 1);
  const [travelDays, setTravelDays] = useState(existingTravelDays || []);

  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const uploadImagesQueue = [];
  const [categories, setCategories] = useState([]);
  // Change category state to array
  const [category, setCategory] = useState(() => {
    if (Array.isArray(selectedCategory)) {
      return selectedCategory.map(String);
    } else if (typeof selectedCategory === 'string' && selectedCategory) {
      return [selectedCategory];
    } else {
      return [];
    }
  });
  const [errors, setErrors] = useState({});

  const AUTOSAVE_KEY = 'newProductAutosave';

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  // Helper functions for travel days
  const generateTravelDays = useCallback(
    (amount) => {
      const days = [];
      for (let i = 1; i <= amount; i++) {
        const existingDay = travelDays.find((day) => day.day === i);
        days.push({
          day: i,
          title: existingDay?.title || `${i}-a diena: `,
          description: existingDay?.description || '',
        });
      }
      setTravelDays(days);
    },
    [travelDays]
  );

  // Effect to generate travel days when dayamount changes
  useEffect(() => {
    if (dayamount > 0) {
      generateTravelDays(dayamount);
    }
  }, [dayamount, generateTravelDays]);

  // Restore autosave if present and no _id
  useEffect(() => {
    if (!_id) {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data) {
            setTitle(data.title || '');
            setDescription(data.description || '');
            setPrice(data.price || '');
            setImages(data.images || []);
            setDetails(data.details || '');
            setBrand(data.brand || '');
            setColors(data.colors || '');
            setGender(data.gender || '');
            setSizes(data.sizes || '');
            setCountry(data.country || '');
            setTravelType(data.travelType || '');
            setCities(data.cities || '');
            setDuration(data.duration || '');
            setShortDescription(data.shortDescription || '');
            setIncludedInPrice(data.includedinprice || []);
            setExcludedInPrice(data.excludedinprice || []);
            setRating(data.rating || '');
            setReviewCount(data.reviewCount || '');
            setDayAmount(data.dayamount || 1);
            setTravelDays(data.travelDays || []);
            // Only coerce to array of strings here
            if (Array.isArray(data.category)) {
              setCategory(data.category.map(String));
            } else if (typeof data.category === 'string' && data.category) {
              setCategory([data.category]);
            } else {
              setCategory([]);
            }
          }
        } catch {}
      }
    }
  }, []);

  // Autosave on change (only for new)
  useEffect(() => {
    if (!_id) {
      const data = {
        title,
        description,
        price,
        images,
        details,
        brand,
        colors,
        gender,
        sizes,
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice,
        excludedinprice,
        rating,
        reviewCount,
        dayamount,
        travelDays,
        category, // now an array
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    }
  }, [
    title,
    description,
    price,
    images,
    details,
    brand,
    colors,
    gender,
    sizes,
    country,
    travelType,
    cities,
    duration,
    shortDescription,
    includedinprice,
    excludedinprice,
    rating,
    reviewCount,
    dayamount,
    travelDays,
    category,
    _id,
  ]);

  function validate() {
    const errs = {};
    if (!title) errs.title = 'Kelionės pavadinimas yra privalomas';
    if (!category || category.length === 0)
      errs.category = 'Pasirinkite bent vieną kategoriją';
    if (!price) errs.price = 'Kaina yra privaloma';
    return errs;
  }

  async function createProduct(ev) {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('Prašome užpildyti visus privalomus laukus.');
      return;
    }

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
      category, // now an array
      brand,
      gender,
      sizes,
      colors,
      // New travel-specific fields
      country,
      travelType,
      cities,
      duration,
      shortDescription,
      includedinprice,
      excludedinprice,
      rating: rating ? parseFloat(rating) : null,
      reviewCount: reviewCount ? parseInt(reviewCount) : null,
      dayamount: parseInt(dayamount),
      travelDays,
    };

    try {
      if (_id) {
        await axios.put('/api/products', { ...data, _id });
        toast.success('Kelionė atnaujinta!');
      } else {
        await axios.post('/api/products', data);
        toast.success('Kelionė sukurta!');
      }
      localStorage.removeItem(AUTOSAVE_KEY);
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
      toast.success('Nuotraukos įkeltos!');
    } else {
      toast.error('Klaida įkeliant nuotraukas!');
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
    toast.success('Nuotrauka ištrinta!');
  }

  function updateTravelDay(dayIndex, field, value) {
    const updatedDays = [...travelDays];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      [field]: value,
    };
    setTravelDays(updatedDays);
  }

  // Helper functions for included/excluded price arrays
  function addIncludedItem() {
    setIncludedInPrice([...includedinprice, '']);
  }

  function removeIncludedItem(index) {
    const updated = [...includedinprice];
    updated.splice(index, 1);
    setIncludedInPrice(updated);
  }

  function updateIncludedItem(index, value) {
    const updated = [...includedinprice];
    updated[index] = value;
    setIncludedInPrice(updated);
  }

  function addExcludedItem() {
    setExcludedInPrice([...excludedinprice, '']);
  }

  function removeExcludedItem(index) {
    const updated = [...excludedinprice];
    updated.splice(index, 1);
    setExcludedInPrice(updated);
  }

  function updateExcludedItem(index, value) {
    const updated = [...excludedinprice];
    updated[index] = value;
    setExcludedInPrice(updated);
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {_id ? 'Redaguoti kelionę' : 'Nauja kelionė'}
          </h1>
          <p className='text-gray-600'>
            Užpildykite informaciją apie kelionę. Privalomi laukai pažymėti *
          </p>
        </div>

        <form onSubmit={createProduct} className='space-y-6'>
          {/* Main Information Card */}
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
                  Kelionės pavadinimas <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  className={`block w-full rounded-lg border-2 p-4 text-lg ${
                    errors.title
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  } focus:ring-0 transition-colors`}
                  placeholder='Įveskite kelionės pavadinimą...'
                  value={title}
                  onChange={(ev) => setTitle(ev.target.value)}
                />
                {errors.title && (
                  <p className='text-red-500 text-sm mt-2 flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Kategorijos <span className='text-red-500'>*</span>
                </label>
                <div className='flex flex-wrap gap-2'>
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className='flex items-center gap-2 text-sm bg-gray-100 rounded px-2 py-1 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        className='accent-blue-600 w-4 h-4'
                        checked={category.includes(String(cat._id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCategory(
                              Array.from(
                                new Set([
                                  ...category.map(String),
                                  String(cat._id),
                                ])
                              )
                            );
                          } else {
                            setCategory(
                              category.filter(
                                (id) => String(id) !== String(cat._id)
                              )
                            );
                          }
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
                {errors.category && (
                  <p className='text-red-500 text-sm mt-2 flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Kaina (€) <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    className={`block w-full rounded-lg border-2 p-4 text-lg pl-8 ${
                      errors.price
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                    } focus:ring-0 transition-colors`}
                    placeholder='0'
                    value={price}
                    onChange={(ev) => setPrice(ev.target.value)}
                  />
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <span className='text-gray-500 text-lg'>€</span>
                  </div>
                </div>
                {errors.price && (
                  <p className='text-red-500 text-sm mt-2 flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {errors.price}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Details Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                2
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Kelionės informacija
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Šalis
                </label>
                <input
                  className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:ring-0 transition-colors'
                  placeholder='pvz., Lietuva'
                  value={country}
                  onChange={(ev) => setCountry(ev.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Kelionės tipas
                </label>
                <input
                  className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:ring-0 transition-colors'
                  placeholder='pvz., Aktyvus turizmas'
                  value={travelType}
                  onChange={(ev) => setTravelType(ev.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trukmė
                </label>
                <input
                  className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:ring-0 transition-colors'
                  placeholder='pvz., 2 dienos'
                  value={duration}
                  onChange={(ev) => setDuration(ev.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Lankomi miestai
                </label>
                <input
                  className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:ring-0 transition-colors'
                  placeholder='pvz., Vilnius, Kaunas'
                  value={cities}
                  onChange={(ev) => setCities(ev.target.value)}
                />
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Pagrindinė informacija
              </label>
              <div className='border-2 border-gray-200 rounded-lg overflow-hidden'>
                <TinyMCEEditor
                  value={shortDescription}
                  onEditorChange={(content) => setShortDescription(content)}
                />
              </div>
              <p className='text-xs text-gray-500 mt-2'>
                Pagrindinė kelionės informacija, rodoma kelionės puslapyje.
              </p>
            </div>

            {/* Rating Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Įvertinimas
                </label>
                <input
                  type='number'
                  step='0.1'
                  min='0'
                  max='5'
                  className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:ring-0 transition-colors'
                  placeholder='4.8'
                  value={rating}
                  onChange={(ev) => setRating(ev.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Atsiliepimų skaičius
                </label>
                <input
                  type='number'
                  min='0'
                  className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:ring-0 transition-colors'
                  placeholder='127'
                  value={reviewCount}
                  onChange={(ev) => setReviewCount(ev.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                3
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Nuotraukos
              </h2>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='fileInput'
                className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <svg
                    className='w-8 h-8 mb-4 text-gray-500'
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
                  <p className='mb-2 text-sm text-gray-500'>
                    <span className='font-semibold'>Spustelėkite įkelti</span>{' '}
                    arba nuvilkite nuotraukas
                  </p>
                  <p className='text-xs text-gray-500'>PNG, JPG iki 10MB</p>
                </div>
                <input
                  id='fileInput'
                  type='file'
                  className='hidden'
                  accept='image/*'
                  multiple
                  onChange={uploadImages}
                />
              </label>
              {isUploading && (
                <div className='flex items-center justify-center mt-4'>
                  <Spinner className='w-6 h-6 mr-2' />
                  <span className='text-gray-600'>Įkeliamos nuotraukos...</span>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
                {images.map((link, index) => (
                  <div key={link} className='relative group'>
                    <img
                      src={link}
                      alt={`Kelionės nuotrauka ${index + 1}`}
                      className='w-full h-24 object-cover rounded-lg border-2 border-gray-200 transition-transform hover:scale-105'
                    />
                    <button
                      type='button'
                      onClick={() => handleDeleteImage(index)}
                      className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600'
                      title='Ištrinti'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Descriptions Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                4
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>Aprašymai</h2>
            </div>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Detalus aprašymas
                </label>
                <div className='border-2 border-gray-200 rounded-lg overflow-hidden'>
                  <TinyMCEEditor
                    value={description}
                    onEditorChange={(content) => setDescription(content)}
                  />
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  Pilnas kelionės aprašymas su visais detaliais.
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trumpas aprašymas (sąrašams)
                </label>
                <div className='border-2 border-gray-200 rounded-lg overflow-hidden'>
                  <TinyMCEEditor
                    value={details}
                    onEditorChange={(content) => setDetails(content)}
                  />
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  Trumpas tekstas, rodomas kelionių sąrašuose ir kortelėse.
                </p>
              </div>
            </div>
          </div>

          {/* Price & Services Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                5
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Kainoje įskaičiuota / neįskaičiuota
              </h2>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Included in price */}
              <div>
                <h3 className='text-lg font-medium text-green-700 mb-4 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Kainoje įskaičiuota
                </h3>
                <div className='space-y-3'>
                  {includedinprice.map((item, index) => (
                    <div key={index} className='flex gap-2'>
                      <input
                        className='flex-1 rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors'
                        placeholder='Įrašykite ką įskaičiuoja kaina...'
                        value={item}
                        onChange={(ev) =>
                          updateIncludedItem(index, ev.target.value)
                        }
                      />
                      <button
                        type='button'
                        onClick={() => removeIncludedItem(index)}
                        className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Pašalinti'
                      >
                        <svg
                          className='w-5 h-5'
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
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addIncludedItem}
                    className='w-full px-4 py-3 text-green-600 border-2 border-green-200 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center gap-2'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Pridėti įskaičiuotą elementą
                  </button>
                </div>
              </div>

              {/* Excluded from price */}
              <div>
                <h3 className='text-lg font-medium text-red-700 mb-4 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-red-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Kainoje neįskaičiuota
                </h3>
                <div className='space-y-3'>
                  {excludedinprice.map((item, index) => (
                    <div key={index} className='flex gap-2'>
                      <input
                        className='flex-1 rounded-lg border-2 border-gray-200 p-3 focus:border-red-500 focus:ring-0 transition-colors'
                        placeholder='Įrašykite ką neįskaičiuoja kaina...'
                        value={item}
                        onChange={(ev) =>
                          updateExcludedItem(index, ev.target.value)
                        }
                      />
                      <button
                        type='button'
                        onClick={() => removeExcludedItem(index)}
                        className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Pašalinti'
                      >
                        <svg
                          className='w-5 h-5'
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
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addExcludedItem}
                    className='w-full px-4 py-3 text-red-600 border-2 border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Pridėti neįskaičiuotą elementą
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Days Card */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                6
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Kelionės dienos
              </h2>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Dienų skaičius
              </label>
              <input
                className='w-32 rounded-lg border-2 border-gray-200 p-3 focus:border-teal-500 focus:ring-0 transition-colors text-center text-lg font-semibold'
                placeholder='1'
                type='number'
                min='1'
                max='30'
                value={dayamount}
                onChange={(ev) => setDayAmount(parseInt(ev.target.value) || 1)}
              />
            </div>

            {travelDays.length > 0 && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-700 border-b border-gray-200 pb-2'>
                  Dienų aprašymai
                </h3>
                {travelDays.map((day, index) => (
                  <div
                    key={day.day}
                    className='bg-gray-50 rounded-lg p-5 border-l-4 border-teal-500'
                  >
                    <div className='flex items-center mb-4'>
                      <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3'>
                        {day.day}
                      </div>
                      <h4 className='text-lg font-medium text-gray-800'>
                        {day.day}-a diena
                      </h4>
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Dienos pavadinimas
                        </label>
                        <input
                          className='w-full rounded-lg border-2 border-gray-200 p-3 focus:border-teal-500 focus:ring-0 transition-colors'
                          placeholder={`${day.day}-a diena: Pavadinimas...`}
                          value={day.title}
                          onChange={(ev) =>
                            updateTravelDay(index, 'title', ev.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Dienos aprašymas
                        </label>
                        <textarea
                          className='w-full rounded-lg border-2 border-gray-200 p-3 focus:border-teal-500 focus:ring-0 transition-colors'
                          placeholder='Detalus dienos aprašymas...'
                          rows={4}
                          value={day.description}
                          onChange={(ev) =>
                            updateTravelDay(
                              index,
                              'description',
                              ev.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
              <div className='text-sm text-gray-600'>
                <p>Peržiūrėkite informaciją ir išsaugokite kelionę</p>
              </div>

              <div className='flex gap-4'>
                <button
                  type='button'
                  className='px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                  onClick={() => router.push('/products')}
                >
                  Atšaukti
                </button>
                <button
                  type='submit'
                  className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={isSaving}
                >
                  {isSaving && <Spinner className='w-5 h-5' />}
                  {isSaving ? 'Išsaugoma...' : 'Išsaugoti kelionę'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
