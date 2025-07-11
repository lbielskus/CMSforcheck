import { adminDb } from '../../lib/firebaseAdmin';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GOLD FORMAT ENFORCEMENT HELPERS (top-level)
function toStringOrEmpty(val) {
  return typeof val === 'string'
    ? val
    : val === undefined || val === null
    ? ''
    : String(val);
}
function toArrayOfStrings(val) {
  if (Array.isArray(val)) return val.filter(Boolean).map(String);
  if (typeof val === 'string' && val) return [val];
  return [];
}
function toNumberOrZero(val) {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}
function toNullOrNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}
function toArrayOfObjects(val) {
  return Array.isArray(val) ? val.filter(Boolean) : [];
}
function goldProduct(obj = {}) {
  return {
    brand: toStringOrEmpty(obj.brand),
    category: Array.isArray(obj.category)
      ? obj.category[0] || ''
      : toStringOrEmpty(obj.category),
    cities: toStringOrEmpty(obj.cities),
    colors: toStringOrEmpty(obj.colors),
    country: toStringOrEmpty(obj.country),
    createdAt: toStringOrEmpty(obj.createdAt),
    dayamount: toNumberOrZero(obj.dayamount),
    description: toStringOrEmpty(obj.description),
    details: toStringOrEmpty(obj.details),
    duration: toStringOrEmpty(obj.duration),
    excludedinprice: toArrayOfStrings(obj.excludedinprice),
    gender: toStringOrEmpty(obj.gender),
    images: toArrayOfStrings(obj.images),
    includedinprice: toArrayOfStrings(obj.includedinprice),
    price: toNumberOrZero(obj.price),
    rating: toNullOrNumber(obj.rating),
    reviewCount: toNullOrNumber(obj.reviewCount),
    shortDescription: toStringOrEmpty(obj.shortDescription),
    sizes: toStringOrEmpty(obj.sizes),
    title: toStringOrEmpty(obj.title),
    travelDays: toArrayOfObjects(obj.travelDays),
    travelType: toStringOrEmpty(obj.travelType),
  };
}

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

      const normalized = {
        brand: toStringOrEmpty(brand),
        category: Array.isArray(category)
          ? category[0] || ''
          : toStringOrEmpty(category),
        cities: toStringOrEmpty(cities),
        colors: toStringOrEmpty(colors),
        country: toStringOrEmpty(country),
        createdAt: method === 'POST' ? new Date().toISOString() : undefined,
        dayamount: toNumberOrZero(dayamount),
        description: toStringOrEmpty(description),
        details: toStringOrEmpty(details),
        duration: toStringOrEmpty(duration),
        excludedinprice: toArrayOfStrings(excludedinprice),
        gender: toStringOrEmpty(gender),
        images: toArrayOfStrings(images),
        includedinprice: toArrayOfStrings(includedinprice),
        price: toNumberOrZero(price),
        rating: toNullOrNumber(rating),
        reviewCount: toNullOrNumber(reviewCount),
        shortDescription: toStringOrEmpty(shortDescription),
        sizes: toStringOrEmpty(sizes),
        title: toStringOrEmpty(title),
        travelDays: toArrayOfObjects(travelDays),
        travelType: toStringOrEmpty(travelType),
      };
      if (method === 'POST') {
        if (
          !normalized.title ||
          !normalized.description ||
          normalized.price === undefined ||
          normalized.price === null ||
          isNaN(normalized.price)
        ) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const docRef = await productsRef.add(normalized);
        const newDoc = await docRef.get();
        res.json({ id: docRef.id, ...goldProduct(newDoc.data()) });
        return;
      }
      if (method === 'PUT') {
        if (!_id) {
          return res.status(400).json({ error: 'Missing _id' });
        }
        delete normalized.createdAt; // don't overwrite createdAt on update
        normalized.updatedAt = new Date().toISOString();
        await productsRef.doc(_id).update(normalized);
        const updatedDoc = await productsRef.doc(_id).get();
        res.json({ id: updatedDoc.id, ...goldProduct(updatedDoc.data()) });
        return;
      }
    } else if (method === 'GET') {
      if (req.query?.id) {
        const doc = await productsRef.doc(req.query.id).get();
        if (!doc.exists) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json({ id: doc.id, ...goldProduct(doc.data()) });
      } else {
        const snapshot = await productsRef.get();
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...goldProduct(doc.data()),
        }));
        res.json(products);
      }
      return;
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
        : typeof category === 'string' && category
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
      res.json({ id: updatedDoc.id, ...goldProduct(updatedDoc.data()) });
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
