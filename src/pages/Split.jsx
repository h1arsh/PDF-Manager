import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const SplitPDF = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageRanges, setPageRanges] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    multiple: true,
    onDrop: acceptedFiles => {
      setPdfFiles(acceptedFiles);
    }
  });

  const removeFile = (index) => {
    setPdfFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (pdfFiles.length === 0 || !pageRanges) return;

  setIsProcessing(true);

  try {
    const formData = new FormData();
    pdfFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('pageRanges', pageRanges);

    const response = await fetch('http://localhost:5000/api/pdf/split', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to split PDF');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'split_pdfs.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
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
          <title>PDF Verse - Split PDF Online</title>
          <meta name="description" content="Split and Extract PDF information into multiple files" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Split PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Split and Extract PDF information into multiple files.
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
              
            </div>

            {/* Uploaded files list */}
            {pdfFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {pdfFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <div className="flex items-center min-w-0">
                        <svg className="flex-shrink-0 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="ml-3 overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove file"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Page Range Input */}
            <div className="mt-8 flex flex-col items-center">
              <label htmlFor="pageRanges" className="text-sm font-medium text-gray-700 mb-2">
                Enter page ranges to split (e.g. 1-5,8-10):
              </label>
              <input
                type="text"
                id="pageRanges"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="1-3,5-7,9"
                required
                className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Separate ranges with commas. Use hyphen for page ranges.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={pdfFiles.length === 0 || !pageRanges || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Splitting...
                  </span>
                ) : (
                  'Split PDFs'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SplitPDF;