import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
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
  const [categories, setCategories] = useState([]);
  // Change category state to array
  const [category, setCategory] = useState(
    Array.isArray(selectedCategory)
      ? selectedCategory
      : selectedCategory
      ? [selectedCategory]
      : []
  );
  const [errors, setErrors] = useState({});

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

  function validate() {
    const errs = {};
    if (!title) errs.title = 'Antraštė yra privaloma';
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
      toast.error('Please fix validation errors');
      return;
    }

    setIsSaving(true);

    try {
      // Wait for any pending uploads to complete
      if (isUploading) {
        toast.info('Waiting for image uploads to complete...');
        // Wait up to 30 seconds for uploads to finish
        let waitTime = 0;
        while (isUploading && waitTime < 30000) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          waitTime += 500;
        }

        if (isUploading) {
          toast.error('Image uploads are taking too long. Please try again.');
          return;
        }
      }

      const data = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        details: details.trim(),
        images: images.filter((img) => img && img.trim() !== ''), // Filter out empty images
        category, // now an array
        brand: brand.trim(),
        gender: gender.trim(),
        sizes: sizes.trim(),
        colors: colors.trim(),
        // New travel-specific fields
        country: country.trim(),
        travelType: travelType.trim(),
        cities: cities.trim(),
        duration: duration.trim(),
        shortDescription: shortDescription.trim(),
        includedinprice: includedinprice.filter(
          (item) => item && item.trim() !== ''
        ),
        excludedinprice: excludedinprice.filter(
          (item) => item && item.trim() !== ''
        ),
        rating: rating ? parseFloat(rating) : null,
        reviewCount: reviewCount ? parseInt(reviewCount) : null,
        dayamount: parseInt(dayamount) || 1,
        travelDays: travelDays.filter(
          (day) => day && day.title && day.title.trim() !== ''
        ),
      };

      let response;
      if (_id) {
        response = await axios.put(
          '/api/products',
          { ...data, _id },
          {
            timeout: 30000, // 30 second timeout
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Travel package updated successfully!');
      } else {
        response = await axios.post('/api/products', data, {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success('Travel package created successfully!');
      }

      // Small delay before redirect to ensure toast is seen
      setTimeout(() => {
        setRedirect(true);
      }, 1000);
    } catch (error) {
      console.error('Error saving product:', error);

      let errorMessage = 'Failed to save travel package';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Save timeout - please try again';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error - check your connection';
      } else if (error.message.includes('SecurityError')) {
        errorMessage = 'Security error - please refresh the page and try again';
      }

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const uploadPromises = [];
      let successCount = 0;
      let errorCount = 0;

      for (const file of files) {
        // Validate file size and type
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 10MB)`);
          errorCount++;
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          errorCount++;
          continue;
        }

        const data = new FormData();
        data.append('file', file);

        const uploadPromise = axios
          .post('/api/upload', data, {
            timeout: 30000, // 30 second timeout
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            if (res.data.links && res.data.links.length > 0) {
              setImages((oldImages) => [...oldImages, ...res.data.links]);
              successCount++;
            }
          })
          .catch((error) => {
            console.error(`Error uploading ${file.name}:`, error);
            errorCount++;

            let errorMessage = 'Upload failed';
            if (error.response?.data?.error) {
              errorMessage = error.response.data.error;
            } else if (error.code === 'ECONNABORTED') {
              errorMessage =
                'Upload timeout - file too large or slow connection';
            } else if (error.message.includes('Network')) {
              errorMessage = 'Network error - check your connection';
            }

            toast.error(`${file.name}: ${errorMessage}`);
          });

        uploadPromises.push(uploadPromise);
      }

      try {
        await Promise.allSettled(uploadPromises);
      } catch (error) {
        console.error('Error in upload promises:', error);
      } finally {
        setIsUploading(false);

        if (successCount > 0) {
          toast.success(`Successfully uploaded ${successCount} image(s)`);
        }

        if (errorCount > 0 && successCount === 0) {
          toast.error(`Failed to upload ${errorCount} image(s)`);
        }
      }
    } else {
      toast.error('No files selected');
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
      if (extractedData.shortDescription)
        setShortDescription(extractedData.shortDescription);
      if (extractedData.description) setDescription(extractedData.description);
      if (extractedData.details) setDetails(extractedData.details);
      if (extractedData.rating) setRating(extractedData.rating.toString());
      if (extractedData.reviewCount)
        setReviewCount(extractedData.reviewCount.toString());

      // Handle arrays
      if (
        extractedData.includedinprice &&
        Array.isArray(extractedData.includedinprice)
      ) {
        setIncludedInPrice(
          extractedData.includedinprice.filter((item) => item.trim() !== '')
        );
      }
      if (
        extractedData.excludedinprice &&
        Array.isArray(extractedData.excludedinprice)
      ) {
        setExcludedInPrice(
          extractedData.excludedinprice.filter((item) => item.trim() !== '')
        );
      }

      // Handle travel days
      if (extractedData.dayamount && extractedData.dayamount > 0) {
        setDayAmount(extractedData.dayamount);
        if (
          extractedData.travelDays &&
          Array.isArray(extractedData.travelDays)
        ) {
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

        {/* Remove AI Document Parser */}
        {/* Remove Papildomi laukai (brand, colors, gender, sizes) section */}

        <form onSubmit={createProduct} className='space-y-6'>
          {/* Basic Information Card */}
          <BasicInfoCard
            title={title}
            setTitle={setTitle}
            categories={categories}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
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
