export default function PriceServicesCard({
  includedinprice,
  setIncludedInPrice,
  excludedinprice,
  setExcludedInPrice,
  addIncludedItem,
  removeIncludedItem,
  updateIncludedItem,
  addExcludedItem,
  removeExcludedItem,
  updateExcludedItem,
}) {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-6'>
        <div className='w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          5
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>
          Kainoje įskaičiuota / neįskaičiuota
        </h2>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Included in price */}
        <div>
          <h3 className='text-lg font-medium text-green-700 mb-4 flex items-center'>
            <svg
              className='w-5 h-5 mr-2 text-green-600'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            Kainoje įskaičiuota
          </h3>
          <div className='space-y-3'>
            {includedinprice.map((item, index) => (
              <div key={index} className='flex gap-2'>
                <div className='flex-shrink-0 w-8 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  className='flex-1 rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors'
                  placeholder='Įrašykite ką įskaičiuoja kaina...'
                  value={item}
                  onChange={(ev) => updateIncludedItem(index, ev.target.value)}
                />
                <button
                  type='button'
                  onClick={() => removeIncludedItem(index)}
                  className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  title='Pašalinti'
                >
                  <svg
                    className='w-5 h-5'
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
              </div>
            ))}
            <button
              type='button'
              onClick={addIncludedItem}
              className='w-full px-4 py-3 text-green-600 border-2 border-green-200 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Pridėti įskaičiuotą elementą
            </button>
          </div>
        </div>

        {/* Excluded from price */}
        <div>
          <h3 className='text-lg font-medium text-red-700 mb-4 flex items-center'>
            <svg
              className='w-5 h-5 mr-2 text-red-600'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            Kainoje neįskaičiuota
          </h3>
          <div className='space-y-3'>
            {excludedinprice.map((item, index) => (
              <div key={index} className='flex gap-2'>
                <div className='flex-shrink-0 w-8 h-10 bg-red-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-red-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  className='flex-1 rounded-lg border-2 border-gray-200 p-3 focus:border-red-500 focus:ring-0 transition-colors'
                  placeholder='Įrašykite ką neįskaičiuoja kaina...'
                  value={item}
                  onChange={(ev) => updateExcludedItem(index, ev.target.value)}
                />
                <button
                  type='button'
                  onClick={() => removeExcludedItem(index)}
                  className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  title='Pašalinti'
                >
                  <svg
                    className='w-5 h-5'
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
              </div>
            ))}
            <button
              type='button'
              onClick={addExcludedItem}
              className='w-full px-4 py-3 text-red-600 border-2 border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Pridėti neįskaičiuotą elementą
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
