import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AIDocumentParser({
  onDataExtracted,
  isProcessing,
  setIsProcessing,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const supportedFormats = [
    '.docx',
    '.doc',
    '.pdf',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = [...e.target.files];
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter((file) => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return supportedFormats.includes(extension);
    });

    if (validFiles.length === 0) {
      toast.error('Palaikomi formatai: Word, PDF, TXT, JPG, PNG');
      return;
    }

    setUploadedFiles(validFiles);
    await processFiles(validFiles);
  };

  const processFiles = async (files) => {
    setIsProcessing(true);
    toast.loading('Apdorojama su AI...', { id: 'processing' });

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/ai-document-parser', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Klaida apdorojant failus');
      }

      const extractedData = await response.json();

      // Call parent component with extracted data
      onDataExtracted(extractedData);

      toast.success('Duomenys sėkmingai išgauti!', { id: 'processing' });
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Klaida apdorojant failus', { id: 'processing' });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
      <div className='flex items-center mb-6'>
        <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3'>
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
            <path
              fillRule='evenodd'
              d='M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 11.5V5zm8 5H8v2h4v-2z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            AI Dokumentų analizė
          </h2>
          <p className='text-sm text-gray-600 mt-1'>
            Įkelkite kelionės dokumentus ir AI automatiškai užpildys formos
            laukus
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type='file'
          multiple
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          disabled={isProcessing}
        />

        <div className='space-y-4'>
          <div className='mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center'>
            {isProcessing ? (
              <div className='animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full'></div>
            ) : (
              <svg
                className='w-8 h-8 text-purple-600'
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
            )}
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {isProcessing
                ? 'Apdorojama su AI...'
                : 'Įkelkite kelionės dokumentus'}
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Vilkite failus čia arba spustelėkite pasirinkimui
            </p>

            <div className='flex flex-wrap gap-2 justify-center text-xs text-gray-500'>
              <span className='bg-gray-100 px-2 py-1 rounded'>
                Word (.docx)
              </span>
              <span className='bg-gray-100 px-2 py-1 rounded'>PDF</span>
              <span className='bg-gray-100 px-2 py-1 rounded'>TXT</span>
              <span className='bg-gray-100 px-2 py-1 rounded'>JPG/PNG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className='mt-6'>
          <h4 className='font-medium text-gray-900 mb-3'>Įkelti failai:</h4>
          <div className='space-y-2'>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between bg-gray-50 rounded-lg p-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-purple-100 rounded flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-purple-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 text-sm'>
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {!isProcessing && (
                  <button
                    onClick={() => removeFile(index)}
                    className='text-red-500 hover:text-red-700 p-1'
                    title='Pašalinti failą'
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
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Features Info */}
      <div className='mt-6 bg-purple-50 rounded-lg p-4'>
        <h4 className='font-medium text-purple-900 mb-2 flex items-center gap-2'>
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          AI automatiškai išgaus:
        </h4>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-purple-800'>
          <div>• Kelionės pavadinimą</div>
          <div>• Šalį ir miestus</div>
          <div>• Kelionės trukmę</div>
          <div>• Aprašymus ir detales</div>
          <div>• Dienų programas</div>
          <div>• Kainą (jei nurodyta)</div>
          <div>• Įskaičiuotas paslaugas</div>
          <div>• Neįskaičiuotas paslaugas</div>
        </div>
      </div>
    </div>
  );
}
