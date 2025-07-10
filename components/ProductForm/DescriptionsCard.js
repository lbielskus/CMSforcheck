import TinyMCEEditor from '../TinyMCEEditor';

export default function DescriptionsCard({
  description,
  setDescription,
  details,
  setDetails,
}) {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-6'>
        <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          4
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>Aprašymai</h2>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Detalus aprašymas
          </label>
          <div className='border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-orange-500 transition-colors'>
            <TinyMCEEditor
              value={description}
              onEditorChange={(content) => setDescription(content)}
            />
          </div>
          <p className='text-xs text-gray-500 mt-2'>
            Pilnas kelionės aprašymas su formatavimo galimybėmis.
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Trumpas aprašymas (sąrašams)
          </label>
          <div className='border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-orange-500 transition-colors'>
            <TinyMCEEditor
              value={details}
              onEditorChange={(content) => setDetails(content)}
            />
          </div>
          <p className='text-xs text-gray-500 mt-2'>
            Trumpas tekstas, rodomas kelionių sąrašuose ir kortelėse.
          </p>
        </div>
      </div>
    </div>
  );
}
