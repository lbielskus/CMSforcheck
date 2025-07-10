import TinyMCEEditor from '../TinyMCEEditor';

export default function TravelDetailsCard({
  country,
  setCountry,
  travelType,
  setTravelType,
  duration,
  setDuration,
  cities,
  setCities,
  shortDescription,
  setShortDescription,
  rating,
  setRating,
  reviewCount,
  setReviewCount,
}) {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-6'>
        <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          2
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>
          Kelionės informacija
        </h2>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Šalis
            </label>
            <input
              className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors'
              placeholder='pvz., Lietuva'
              value={country}
              onChange={(ev) => setCountry(ev.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Kelionės tipas
            </label>
            <input
              className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors'
              placeholder='pvz., Aktyvus turizmas'
              value={travelType}
              onChange={(ev) => setTravelType(ev.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Trukmė
            </label>
            <input
              className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors'
              placeholder='pvz., 2 dienos'
              value={duration}
              onChange={(ev) => setDuration(ev.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Lankomi miestai
            </label>
            <input
              className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors'
              placeholder='pvz., Vilnius, Kaunas'
              value={cities}
              onChange={(ev) => setCities(ev.target.value)}
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Pagrindinė informacija
          </label>
          <div className='border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-green-500 transition-colors'>
            <TinyMCEEditor
              value={shortDescription}
              onEditorChange={(content) => setShortDescription(content)}
            />
          </div>
          <p className='text-xs text-gray-500 mt-2'>
            Pagrindinė kelionės informacija, rodoma kelionės puslapyje.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Įvertinimas
              <span className='text-xs text-gray-500 ml-1'>(0-5)</span>
            </label>
            <div className='relative'>
              <input
                type='number'
                step='0.1'
                min='0'
                max='5'
                className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors pr-12'
                placeholder='4.8'
                value={rating}
                onChange={(ev) => setRating(ev.target.value)}
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <svg
                  className='w-5 h-5 text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Atsiliepimų skaičius
            </label>
            <div className='relative'>
              <input
                type='number'
                min='0'
                className='block w-full rounded-lg border-2 border-gray-200 p-3 focus:border-green-500 focus:ring-0 transition-colors pr-16'
                placeholder='127'
                value={reviewCount}
                onChange={(ev) => setReviewCount(ev.target.value)}
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 text-sm'>atsil.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
