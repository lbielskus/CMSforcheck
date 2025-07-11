export default function BasicInfoCard({
  title,
  setTitle,
  categories,
  category,
  setCategory,
  price,
  setPrice,
  errors,
}) {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6'>
      <div className='flex flex-col sm:flex-row items-center mb-4 sm:mb-6 gap-2 sm:gap-0'>
        <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          1
        </div>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
          Pagrindinė informacija
        </h2>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
            Kelionės pavadinimas <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            className={`block w-full rounded-lg border-2 p-3 sm:p-4 text-base sm:text-lg ${
              errors.title
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-blue-500'
            } focus:ring-0 transition-colors`}
            placeholder='Įveskite kelionės pavadinimą...'
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          {errors.title && (
            <p className='text-red-500 text-xs sm:text-sm mt-1 flex items-center'>
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
          <label className='block text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
            Kategorija <span className='text-red-500'>*</span>
          </label>
          <select
            className='block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-3 transition-colors'
            value={category || ''}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=''>Pasirinkite kategoriją</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className='text-red-500 text-xs sm:text-sm mt-1 flex items-center'>
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
          <label className='block text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
            Kaina (€) <span className='text-red-500'>*</span>
          </label>
          <div className='relative flex items-center'>
            <span className='absolute left-3 text-gray-500 text-base sm:text-lg pointer-events-none'>
              €
            </span>
            <input
              type='number'
              className={`block w-full rounded-lg border-2 p-3 sm:p-4 text-base sm:text-lg pl-8 ${
                errors.price
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
              } focus:ring-0 transition-colors`}
              placeholder='0'
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          {errors.price && (
            <p className='text-red-500 text-xs sm:text-sm mt-1 flex items-center'>
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
  );
}
