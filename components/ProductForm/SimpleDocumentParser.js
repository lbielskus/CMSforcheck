import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../Spinner';

export default function SimpleDocumentParser({ onDataExtracted }) {
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function handleFileUpload(files) {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const response = await axios.post(
        '/api/simple-document-parser',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setExtractedData(response.data);
      setShowSuggestions(true);
      toast.success('Dokumentas apdorotas sėkmingai!');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Klaida apdorojant dokumentą');
    } finally {
      setIsUploading(false);
    }
  }

  function applySuggestions() {
    if (extractedData?.suggestions) {
      onDataExtracted(extractedData.suggestions);
      toast.success('Duomenys pritaikyti!');
      setShowSuggestions(false);
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-4'>
        <div className='w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          AI
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>
          Dokumento analizė
        </h3>
      </div>

      <p className='text-sm text-gray-600 mb-4'>
        Įkelkite kelionės dokumentą (.docx arba .txt) ir mes pabandysime išgauti
        informaciją automatiškai.
      </p>

      {/* File Upload Area */}
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4'>
        <input
          type='file'
          multiple
          accept='.docx,.doc,.txt'
          onChange={(e) => handleFileUpload(e.target.files)}
          className='hidden'
          id='document-upload'
          disabled={isUploading}
        />
        <label
          htmlFor='document-upload'
          className={`cursor-pointer ${
            isUploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className='space-y-2'>
            {isUploading ? (
              <Spinner className='mx-auto w-8 h-8' />
            ) : (
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
              >
                <path
                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
            <div className='text-sm text-gray-600'>
              <span className='font-medium text-blue-600'>
                Spustelėkite failų pasirinkimui
              </span>
              <p className='mt-1'>arba vilkite failus čia</p>
            </div>
            <p className='text-xs text-gray-500'>
              Palaikomi formatai: .docx, .doc, .txt (iki 10MB)
            </p>
          </div>
        </label>
      </div>

      {/* Extracted Data Display */}
      {showSuggestions && extractedData && (
        <div className='space-y-4'>
          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <h4 className='font-medium text-green-800 mb-3'>Rasti duomenys:</h4>

            <div className='space-y-2 text-sm'>
              {extractedData.suggestions.title && (
                <div>
                  <span className='font-medium text-gray-700'>
                    Pavadinimas:
                  </span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.title}
                  </span>
                </div>
              )}

              {extractedData.suggestions.country && (
                <div>
                  <span className='font-medium text-gray-700'>Šalis:</span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.country}
                  </span>
                </div>
              )}

              {extractedData.suggestions.cities && (
                <div>
                  <span className='font-medium text-gray-700'>Miestai:</span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.cities}
                  </span>
                </div>
              )}

              {extractedData.suggestions.duration && (
                <div>
                  <span className='font-medium text-gray-700'>Trukmė:</span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.duration}
                  </span>
                </div>
              )}

              {extractedData.suggestions.price && (
                <div>
                  <span className='font-medium text-gray-700'>Kaina:</span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.price}€
                  </span>
                </div>
              )}

              {extractedData.suggestions.dayamount > 0 && (
                <div>
                  <span className='font-medium text-gray-700'>
                    Dienų programa:
                  </span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.dayamount} dienos
                  </span>
                </div>
              )}

              {extractedData.suggestions.shortDescription && (
                <div>
                  <span className='font-medium text-gray-700'>
                    Trumpas aprašymas:
                  </span>
                  <span className='ml-2 text-gray-600'>
                    {extractedData.suggestions.shortDescription}
                  </span>
                </div>
              )}

              {extractedData.suggestions.includedinprice &&
                extractedData.suggestions.includedinprice.length > 0 && (
                  <div>
                    <span className='font-medium text-gray-700'>
                      Įtraukta į kainą:
                    </span>
                    <span className='ml-2 text-gray-600'>
                      {extractedData.suggestions.includedinprice
                        .slice(0, 3)
                        .join(', ')}
                      {extractedData.suggestions.includedinprice.length > 3 &&
                        '...'}
                    </span>
                  </div>
                )}

              {extractedData.suggestions.excludedinprice &&
                extractedData.suggestions.excludedinprice.length > 0 && (
                  <div>
                    <span className='font-medium text-gray-700'>
                      Neįtraukta į kainą:
                    </span>
                    <span className='ml-2 text-gray-600'>
                      {extractedData.suggestions.excludedinprice
                        .slice(0, 3)
                        .join(', ')}
                      {extractedData.suggestions.excludedinprice.length > 3 &&
                        '...'}
                    </span>
                  </div>
                )}
            </div>

            <div className='flex gap-2 mt-4'>
              <button
                type='button'
                onClick={applySuggestions}
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'
              >
                Pritaikyti duomenis
              </button>

              <button
                type='button'
                onClick={() => setShowSuggestions(false)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm'
              >
                Atšaukti
              </button>
            </div>
          </div>

          {/* Show raw extracted text */}
          {extractedData.extractedTexts &&
            extractedData.extractedTexts[0]?.content && (
              <details className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                <summary className='font-medium text-gray-700 cursor-pointer'>
                  Peržiūrėti išgautą tekstą
                </summary>
                <div className='mt-3 text-sm text-gray-600 max-h-40 overflow-y-auto whitespace-pre-wrap bg-white p-3 rounded border'>
                  {extractedData.extractedTexts[0].content}
                </div>
              </details>
            )}
        </div>
      )}
    </div>
  );
}
