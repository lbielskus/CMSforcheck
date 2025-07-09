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
    <>
      <header className='max-w-[900px] ml-16'>
        <div className='mx-auto px-2 py-6 sm:px-4 sm:py-8 lg:px-6 '>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-600 sm:text-2xl'>
              Visos kategorijos
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              {editedCategory ? (
                <>
                  Redaguojama kategorija,{' '}
                  <span className='text-green-600 font-bold'>
                    {editedCategory.name}
                  </span>{' '}
                  <span className='text-blue-500 font-bold'>
                    {editedCategory?.parent?.name}
                  </span>
                </>
              ) : (
                'Sukurkite naują kategoriją!'
              )}
            </p>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between items-center mt-4'>
            <form
              onSubmit={saveCategory}
              className='flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full'
            >
              <div className='w-full sm:max-w-xs'>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-500'>
                    +
                  </div>
                  <input
                    type='text'
                    className='block w-full rounded-md border border-slate-300 py-2 pl-8 pr-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
                    placeholder='Pavadinimas'
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                  />
                </div>
              </div>
              <div className='w-full sm:max-w-xs'>
                <select
                  className='block w-full rounded-md border border-slate-300 py-2 pl-2 pr-2 text-gray-500 focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50'
                  value={parentCategory}
                  onChange={(ev) => setParentCategory(ev.target.value)}
                >
                  <option>No parent</option>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className='w-full sm:max-w-xs'>
                {!isUploading && (
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={uploadImage}
                  />
                )}
                {isUploading && <Spinner />}
              </div>
              <div className='w-full sm:max-w-xs'>
                <textarea
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  className='block w-full rounded-md border border-slate-300 py-2 px-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50'
                  placeholder='Aprašymas'
                />
              </div>
              <button
                type='submit'
                className='rounded-md border border-blue-100 bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-200 focus:ring focus:ring-blue-50 disabled:border-blue-50 disabled:bg-blue-50 disabled:text-blue-400'
              >
                {editedCategory ? 'Išsaugoti pakeitimus' : 'Išsaugoti'}
              </button>
            </form>
          </div>
          <hr className='my-6 h-px border-0 bg-gray-300' />
        </div>
      </header>

      <div className='overflow-x-auto mx-auto p-2 mb-72 ml-32'>
        <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
          <table className='min-w-full divide-y divide-gray-200 bg-white text-sm border rounded'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-left font-bold'>
                  #
                </th>
                <th className='whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-left font-bold'>
                  Kategorija
                </th>
                <th className='whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-left font-bold'>
                  Tėvinė
                </th>
                <th className='whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-left font-bold'>
                  Veiksmai
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {categories.map((category, idx) => (
                <tr key={category._id}>
                  <td className='px-2 py-1 sm:px-3 sm:py-2'>{idx + 1}</td>
                  <td className='px-2 py-1 sm:px-3 sm:py-2'>{category.name}</td>
                  <td className='px-2 py-1 sm:px-3 sm:py-2'>
                    {category.parent ? category.parent.name : 'No parent'}
                  </td>
                  <td className='px-2 py-1 sm:px-3 sm:py-2'>
                    <div className='flex space-x-1'>
                      <button
                        onClick={() => editCategory(category)}
                        className='bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:bg-blue-200 focus:text-blue-800'
                      >
                        Redaguoti
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className='bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 hover:text-red-800 focus:outline-none focus:bg-red-200 focus:text-red-800'
                      >
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
    </>
  );
}
