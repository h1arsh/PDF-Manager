import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PNGToPDF = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [layoutOption, setLayoutOption] = useState('portrait');
  const [marginSize, setMarginSize] = useState('medium');
  const [quality, setQuality] = useState('high');
  const [fileName, setFileName] = useState('converted');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setSuccess(false);
    
    if (rejectedFiles.length > 0) {
      setError('Some files were rejected. Please only upload PNG, JPG, or WEBP images (max 10MB each).');
      return;
    }

    // Limit to 50 files maximum
    if (acceptedFiles.length + imageFiles.length > 50) {
      setError('You can upload a maximum of 50 images.');
      return;
    }

    // Add new files to existing ones
    setImageFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, [imageFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    },
    multiple: true,
    maxFiles: 50,
    maxSize: 10 * 1024 * 1024, // 10MB per file
    onDrop,
  });

  const totalFileSize = useMemo(() => {
    return imageFiles.reduce((sum, file) => sum + file.size, 0);
  }, [imageFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (imageFiles.length === 0) {
      setError('Please select at least one image file');
      return;
    }
    
    if (totalFileSize > 50 * 1024 * 1024) { // 50MB total limit
      setError('Total file size exceeds 50MB limit');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append(`images`, file);
      });
      formData.append('layout', layoutOption);
      formData.append('margin', marginSize);
      formData.append('quality', quality);
      formData.append('fileName', fileName || 'converted');

      const response = await fetch('http://localhost:5000/api/pdf/convert-png-to-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert images');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${fileName || 'converted'}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to convert images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    setError(null);
    setSuccess(false);
  };

  const clearAll = () => {
    setImageFiles([]);
    setError(null);
    setSuccess(false);
  };

  const moveFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= imageFiles.length) return;
    
    const newFiles = [...imageFiles];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setImageFiles(newFiles);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Helmet>
          <title>PDF Verse - PNG to PDF Converter</title>
          <meta name="description" content="Convert multiple PNG images to a single PDF document with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert PNG to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Combine multiple images into a single high-quality PDF file
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-colors cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your images here' : 'Drag and drop your images here'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Supports PNG, JPG, WEBP (Max 50 files, 10MB each)</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select Image Files
              </button>
              {imageFiles.length > 0 && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  {imageFiles.length} file{imageFiles.length !== 1 ? 's' : ''} selected • 
                  Total size: {(totalFileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                PDF created successfully! Your download should start automatically.
              </div>
            )}

            {/* Selected Files Preview */}
            {imageFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 overflow-hidden rounded border border-gray-200">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveFile(index, index - 1)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Move up"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        
                        {index < imageFiles.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveFile(index, index + 1)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Move down"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Name Input */}
            <div className="mt-6">
              <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                Output PDF File Name:
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter PDF file name"
                />
                <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  .pdf
                </span>
              </div>
            </div>

            {/* Conversion Options */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="layoutOption" className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Layout:
                </label>
                <select
                  id="layoutOption"
                  value={layoutOption}
                  onChange={(e) => setLayoutOption(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="auto">Auto (match image)</option>
                </select>
              </div>
              <div>
                <label htmlFor="marginSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Margin Size:
                </label>
                <select
                  id="marginSize"
                  value={marginSize}
                  onChange={(e) => setMarginSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">None</option>
                  <option value="small">Small (10px)</option>
                  <option value="medium">Medium (20px)</option>
                  <option value="large">Large (30px)</option>
                </select>
              </div>
              <div>
                <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Quality:
                </label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low (72 DPI)</option>
                  <option value="medium">Medium (150 DPI)</option>
                  <option value="high">High (300 DPI)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="w-full md:w-auto mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={imageFiles.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating PDF...
                  </span>
                ) : (
                  `Convert ${imageFiles.length} Image${imageFiles.length !== 1 ? 's' : ''} to PDF`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PNGToPDF;