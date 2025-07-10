import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebaseClient'; // adjust path if needed

export default function Categories({ existingImages }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [editedCategory, setEditedCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImagesQueue = [];
  const [description, setDescription] = useState('');

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchCategories();
      }
    });
    return () => unsubscribe();
  }, []);

  function fetchCategories() {
    axios
      .get('/api/categories')
      .then((result) => {
        setCategories(result.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    if (isUploading) {
      await Promise.all(uploadImagesQueue);
    }
    if (!name) {
      toast.error('Name field is required');
      return;
    }

    const data = {
      name,
      parentCategoryId: parentCategory,
      images,
      description,
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      try {
        await axios.put('/api/categories', data);
        setEditedCategory(null);
        toast.success('Category updated!!');
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
      }
    } else {
      try {
        await axios.post('/api/categories', data);
        toast.success('Category created successfully');
        setName('');
        setImages([]);
        setParentCategory('');
        fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
        toast.error('Failed to create category');
      }
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  async function deleteCategory(category) {
    const { id } = category;
    try {
      await axios.delete('/api/categories?_id=' + id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success('Category deleted!!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  }

  async function uploadImage(ev) {
    if (!ev || !ev.target || !ev.target.files) {
      console.error('Invalid event object:', ev);
      return;
    }

    const files = ev.target.files || [];
    if (files.length > 0) {
      setIsUploading(true);
      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          const response = await axios.post('/api/upload', formData);
          const uploadedImage = response.data.links[0];

          setImages((prevImages) => [...prevImages, uploadedImage]);
        }
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
                Kategorijos
              </h1>
              <p className='text-gray-600'>
                {editedCategory ? (
                  <>
                    Redaguojama kategorija:{' '}
                    <span className='font-semibold text-purple-600'>
                      {editedCategory.name}
                    </span>
                    {editedCategory?.parent?.name && (
                      <>
                        {' '}
                        (tėvinė:{' '}
                        <span className='text-gray-900'>
                          {editedCategory.parent.name}
                        </span>
                        )
                      </>
                    )}
                  </>
                ) : (
                  'Valdykite visas kategorijas vienoje vietoje'
                )}
              </p>
            </div>
            <div className='text-sm text-gray-500'>
              Iš viso:{' '}
              <span className='font-semibold text-gray-900'>
                {categories.length}
              </span>
            </div>
          </div>

          {/* Category Form */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              {editedCategory
                ? 'Redaguoti kategoriją'
                : 'Pridėti naują kategoriją'}
            </h2>
            <form onSubmit={saveCategory} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Pavadinimas
                  </label>
                  <input
                    type='text'
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                    placeholder='Įveskite kategorijos pavadinimą'
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Tėvinė kategorija
                  </label>
                  <select
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                    value={parentCategory}
                    onChange={(ev) => setParentCategory(ev.target.value)}
                  >
                    <option value=''>Nėra tėvinės</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nuotrauka
                  </label>
                  {!isUploading ? (
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={uploadImage}
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100'
                    />
                  ) : (
                    <div className='flex items-center justify-center w-full h-12 bg-gray-50 rounded-xl'>
                      <Spinner />
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Aprašymas
                  </label>
                  <textarea
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none'
                    placeholder='Kategorijos aprašymas'
                    rows={1}
                  />
                </div>
              </div>

              <div className='flex justify-end pt-4'>
                {editedCategory && (
                  <button
                    type='button'
                    onClick={() => {
                      setEditedCategory(null);
                      setName('');
                      setParentCategory('');
                      setDescription('');
                      setImages([]);
                    }}
                    className='mr-4 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors'
                  >
                    Atšaukti
                  </button>
                )}
                <button
                  type='submit'
                  className='px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all hover:shadow-lg hover:scale-105'
                >
                  {editedCategory
                    ? 'Išsaugoti pakeitimus'
                    : 'Sukurti kategoriją'}
                </button>
              </div>
            </form>
          </div>

          {/* Categories Table */}
          {categories.length === 0 ? (
            <div className='text-center py-20'>
              <div className='mb-6'>
                <svg
                  className='mx-auto h-24 w-24 text-gray-300'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-medium text-gray-900 mb-2'>
                Kategorijų nėra
              </h3>
              <p className='text-gray-500'>
                Pradėkite kurdami savo pirmą kategoriją naudodami formą aukščiau
              </p>
            </div>
          ) : (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Kategorija
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Tėvinė kategorija
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Aprašymas
                      </th>
                      <th className='px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Veiksmai
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {categories.map((category, idx) => (
                      <tr
                        key={category._id}
                        className='hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            {category.images && category.images.length > 0 && (
                              <div className='flex-shrink-0 h-10 w-10 mr-4'>
                                <img
                                  src={category.images[0]}
                                  alt={category.name}
                                  className='h-10 w-10 rounded-lg object-cover'
                                />
                              </div>
                            )}
                            <div>
                              <div className='text-sm font-medium text-gray-900'>
                                {category.name}
                              </div>
                              <div className='text-sm text-gray-500'>
                                #{idx + 1}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              category.parent
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {category.parent
                              ? category.parent.name
                              : 'Nėra tėvinės'}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-sm text-gray-900 max-w-xs truncate'>
                            {category.description || '—'}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex items-center justify-end gap-2'>
                            <button
                              onClick={() => editCategory(category)}
                              className='inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors'
                            >
                              <svg
                                className='w-4 h-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                />
                              </svg>
                              Redaguoti
                            </button>
                            <button
                              onClick={() => deleteCategory(category)}
                              className='inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'
                            >
                              <svg
                                className='w-4 h-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                />
                              </svg>
                              Ištrinti
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
