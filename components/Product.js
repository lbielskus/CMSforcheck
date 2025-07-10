import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Import modular components
import AIDocumentParser from './ProductForm/AIDocumentParser';
import BasicInfoCard from './ProductForm/BasicInfoCard';
import TravelDetailsCard from './ProductForm/TravelDetailsCard';
import ImageUploadCard from './ProductForm/ImageUploadCard';
import DescriptionsCard from './ProductForm/DescriptionsCard';
import PriceServicesCard from './ProductForm/PriceServicesCard';
import TravelDaysCard from './ProductForm/TravelDaysCard';
import SubmitActionsCard from './ProductForm/SubmitActionsCard';

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
  const [isAIProcessing, setIsAIProcessing] = useState(false);
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

  // Helper functions for travel days
  function generateTravelDays(amount) {
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

  // Effect to generate travel days when dayamount changes
  useEffect(() => {
    if (dayamount > 0) {
      generateTravelDays(dayamount);
    }
  }, [dayamount]);

  // Handle AI extracted data
  const handleAIDataExtracted = (extractedData) => {
    try {
      // Fill form fields with AI extracted data
      if (extractedData.title) setTitle(extractedData.title);
      if (extractedData.country) setCountry(extractedData.country);
      if (extractedData.cities) setCities(extractedData.cities);
      if (extractedData.duration) setDuration(extractedData.duration);
      if (extractedData.travelType) setTravelType(extractedData.travelType);
      if (extractedData.price) setPrice(extractedData.price.toString());
      if (extractedData.shortDescription) setShortDescription(extractedData.shortDescription);
      if (extractedData.description) setDescription(extractedData.description);
      if (extractedData.details) setDetails(extractedData.details);
      if (extractedData.rating) setRating(extractedData.rating.toString());
      if (extractedData.reviewCount) setReviewCount(extractedData.reviewCount.toString());
      
      // Handle arrays
      if (extractedData.includedinprice && Array.isArray(extractedData.includedinprice)) {
        setIncludedInPrice(extractedData.includedinprice.filter(item => item.trim() !== ''));
      }
      if (extractedData.excludedinprice && Array.isArray(extractedData.excludedinprice)) {
        setExcludedInPrice(extractedData.excludedinprice.filter(item => item.trim() !== ''));
      }
      
      // Handle travel days
      if (extractedData.dayamount && extractedData.dayamount > 0) {
        setDayAmount(extractedData.dayamount);
        if (extractedData.travelDays && Array.isArray(extractedData.travelDays)) {
          // Set travel days after a brief delay to allow dayamount to update first
          setTimeout(() => {
            setTravelDays(extractedData.travelDays);
          }, 100);
        }
      }

      toast.success('Duomenys sėkmingai užpildyti!');
    } catch (error) {
      console.error('Error handling AI data:', error);
      toast.error('Klaida užpildant duomenis');
    }
  };

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

        {/* AI Document Parser - Only show for new trips */}
        {!_id && (
          <AIDocumentParser
            onDataExtracted={handleAIDataExtracted}
            isProcessing={isAIProcessing}
            setIsProcessing={setIsAIProcessing}
          />
        )}

        <form onSubmit={createProduct} className='space-y-6'>
          {/* Basic Information Card */}
          <BasicInfoCard
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
            categories={categories}
            errors={errors}
          />

          {/* Travel Details Card */}
          <TravelDetailsCard
            country={country}
            setCountry={setCountry}
            travelType={travelType}
            setTravelType={setTravelType}
            cities={cities}
            setCities={setCities}
            duration={duration}
            setDuration={setDuration}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
            rating={rating}
            setRating={setRating}
            reviewCount={reviewCount}
            setReviewCount={setReviewCount}
          />

          {/* Image Upload Card */}
          <ImageUploadCard
            images={images}
            setImages={setImages}
            uploadImages={uploadImages}
            updateImagesOrder={updateImagesOrder}
            handleDeleteImage={handleDeleteImage}
            isUploading={isUploading}
          />

          {/* Descriptions Card */}
          <DescriptionsCard
            description={description}
            setDescription={setDescription}
            details={details}
            setDetails={setDetails}
          />

          {/* Price Services Card */}
          <PriceServicesCard
            includedinprice={includedinprice}
            excludedinprice={excludedinprice}
            addIncludedItem={addIncludedItem}
            removeIncludedItem={removeIncludedItem}
            updateIncludedItem={updateIncludedItem}
            addExcludedItem={addExcludedItem}
            removeExcludedItem={removeExcludedItem}
            updateExcludedItem={updateExcludedItem}
          />

          {/* Travel Days Card */}
          <TravelDaysCard
            dayamount={dayamount}
            setDayAmount={setDayAmount}
            travelDays={travelDays}
            updateTravelDay={updateTravelDay}
            generateTravelDays={generateTravelDays}
          />

          {/* Legacy fields card (for backward compatibility) */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
                7
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Papildomi laukai (suderinamumui)
              </h2>
            </div>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Prekės ženklas
                </label>
                <input
                  type='text'
                  className='block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 transition-colors'
                  placeholder='Įveskite prekės ženklą...'
                  value={brand}
                  onChange={(ev) => setBrand(ev.target.value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Spalvos
                </label>
                <input
                  type='text'
                  className='block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 transition-colors'
                  placeholder='Įveskite spalvas...'
                  value={colors}
                  onChange={(ev) => setColors(ev.target.value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Lytis
                </label>
                <input
                  type='text'
                  className='block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 transition-colors'
                  placeholder='Įveskite lytį...'
                  value={gender}
                  onChange={(ev) => setGender(ev.target.value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Dydžiai
                </label>
                <input
                  type='text'
                  className='block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 transition-colors'
                  placeholder='Įveskite dydžius...'
                  value={sizes}
                  onChange={(ev) => setSizes(ev.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Actions Card */}
          <SubmitActionsCard
            isSaving={isSaving}
            onCancel={() => router.push('/products')}
          />
        </form>
      </div>
    </div>
  );
}
