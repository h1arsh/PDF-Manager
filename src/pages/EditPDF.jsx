import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

const EditPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large (max 10MB)');
        return;
      }
      setPdfFile(file);
      setError(null);
    },
    onDropRejected: () => {
      setError('Please upload a valid PDF file');
    }
  });

  const navigate = useNavigate();

  const removeFile = () => {
    setPdfFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEditClick = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create a blob URL that will be passed to the editor
      // const fileUrl = URL.createObjectURL(pdfFile);
      
      navigate('/editor', {
        state: {
           pdfFile: pdfFile // Pass the File object directly
        }
      });
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process PDF file');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 py-24">
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
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div {...getRootProps()} className="border-2 border-dashed bg-white border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input {...getInputProps()} />
          <div className="flex justify-center mb-4">
            <img src="/images/pdf.png" alt="PDF icon" className="h-16 w-16 object-contain" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Drag and drop your PDF here</h3>
          <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
          <button type="button" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Select PDF
          </button>
        </div>

        {pdfFile && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected file:</h4>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center min-w-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{pdfFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(pdfFile.size)}</p>
                </div>
              </div>
              <button type="button" onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove file">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
            disabled={!pdfFile || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Opening Editor...
              </span>
            ) : (
              'Edit PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPDF;
