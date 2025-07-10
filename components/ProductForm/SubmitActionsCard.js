import Spinner from '../Spinner';

export default function SubmitActionsCard({ isSaving, onCancel }) {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
        <div className='text-sm text-gray-600'>
          <div className='flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-green-500'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <span>Peržiūrėkite informaciją ir išsaugokite kelionę</span>
          </div>
          <p className='text-xs text-gray-500 mt-1 ml-7'>
            Visi duomenys bus išsaugoti į duomenų bazę
          </p>
        </div>

        <div className='flex gap-4'>
          <button
            type='button'
            className='px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2'
            onClick={onCancel}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            Atšaukti
          </button>
          <button
            type='submit'
            className='px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner className='w-5 h-5' />
                Išsaugoma...
              </>
            ) : (
              <>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Išsaugoti kelionę
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
