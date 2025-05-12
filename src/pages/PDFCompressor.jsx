import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';

const PDFCompressor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;
    
    setIsProcessing(true);
    // Here you'll add the API call to your backend
    // For now, we'll just log the values
    console.log({ pdfFile, compressionLevel });
    setIsProcessing(false);
  };

  return (
    <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
            <title>PDF Verse - Compress PDF Files</title>
            <meta name="description" content="Compress PDF files to reduce their size while maintaining quality" />
        </Helmet>
        
        <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Compress PDF Files
            </span>
            </h1>
            <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Reduce PDF file size while maintaining good quality. Perfect for email attachments and web uploads.
            </p>
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
                <i className="bx bxs-cloud-upload text-5xl text-blue-500"></i>
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
                    Selected file: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                )}
            </div>

            {/* Compression Options */}
            <div className="mt-8">
                <label htmlFor="compressionLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Compression Level:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['low', 'medium', 'high'].map((level) => (
                    <div 
                    key={level}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        compressionLevel === level 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setCompressionLevel(level)}
                    >
                    <div className="flex items-center">
                        <input
                        type="radio"
                        id={level}
                        name="compressionLevel"
                        checked={compressionLevel === level}
                        onChange={() => setCompressionLevel(level)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={level} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                        {level} compression
                        </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        {level === 'low' && 'Smaller size reduction, best quality'}
                        {level === 'medium' && 'Balanced size and quality'}
                        {level === 'high' && 'Maximum compression, reduced quality'}
                    </p>
                    </div>
                ))}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                disabled={!pdfFile || isProcessing}
                >
                {isProcessing ? (
                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compressing...
                    </span>
                ) : (
                    'Compress & Download PDF'
                )}
                </button>
            </div>
            </form>
        </div>
        </div>        
    </>
  );
};

export default PDFCompressor;