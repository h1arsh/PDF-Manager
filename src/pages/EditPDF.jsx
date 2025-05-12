import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const EditPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      // This would be your API call in a real implementation
      console.log('Submitting PDF for editing:', fileName);
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and redirect to editor
      // const response = await fetch('/editor', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.json();
      // Redirect to editor page with the PDF data

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" style={{ width: '90%' }}>
        <Helmet>
          <title>PDF Verse - Edit PDF Online</title>
          <meta name="description" content="Edit PDF online without converting your document" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Edit PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Edit PDF online without converting your document
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
                  Selected file: {fileName}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={!pdfFile || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Editor...
                  </span>
                ) : (
                  'Edit PDF'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPDF;