import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebaseClient'; // adjust path if needed

export default function Categories({ existingImages }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [editedMedia, setEditedMedia] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [firstBanner, setFirstBanner] = useState(false);
  const [secondBanner, setSecondBanner] = useState(false);
  const [banners, setBanners] = useState({
    firstBanner: false,
    secondBanner: false,
  });

  const [route, setRoute] = useState('');

  const uploadImagesQueue = [];

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchCategories();
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  function fetchCategories() {
    axios
      .get('/api/images')
      .then((result) => {
        setCategories(result.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      });
  }

  async function saveMedia(ev) {
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
      description,
      images,
      firstBanner: firstBanner,
      secondBanner: secondBanner,
      route,
    };
    if (editedMedia) {
      data._id = editedMedia._id;
      try {
        await axios.put('/api/images', data);
        setEditedMedia(null);
        toast.success('Nuotrauka atnaujinta!');
      } catch (error) {
        console.error('Nepavyko įkelti nuotraukos:', error);
        toast.error('Nepavyko atnaujinti nuotraukos info');
      }
    } else {
      try {
        await axios.post('/api/images', data);
        toast.success('Nuotrauka sukurta sėkmingai');
        setName('');
        setDescription('');
        setImages([]);
        setFirstBanner(false);
        setSecondBanner(false);
        fetchCategories();
      } catch (error) {
        console.error('Klaida kuriant nuotrauką:', error);
        toast.error('Nepavyko sukurti nuotraukos');
      }
    }
  }

  function editMedia(Media) {
    setEditedMedia(Media);
    setName(Media.name);
    setDescription(Media.description);
  }

  async function deleteMedia(Media) {
    const { _id } = Media;
    try {
      await axios.delete('/api/images?_id=' + _id);
      fetchCategories();
      toast.success('Media deleted!!');
    } catch (error) {
      console.error('Error deleting Media:', error);
      toast.error('Failed to delete Media');
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

  function handleCheckboxChange(ev, type) {
    const isChecked = ev.target.checked;
    if (type === 'firstBanner') {
      setFirstBanner(isChecked);
    } else if (type === 'secondBanner') {
      setSecondBanner(isChecked);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <header>
        <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 max-w-screen-lg'>
          <div className='flex flex-col sm:flex-col items-center justify-between'>
            <div className='text-center sm:text-left'>
              <h1 className='text-3xl font-bold text-gray-600 sm:text-3xl mr-10 text-center sm:text-center'>
                Nuotraukos
              </h1>
              <p className='mt-1.5 text-md text-gray-500'>
                <span>
                  {editedMedia ? (
                    <>
                      Redaguojama nuotrauka,
                      <span className='text-green-600 font-bold'>
                        {editedMedia.name}
                      </span>
                    </>
                  ) : (
                    'Įkelkite viršelio nuotrauką!'
                  )}
                </span>
              </p>
            </div>
            <form
              onSubmit={saveMedia}
              className='mt-4 flex flex-col sm:flex-row gap-4 sm:mt-3 sm:items-center max-w-lg'
            >
              <div className='flex flex-col'>
                <input
                  type='text'
                  id='example11'
                  className='input-field mb-4 border-2'
                  placeholder='Nuotraukos pavadinimas'
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  required
                />
                <textarea
                  className='input-field mb-4 border-2'
                  placeholder='Aprašymas'
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                ></textarea>
                <input
                  type='text'
                  id='route'
                  className='input-field mb-4 border-2'
                  placeholder='Nuoroda'
                  value={route}
                  onChange={(ev) => setRoute(ev.target.value)}
                />
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <label className='inline-flex items-center mr-6 my-8'>
                    <input
                      type='checkbox'
                      className='form-checkbox h-5 w-5 text-blue-600'
                      onChange={(ev) => handleCheckboxChange(ev, 'firstBanner')}
                      checked={firstBanner}
                    />
                    <span className='ml-2 text-gray-700'>1st Banner</span>
                  </label>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox'
                      className='form-checkbox h-5 w-5 text-blue-600'
                      onChange={(ev) =>
                        handleCheckboxChange(ev, 'secondBanner')
                      }
                      checked={secondBanner}
                    />
                    <span className='ml-2 text-gray-700'>2nd Banner</span>
                  </label>
                </div>
                <div className='flex items-center my-6 '>
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
                <button
                  type='submit'
                  className='save-button mt-4 sm:mt-0  bg-green-600 w-48 h-10 text-center rounded-2xl text-white'
                >
                  {editedMedia ? 'Save changes' : 'Išsaugoti nuotrauką'}
                </button>
              </div>
            </form>
          </div>
          <hr className='my-8 h-px border-0 bg-gray-300' />
        </div>
      </header>

      <div className={`overflow-x-auto mx-auto p-4 max-w-screen-lg`}>
        <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
          <table className='min-w-full divide-y divide-gray-200 bg-white text-md border rounded mb-44'>
            <thead className='bg-gray-50 text-xs sm:text-md'>
              <tr>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  #
                </th>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  Foto
                </th>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  Media
                </th>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  Aprašymas
                </th>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  1st Banner
                </th>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  2nd Banner
                </th>
                <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                  Veiksmai
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 text-xs sm:text-md'>
              {categories.map((media, idx) => (
                <tr key={media._id}>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>{idx + 1}</td>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>
                    {media.images.length > 0 && (
                      <img
                        src={media.images[0]}
                        alt={media.name}
                        className='h-10 w-10 object-cover rounded-full'
                      />
                    )}
                  </td>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>{media.name}</td>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>
                    {media.description}
                  </td>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>
                    {media.firstBanner ? 'True' : 'False'}
                  </td>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>
                    {media.secondBanner ? 'True' : 'False'}
                  </td>
                  <td className='px-2 py-2 sm:px-4 sm:py-3'>
                    <div className='flex space-x-1'>
                      <button
                        onClick={() => editMedia(media)}
                        className='bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:bg-blue-200 focus:text-blue-800'
                      >
                        Redaguoti
                      </button>
                      <button
                        onClick={() => deleteMedia(media)}
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
