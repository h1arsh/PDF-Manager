import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const AddPassword = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encryptionLevel, setEncryptionLevel] = useState('128-bit');
  const [permissions, setPermissions] = useState({
    printing: 'low',
    modifying: false,
    copying: false,
    annotating: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    multiple: false,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
      setError('');
    }
  });

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('password', password);
      formData.append('encryptionLevel', encryptionLevel);
      formData.append('permissions', JSON.stringify(permissions));

      // This would be your API call in a real implementation
      console.log('Encrypting PDF with:', {
        fileName,
        encryptionLevel,
        permissions
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/encrypt-pdf', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.blob();
      // Create download link for the encrypted PDF

    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during encryption');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Encrypt PDF Files</title>
          <meta name="description" content="Add password protection and encryption to your PDF files to secure sensitive documents" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Encrypt PDF Files
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Add password protection and encryption to secure your sensitive PDF documents.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div 
              {...getRootProps()} 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer mb-8"
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your PDF here</h3>
              <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select PDF File
              </button>
              {pdfFile && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected file: {fileName}
                </p>
              )}
            </div>

            {/* Password Settings */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Password Protection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Set Password:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password:
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Encryption Settings */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Encryption Settings</h3>
              
              <div className="mb-4">
                <label htmlFor="encryptionLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Strength:
                </label>
                <select
                  id="encryptionLevel"
                  value={encryptionLevel}
                  onChange={(e) => setEncryptionLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="40-bit">40-bit (Basic)</option>
                  <option value="128-bit">128-bit (Standard)</option>
                  <option value="256-bit">256-bit (High Security)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Permissions:
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="printing"
                      type="checkbox"
                      checked={permissions.printing}
                      onChange={() => handlePermissionChange('printing')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="printing" className="ml-2 block text-sm text-gray-700">
                      Allow Printing
                    </label>
                    {permissions.printing && (
                      <select
                        value={permissions.printing}
                        onChange={(e) => setPermissions({...permissions, printing: e.target.value})}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="low">Low quality</option>
                        <option value="high">High quality</option>
                      </select>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="modifying"
                      type="checkbox"
                      checked={permissions.modifying}
                      onChange={() => handlePermissionChange('modifying')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="modifying" className="ml-2 block text-sm text-gray-700">
                      Allow Document Modification
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="copying"
                      type="checkbox"
                      checked={permissions.copying}
                      onChange={() => handlePermissionChange('copying')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="copying" className="ml-2 block text-sm text-gray-700">
                      Allow Content Copying
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="annotating"
                      type="checkbox"
                      checked={permissions.annotating}
                      onChange={() => handlePermissionChange('annotating')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="annotating" className="ml-2 block text-sm text-gray-700">
                      Allow Comments and Form Fill
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={!pdfFile || !password || !confirmPassword || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Encrypting PDF...
                  </span>
                ) : (
                  'Encrypt PDF'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPassword;