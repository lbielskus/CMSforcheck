import Spinner from '../Spinner';

export default function ImageUploadCard({
  images,
  setImages,
  isUploading,
  uploadImages,
  handleDeleteImage,
}) {
  function updateImagesOrder(newImages) {
    setImages(newImages);
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-6'>
        <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          3
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>Nuotraukos</h2>
      </div>

      <div className='mb-6'>
        <label
          htmlFor='fileInput'
          className='flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors'
        >
          <div className='text-center'>
            <svg
              className='w-8 h-8 text-gray-400 mx-auto mb-2'
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
            <p className='text-sm text-gray-600'>
              <span className='font-medium text-purple-600'>
                Spustelėkite įkėlimui
              </span>{' '}
              arba vilkite failus čia
            </p>
            <p className='text-xs text-gray-500 mt-1'>PNG, JPG, GIF iki 10MB</p>
          </div>
        </label>
        <input
          id='fileInput'
          type='file'
          className='hidden'
          accept='image/*'
          multiple
          onChange={uploadImages}
        />
        {isUploading && (
          <div className='flex items-center justify-center mt-4'>
            <Spinner className='w-6 h-6 mr-2' />
            <span className='text-sm text-gray-600'>
              Įkeliamos nuotraukos...
            </span>
          </div>
        )}
      </div>

      {!isUploading && images.length === 0 && (
        <div className='text-center py-8 text-gray-400'>
          <svg
            className='w-12 h-12 mx-auto mb-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p>Nėra įkeltų nuotraukų</p>
        </div>
      )}

      {!isUploading && images.length > 0 && (
        <div>
          <p className='text-sm text-gray-600 mb-4'>
            {images.length} nuotrauk{images.length === 1 ? 'a' : 'os'}.
          </p>
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
  );
}
