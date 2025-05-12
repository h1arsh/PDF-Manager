import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const RotatePDF = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotationDirection, setRotationDirection] = useState('right');

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    multiple: true,
    onDrop: acceptedFiles => {
      setPdfFiles(acceptedFiles);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdfFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      pdfFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('rotationDirection', rotationDirection);

      // This would be your API call in a real implementation
      console.log('Submitting PDFs for rotation:', {
        files: pdfFiles,
        direction: rotationDirection
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/rotate-pdf-form', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.blob();
      // Create download link for the rotated PDFs

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Rotate PDF Online</title>
          <meta name="description" content="Rotate your PDF files as you want. Rotate multiple PDFs at same time defining degrees" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Rotate PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Rotate your PDF files as you want. Rotate multiple PDFs at same time defining degrees
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
              {pdfFiles.length > 0 && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected files: {pdfFiles.length}
                </p>
              )}
            </div>

            {/* Rotation Options */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <label htmlFor="rotationDirection" className="text-sm font-medium text-gray-700">
                Select rotation direction:
              </label>
              <select
                id="rotationDirection"
                value={rotationDirection}
                onChange={(e) => setRotationDirection(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left (90° counter-clockwise)</option>
                <option value="right">Right (90° clockwise)</option>
                <option value="upsideDown">Upside Down (180°)</option>
              </select>
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
                    Rotating...
                  </span>
                ) : (
                  'Rotate PDFs'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RotatePDF;