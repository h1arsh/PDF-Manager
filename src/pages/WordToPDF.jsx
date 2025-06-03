import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const WordToPDF = () => {
  const [wordFile, setWordFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setWordFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
    }
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!wordFile) return;

  setIsProcessing(true);

  try {
    const formData = new FormData();
    formData.append('documents', wordFile);

    const response = await fetch('http://localhost:5000/api/pdf/convert-word-to-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to convert file');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <>
      <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Word to PDF Converter</title>
          <meta name="description" content="Convert Word documents into PDF files with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert Word to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-700 max-w-2xl mx-auto">
            Convert Word documents into PDF files with our easy-to-use FREE online converter tool.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div 
              {...getRootProps()} 
              className="bg-yellow-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Drag and drop your Word document here</h3>
              <p className="mt-1 text-sm text-gray-700">or click to browse files (.docx only)</p>
              <button 
                type="button"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Select Word File
              </button>
              {wordFile && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected file: {fileName}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={!wordFile || isProcessing}
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

export default WordToPDF;