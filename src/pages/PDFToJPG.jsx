import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const PDFToJPG = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [conversionSettings, setConversionSettings] = useState({
    quality: 90,
    conversionType: 'all', // 'all' or 'range'
    pageRange: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    multiple: true,
    onDrop: acceptedFiles => {
      setPdfFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      setError(null);
    }
  });

  const removeFile = (index) => {
    setPdfFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setConversionSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdfFiles.length === 0) {
      setError('Please select at least one PDF file');
      return;
    }

    if (conversionSettings.conversionType === 'range' && !conversionSettings.pageRange) {
      setError('Please specify page range');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      pdfFiles.forEach(file => {
        formData.append('files', file);
        
      });

      Object.entries(conversionSettings).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch('http://localhost:5000/api/pdf/convert-to-jpg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFiles.length === 1
        ? `${pdfFiles[0].name.replace('.pdf', '')}_converted.zip`
        : 'converted_images.zip';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message.includes('<!DOCTYPE html>')
        ? 'Server error - check console for details'
        : error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Convert PDF to JPG Online</title>
          <meta name="description" content="Convert PDF files to high-quality JPG images. Extract pages or convert entire documents." />
        </Helmet>

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              PDF to JPG Converter
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert PDF files to high-quality JPG images.
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
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <img
                  src="/images/pdf.png"
                  alt="PDF icon"
                  width="72"
                  height="72"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your PDFs here</h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files (multiple allowed)</p>
              <button
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select PDF Files
              </button>
            </div>

            {/* Uploaded files list */}
            {pdfFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {pdfFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <div className="flex items-center min-w-0">
                        <svg className="flex-shrink-0 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="ml-3 overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove file"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conversion Options */}
            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Convert:</label>
                <select
                  name="conversionType"
                  value={conversionSettings.conversionType}
                  onChange={handleSettingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="all">All Pages</option>
                  <option value="range">Custom Range</option>
                </select>
              </div>

              {conversionSettings.conversionType === 'range' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Range (e.g., 1-3,5):</label>
                  <input
                    type="text"
                    name="pageRange"
                    value={conversionSettings.pageRange}
                    onChange={handleSettingChange}
                    placeholder="e.g., 1-3,5"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={pdfFiles.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </span>
                ) : (
                  'Convert to JPG'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PDFToJPG;
