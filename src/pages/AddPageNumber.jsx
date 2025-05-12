import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';


const AddPageNumber = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [position, setPosition] = useState('bottom-right');
  const [size, setSize] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;
    
    setIsProcessing(true);
    // Here you'll add the API call to your backend
    // For now, we'll just log the values
    console.log({ pdfFile, position, size });
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Helmet>
        <title>PDF Verse - Add Page Numbers to PDF</title>
      </Helmet>
      
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Add Page Numbers to PDF
          </span>
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.
        </p>
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
              <i className="bx bxs-cloud-upload text-5xl text-blue-500"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Drag and drop your PDF here</h3>
            <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
            <button 
              type="button"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Select PDF
            </button>
            {pdfFile && (
              <p className="mt-4 text-sm font-medium text-gray-900">
                Selected file: {pdfFile.name}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position of page numbers:
              </label>
              <select
                id="position"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-middle">Bottom Middle</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-middle">Top Middle</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                Size of page numbers:
              </label>
              <select
                id="size"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
          <button 
            type="submit" 
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            disabled={!pdfFile || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Add Page Numbers & Download'
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default AddPageNumber;