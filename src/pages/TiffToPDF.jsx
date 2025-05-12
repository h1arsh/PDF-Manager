import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const TIFFToPDF = () => {
  const [tiffFiles, setTiffFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputQuality, setOutputQuality] = useState('high');
  const [pageSize, setPageSize] = useState('auto');
  const [multiPage, setMultiPage] = useState('single');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/tiff': ['.tif', '.tiff'],
      'image/jpeg': ['.jpg', '.jpeg'] // Optional: include other formats if needed
    },
    multiple: true,
    onDrop: acceptedFiles => {
      setTiffFiles(acceptedFiles);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tiffFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      tiffFiles.forEach(file => {
        formData.append('tiffFiles', file);
      });
      formData.append('outputQuality', outputQuality);
      formData.append('pageSize', pageSize);
      formData.append('multiPage', multiPage);

      // This would be your API call in a real implementation
      console.log('Submitting TIFFs for PDF conversion:', {
        files: tiffFiles,
        outputQuality,
        pageSize,
        multiPage
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/tiff-to-pdf', {
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

  const removeFile = (index) => {
    const newFiles = [...tiffFiles];
    newFiles.splice(index, 1);
    setTiffFiles(newFiles);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - TIFF to PDF Converter</title>
          <meta name="description" content="Convert TIFF images to PDF documents with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert TIFF to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert TIFF images into high-quality PDF files with our free online tool.
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your TIFF files here</h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files (multiple allowed)</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select TIFF Files
              </button>
              {tiffFiles.length > 0 && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected files: {tiffFiles.length}
                </p>
              )}
            </div>

            {/* Selected Files Preview */}
            {tiffFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected TIFF files:</h4>
                <ul className="divide-y divide-gray-200">
                  {tiffFiles.map((file, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conversion Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="outputQuality" className="block text-sm font-medium text-gray-700 mb-1">
                  Output Quality:
                </label>
                <select
                  id="outputQuality"
                  value={outputQuality}
                  onChange={(e) => setOutputQuality(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low (smaller file)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (best quality)</option>
                </select>
              </div>
              <div>
                <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Size:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="auto">Auto (match TIFF)</option>
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label htmlFor="multiPage" className="block text-sm font-medium text-gray-700 mb-1">
                  Multi-page Handling:
                </label>
                <select
                  id="multiPage"
                  value={multiPage}
                  onChange={(e) => setMultiPage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="single">Single PDF page per TIFF</option>
                  <option value="combine">Combine all into one PDF</option>
                  <option value="preserve">Preserve multi-page TIFFs</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={tiffFiles.length === 0 || isProcessing}
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

export default TIFFToPDF;