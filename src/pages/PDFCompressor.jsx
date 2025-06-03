import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';

const PDFCompressor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
      setError(null);
    }
  });

  const removeFile = () => {
    setPdfFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('compressionLevel', compressionLevel);

      const response = await fetch('http://localhost:5000/api/pdf/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile.name.replace('.pdf', '')}_compressed.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while compressing the PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Verse - Compress PDF Files</title>
        <meta name="description" content="Compress your PDF files online without losing quality" />
      </Helmet>

      <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              PDF Compressor
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Compress your PDF files online without losing quality
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className="bg-yellow-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your PDF here</h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
              <button
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select PDF File
              </button>
            </div>

            {/* Uploaded File List */}
            {pdfFile && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Selected file:</h4>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center min-w-0">
                    <svg className="flex-shrink-0 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{pdfFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(pdfFile.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

             {/* Compression Options */}
            <div className="mt-8">
                <label htmlFor="compressionLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Compression Level:
                </label>
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
                {['low', 'medium', 'high'].map((level) => (
                    <div 
                    key={level}
                    className={`bg-yellow-100 p-4 border rounded-lg cursor-pointer transition-all ${
                        compressionLevel === level 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setCompressionLevel(level)}
                    >
                    <div className="flex items-center">
                        <input
                        type="radio"
                        id={level}
                        name="compressionLevel"
                        checked={compressionLevel === level}
                        onChange={() => setCompressionLevel(level)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={level} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                        {level} compression
                        </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-700">
                        {level === 'low' && 'Smaller size reduction, best quality'}
                        {level === 'medium' && 'Balanced size and quality'}
                        {level === 'high' && 'Maximum compression, reduced quality'}
                    </p>
                    </div>
                ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={!pdfFile || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compressing...
                  </span>
                ) : (
                  'Compress PDF'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PDFCompressor;
