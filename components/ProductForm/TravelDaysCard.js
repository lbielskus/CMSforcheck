import TinyMCEEditor from '../TinyMCEEditor';

export default function TravelDaysCard({
  dayamount,
  setDayAmount,
  travelDays,
  updateTravelDay,
}) {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-6'>
        <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          6
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>Kelionės dienos</h2>
      </div>

      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Dienų skaičius
        </label>
        <div className='flex items-center gap-4'>
          <input
            className='w-32 rounded-lg border-2 border-gray-200 p-3 focus:border-teal-500 focus:ring-0 transition-colors text-center text-lg font-semibold'
            placeholder='1'
            type='number'
            min='1'
            max='30'
            value={dayamount}
            onChange={(ev) => setDayAmount(parseInt(ev.target.value) || 1)}
          />
          <div className='flex items-center text-sm text-gray-600'>
            <svg
              className='w-4 h-4 mr-1'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            Automatiškai sugeneruos dienų laukus
          </div>
        </div>
      </div>

      {travelDays.length > 0 && (
        <div className='space-y-6'>
          <div className='flex items-center justify-between border-b border-gray-200 pb-2'>
            <h3 className='text-lg font-medium text-gray-700'>
              Dienų aprašymai
            </h3>
            <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
              {travelDays.length} {travelDays.length === 1 ? 'diena' : 'dienos'}
            </span>
          </div>

          {travelDays.map((day, index) => (
            <div
              key={day.day}
              className='bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-5 border-l-4 border-teal-500'
            >
              <div className='flex items-center mb-4'>
                <div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 shadow-lg'>
                  {day.day}
                </div>
                <div className='flex-1'>
                  <h4 className='text-lg font-medium text-gray-800'>
                    {day.day}-a diena
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Užpildykite dienos informaciją
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Dienos pavadinimas
                  </label>
                  <input
                    className='w-full rounded-lg border-2 border-white bg-white p-3 focus:border-teal-500 focus:ring-0 transition-colors shadow-sm'
                    placeholder={`${day.day}-a diena: Pavadinimas...`}
                    value={day.title}
                    onChange={(ev) =>
                      updateTravelDay(index, 'title', ev.target.value)
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Dienos aprašymas
                  </label>
                  <div className='border-2 border-white bg-white rounded-lg overflow-hidden'>
                    <TinyMCEEditor
                      value={day.description}
                      onEditorChange={(content) =>
                        updateTravelDay(index, 'description', content)
                      }
                    />
                  </div>
                  <div className='flex items-center mt-2 text-xs text-gray-500'>
                    <svg
                      className='w-3 h-3 mr-1'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {day.description.length} simbolių
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {travelDays.length === 0 && (
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
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p>Nustatykite dienų skaičių, kad pasirodytų aprašymų laukai</p>
        </div>
      )}
    </div>
  );
}
