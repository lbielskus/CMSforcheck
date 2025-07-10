export default function BasicInfoCard({
  title,
  setTitle,
  category,
  setCategory,
  price,
  setPrice,
  categories,
  errors,
}) {
  return (
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
            Kategorija <span className='text-red-500'>*</span>
          </label>
          <select
            className={`block w-full rounded-lg border-2 p-4 text-lg ${
              errors.category
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-blue-500'
            } focus:ring-0 transition-colors`}
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
          >
            <option value='0'>Pasirinkite kategoriją...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
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
  );
}
