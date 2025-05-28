import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';
import { FiEye, FiEyeOff, FiX, FiFile, FiUpload } from 'react-icons/fi';

const RemovePDFProtection = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
      setError(null);
      setSuccess(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError('Please select a PDF file first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      if (password) {
        formData.append('password', password);
      }

      const response = await fetch('http://localhost:5000/api/pdf/remove-protection', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove protection');
      }

      const blob = await response.blob();
      
      if (!blob.type.includes('application/pdf')) {
        const errorText = await blob.text();
        throw new Error(errorText || 'Invalid response from server');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name.replace('.pdf', '_unprotected.pdf');
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    setError(null);
    setSuccess(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Helmet>
          <title>PDF Verse - Remove PDF Password & Protection</title>
          <meta name="description" content="Remove password, protection and permissions from your PDF files with our FREE online tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Remove PDF Protection
            </span>
          </h1>
          <h5 className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Remove passwords, restrictions and permissions from your PDF files.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                {isDragActive ? (
                  <FiUpload className="h-16 w-16 text-blue-500" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your PDF here' : 'Drag and drop your protected PDF here'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto"
              >
                <FiUpload className="mr-2" />
                Select PDF File
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">PDF protection removed successfully! Your download should start automatically.</p>
                </div>
              </div>
            )}

            {/* Selected File Preview */}
            {pdfFile && (
              <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Selected PDF File
                  </h3>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Remove file"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <FiFile className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {pdfFile.name}
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="ml-2 text-red-500 hover:text-red-700"
                          aria-label="Remove file"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {pdfFile.size ? `${(pdfFile.size / 1024).toFixed(2)} KB` : 'Size not available'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="mt-8">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                PDF Password (if protected):
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password if required"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Leave blank if the PDF is not password protected
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!pdfFile || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removing Protection...
                  </>
                ) : (
                  'Remove PDF Protection'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RemovePDFProtection;