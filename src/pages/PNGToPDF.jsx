import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const PNGToPDF = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [layoutOption, setLayoutOption] = useState('portrait');
  const [marginSize, setMarginSize] = useState('medium');
  const [quality, setQuality] = useState('high');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'] // Optional: include JPG if you want to support it too
    },
    multiple: true,
    onDrop: acceptedFiles => {
      setImageFiles(acceptedFiles);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      formData.append('layout', layoutOption);
      formData.append('margin', marginSize);
      formData.append('quality', quality);

      // This would be your API call in a real implementation
      console.log('Submitting PNGs for PDF conversion:', {
        files: imageFiles,
        layout: layoutOption,
        margin: marginSize,
        quality
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/png-to-pdf', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.blob();
      // Create download link for the generated PDF

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - PNG to PDF Converter</title>
          <meta name="description" content="Convert PNG images to PDF documents with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert PNG to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert PNG images into high-quality PDF files with our free online tool.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div 
              {...getRootProps()} 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your PNG images here</h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files (multiple allowed)</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select PNG Files
              </button>
              {imageFiles.length > 0 && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected files: {imageFiles.length}
                </p>
              )}
            </div>

            {/* Selected Files Preview */}
            {imageFiles.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Conversion Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
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
                  <option value="low">Low (smaller file)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (best quality)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
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
                  'Convert to PDF'
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