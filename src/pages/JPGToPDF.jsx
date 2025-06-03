import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const JPGToPDF = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [layoutOption, setLayoutOption] = useState('portrait');
  const [marginSize, setMarginSize] = useState('medium');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setSuccess(false);
    
    if (rejectedFiles.length > 0) {
      setError(`Some files were rejected. Please only upload JPG/JPEG images (max 20MB each).`);
      return;
    }

    // Limit to 20 files maximum
    if (acceptedFiles.length + imageFiles.length > 20) {
      setError('You can upload a maximum of 20 images.');
      return;
    }

    // Add new files to existing ones
    setImageFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, [imageFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: true,
    maxFiles: 20,
    maxSize: 20 * 1024 * 1024, // 20MB
    onDrop,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setError('Please select at least one image to convert.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
        // Include original file names in order
        formData.append('filenames', file.name);
      });
      formData.append('layout', layoutOption);
      formData.append('margin', marginSize);

      const response = await fetch('http://localhost:5000/api/pdf/convert-jpg-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Conversion failed');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'converted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred during conversion. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    setError(null);
  };

  const reorderImage = (fromIndex, toIndex) => {
    const newFiles = [...imageFiles];
    const [removed] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, removed);
    setImageFiles(newFiles);
  };

  const clearAll = () => {
    setImageFiles([]);
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Helmet>
          <title>PDF Verse - JPG to PDF Converter</title>
          <meta name="description" content="Convert JPG images to PDF documents with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert JPG to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto">
            Convert multiple JPG images into a single PDF file with customizable layout options.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div 
              {...getRootProps()} 
              className={`bg-yellow-100 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your JPG images here' : 'Drag and drop your JPG images here'}
              </h3>
              <p className="mt-1 text-sm text-gray-700">or click to browse files (max 20 images, 20MB each)</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select JPG Files
              </button>
              {imageFiles.length > 0 && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  {imageFiles.length} file{imageFiles.length !== 1 ? 's' : ''} selected
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
                  <h3 className="text-lg font-medium text-gray-900">
                    Selected Images ({imageFiles.length})
                  </h3>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {imageFiles.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`} 
                      className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-shrink-0 relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${index}`}
                          className="w-16 h-16 object-cover rounded border border-gray-300"
                        />
                        <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div className="flex space-x-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => reorderImage(index, index - 1)}
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
                            onClick={() => reorderImage(index, index + 1)}
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

            {/* Conversion Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="layoutOption" className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Layout:
                </label>
                <select
                  id="layoutOption"
                  value={layoutOption}
                  onChange={(e) => setLayoutOption(e.target.value)}
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="portrait">Portrait (8.5 × 11 in)</option>
                  <option value="landscape">Landscape (11 × 8.5 in)</option>
                  <option value="auto">Auto (match image orientation)</option>
                  <option value="square">Square (8.5 × 8.5 in)</option>
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
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Small (0.25 in)</option>
                  <option value="medium">Medium (0.5 in)</option>
                  <option value="large">Large (1 in)</option>
                  <option value="none">No Margin</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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

export default JPGToPDF;