import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';

const PDFToJSON = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

      // This would be your API call in a real implementation
      console.log('Submitting PDFs for JSON conversion:', pdfFiles);
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/api/convert-pdf-to-json', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.json();
      // Handle the JSON response

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...pdfFiles];
    newFiles.splice(index, 1);
    setPdfFiles(newFiles);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Convert PDF to JSON Online</title>
          <meta name="description" content="Convert your PDF files to JSON format online, quickly and easily" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              PDF to JSON Converter
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert your PDF files to JSON format online, quickly.
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
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

            {/* Selected Files List */}
            {pdfFiles.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4 text-center">Selected Files:</h4>
                <ul className="list-group">
                  {pdfFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
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

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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
                  'Convert to JSON'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PDFToJSON;