import { adminDb } from '../../lib/firebaseAdmin';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  const productsRef = adminDb.collection('products');
  const { method } = req;

  try {
    if (method === 'POST') {
      const {
        _id, // allow for update via POST if _id is present
        title,
        description,
        price,
        images,
        category,
        details,
        brand,
        gender,
        sizes,
        colors,
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
      } = req.body;

      // Normalize fields
      const normalizedCategory = Array.isArray(category)
        ? category.filter(Boolean).map(String)
        : category
        ? [String(category)]
        : [];
      const normalizedPrice =
        typeof price === 'number' ? price : Number(price) || 0;
      const normalizedIncluded = Array.isArray(includedinprice)
        ? includedinprice.filter(Boolean)
        : [];
      const normalizedExcluded = Array.isArray(excludedinprice)
        ? excludedinprice.filter(Boolean)
        : [];
      const normalizedImages = Array.isArray(images)
        ? images.filter(Boolean)
        : [];
      const normalizedRating =
        rating === null || rating === undefined ? null : Number(rating);
      const normalizedReviewCount =
        reviewCount === null || reviewCount === undefined
          ? null
          : Number(reviewCount);
      const normalizedTravelDays = Array.isArray(travelDays) ? travelDays : [];
      const normalizedDayAmount =
        typeof dayamount === 'number' ? dayamount : Number(dayamount) || 1;

      if (!title || !description || !normalizedPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // If _id is present, treat as update
      if (_id) {
        await productsRef.doc(_id).update({
          title,
          description,
          price: normalizedPrice,
          images: normalizedImages,
          category: normalizedCategory,
          details,
          brand,
          gender,
          sizes,
          colors,
          country,
          travelType,
          cities,
          duration,
          shortDescription,
          includedinprice: normalizedIncluded,
          excludedinprice: normalizedExcluded,
          rating: normalizedRating,
          reviewCount: normalizedReviewCount,
          dayamount: normalizedDayAmount,
          travelDays: normalizedTravelDays,
          updatedAt: new Date().toISOString(),
        });
        const updatedDoc = await productsRef.doc(_id).get();
        return res.json({ id: updatedDoc.id, ...updatedDoc.data() });
      }

      const docRef = await productsRef.add({
        title,
        description,
        price: normalizedPrice,
        images: normalizedImages,
        category: normalizedCategory,
        details,
        brand,
        gender,
        sizes,
        colors,
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice: normalizedIncluded,
        excludedinprice: normalizedExcluded,
        rating: normalizedRating,
        reviewCount: normalizedReviewCount,
        dayamount: normalizedDayAmount,
        travelDays: normalizedTravelDays,
        createdAt: new Date().toISOString(),
      });

      const newDoc = await docRef.get();
      res.json({ id: docRef.id, ...newDoc.data() });
    } else if (method === 'GET') {
      if (req.query?.id) {
        const doc = await productsRef.doc(req.query.id).get();
        if (!doc.exists) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
      } else {
        const snapshot = await productsRef.get();
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.json(products);
      }
    } else if (method === 'PUT') {
      const {
        title,
        description,
        price,
        _id,
        images,
        category,
        details,
        brand,
        gender,
        sizes,
        colors,
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
      } = req.body;

      // Normalize fields
      const normalizedCategory = Array.isArray(category)
        ? category.filter(Boolean).map(String)
        : category
        ? [String(category)]
        : [];
      const normalizedPrice =
        typeof price === 'number' ? price : Number(price) || 0;
      const normalizedIncluded = Array.isArray(includedinprice)
        ? includedinprice.filter(Boolean)
        : [];
      const normalizedExcluded = Array.isArray(excludedinprice)
        ? excludedinprice.filter(Boolean)
        : [];
      const normalizedImages = Array.isArray(images)
        ? images.filter(Boolean)
        : [];
      const normalizedRating =
        rating === null || rating === undefined ? null : Number(rating);
      const normalizedReviewCount =
        reviewCount === null || reviewCount === undefined
          ? null
          : Number(reviewCount);
      const normalizedTravelDays = Array.isArray(travelDays) ? travelDays : [];
      const normalizedDayAmount =
        typeof dayamount === 'number' ? dayamount : Number(dayamount) || 1;

      if (!_id) {
        return res.status(400).json({ error: 'Missing _id' });
      }

      await productsRef.doc(_id).update({
        title,
        description,
        price: normalizedPrice,
        images: normalizedImages,
        category: normalizedCategory,
        details,
        brand,
        gender,
        sizes,
        colors,
        country,
        travelType,
        cities,
        duration,
        shortDescription,
        includedinprice: normalizedIncluded,
        excludedinprice: normalizedExcluded,
        rating: normalizedRating,
        reviewCount: normalizedReviewCount,
        dayamount: normalizedDayAmount,
        travelDays: normalizedTravelDays,
        updatedAt: new Date().toISOString(),
      });

      const updatedDoc = await productsRef.doc(_id).get();
      res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } else if (method === 'DELETE') {
      if (req.query?.id) {
        // Fetch the product to get its images
        const doc = await productsRef.doc(req.query.id).get();
        const data = doc.data();
        const images = data?.images || [];
        // Delete images from Cloudinary
        for (const imageUrl of images) {
          if (
            typeof imageUrl === 'string' &&
            imageUrl.includes('cloudinary.com')
          ) {
            // Extract public_id from the URL
            const matches = imageUrl.match(/ecommerce-app\/([^./]+)\./);
            const publicId = matches ? `ecommerce-app/${matches[1]}` : null;
            if (publicId) {
              try {
                await cloudinary.v2.uploader.destroy(publicId);
              } catch (err) {
                console.error('Cloudinary delete error:', err);
              }
            }
          }
        }
        await productsRef.doc(req.query.id).delete();
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Missing id' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
