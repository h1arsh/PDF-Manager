import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const TextToPDF = () => {
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('document.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [pageSize, setPageSize] = useState('A4');
  const [margin, setMargin] = useState('normal');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setSuccess(false);
    
    if (rejectedFiles.length > 0) {
      setError('Please only upload .txt files (max 5MB each).');
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      setTextContent(event.target.result);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(selectedFile);
    
    // Set default filename based on uploaded file
    setFileName(selectedFile.name.replace('.txt', '.pdf'));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim() && !file) {
      setError('Please upload a text file or enter text to convert.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('text', textContent);
      }
      formData.append('filename', fileName);
      formData.append('fontSize', fontSize);
      formData.append('fontFamily', fontFamily);
      formData.append('pageSize', pageSize);
      formData.append('margin', margin);

      const response = await fetch('http://localhost:5000/api/pdf/convert-text-to-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert text to PDF');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
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

  const clearFile = () => {
    setFile(null);
    setTextContent('');
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Helmet>
          <title>PDF Verse - Text to PDF Converter</title>
          <meta name="description" content="Convert plain text to PDF documents with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert Text to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto">
            Upload your text file and convert it to a professional PDF document.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your text file here' : 'Drag and drop your text file here'}
              </h3>
              <p className="mt-1 text-sm text-gray-700">or click to browse files (.txt format, max 5MB)</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select Text File
              </button>
              {file && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  1 file selected
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

            {/* Selected File Info */}
            {file && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selected File
                  </h3>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Size not available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversion Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Filename:
                </label>
                <input
                  type="text"
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size:
                </label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10pt</option>
                  <option value="12">12pt</option>
                  <option value="14">14pt</option>
                  <option value="16">16pt</option>
                  <option value="18">18pt</option>
                </select>
              </div>
              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">
                  Font Family:
                </label>
                <select
                  id="fontFamily"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Verdana">Verdana</option>
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
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                  <option value="A5">A5</option>
                </select>
              </div>
              <div>
                <label htmlFor="margin" className="block text-sm font-medium text-gray-700 mb-1">
                  Margins:
                </label>
                <select
                  id="margin"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="bg-yellow-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="narrow">Narrow</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                disabled={!file || isProcessing}
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

export default TextToPDF;