import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const RemovePDFProtection = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      if (password) {
        formData.append('password', password);
      }

      // This would be your API call in a real implementation
      console.log('Submitting PDF for protection removal:', {
        file: pdfFile,
        hasPassword: password.length > 0
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/remove-pdf-protection', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.blob();
      // Create download link for the unprotected PDF

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Remove PDF Password & Protection</title>
          <meta name="description" content="Remove password, protection and permissions from your PDF files with our FREE online tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Remove PDF Protection
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Remove passwords, restrictions and permissions from your PDF files.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your protected PDF here</h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select PDF File
              </button>
              {pdfFile && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected file: {pdfFile.name}
                </p>
              )}
            </div>

            {/* Selected File Preview */}
            {pdfFile && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected PDF file:</h4>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate max-w-xs">{pdfFile.name}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="mt-8">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                PDF Password (if protected):
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PDF password if required"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Leave blank if the PDF is not password protected
              </p>
            </div>

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
                    Removing Protection...
                  </span>
                ) : (
                  'Remove PDF Protection'
                )}
              </button>
            </div>
          </form>

          {/* Information Section
          <div className="mt-12 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">About PDF Protection Removal</h3>
            <div className="space-y-3 text-sm text-blue-700">
              <p>
                This tool helps you remove password protection, printing restrictions, 
                and other limitations from your PDF files.
              </p>
              <p>
                If your PDF is password protected, enter the password above to unlock it.
                For owner passwords (restrictions), our tool will attempt to remove them.
              </p>
              <p>
                Note: We respect copyright laws. Only remove protection from files you have
                legal rights to modify.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default RemovePDFProtection;