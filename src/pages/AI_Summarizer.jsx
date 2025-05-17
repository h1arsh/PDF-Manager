import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';

const PDFSummarizer = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setPdfFile(acceptedFiles[0]);
      setSummary('');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;

    setIsProcessing(true);
    setSummary('');

    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('summaryLength', summaryLength);

      const response = await fetch('http://localhost:5000/api/pdf/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to summarize PDF');
      const result = await response.json();
      setSummary(result.summary);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Helmet>
        <title>PDF Verse - AI PDF Summarizer</title>
      </Helmet>

      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            AI PDF Summarizer
          </span>
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Upload a PDF and get an AI-generated summary of its contents instantly.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* File Upload */}
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
                Selected file: {pdfFile.name}
              </p>
            )}
          </div>

          {/* Summary Length Dropdown */}
          <div className="mt-8">
            <label htmlFor="summaryLength" className="block text-sm font-medium text-gray-700 mb-2">
              Summary Length
            </label>
            <div className="relative inline-block w-full text-left">
              <div
                className="cursor-pointer border border-gray-300 bg-white rounded-lg shadow-sm pl-4 pr-10 py-3 text-base text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {summaryLength === 'short' ? 'Short (Key Points)' :
                 summaryLength === 'medium' ? 'Medium (Detailed Summary)' :
                 'Long (Comprehensive Summary)'}

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.84a.75.75 0 01-1.02 0l-4.25-3.84a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ul className="py-1 text-gray-700 text-sm">
                    {[
                      { value: 'short', label: 'Short (Key Points)' },
                      { value: 'medium', label: 'Medium (Detailed Summary)' },
                      { value: 'long', label: 'Long (Comprehensive Summary)' },
                    ].map(option => (
                      <li
                        key={option.value}
                        className={`block px-4 py-2 hover:bg-blue-100 cursor-pointer ${summaryLength === option.value ? 'bg-blue-50 font-medium text-blue-700' : ''}`}
                        onClick={() => {
                          setSummaryLength(option.value);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5"
              disabled={!pdfFile || isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172" />
                  </svg> */}
                  Generate Summary
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Summary Display */}
        <div>
              <label htmlFor="summaryText" className="block text-sm font-medium text-gray-700 mb-2">
                AI Summary
              </label>
              <div className="relative">
                <textarea
                  id="summaryText"
                  rows={8}
                  className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-lg transition-all duration-150 ease-in-out p-4 pr-10"
                  placeholder={isProcessing ? "Generating summary..." : "Your summary will appear here..."}
                  value={summary}
                  readOnly
                />
                {summary && (
                  <button
                    onClick={() => navigator.clipboard.writeText(summary)}
                    className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Copy to clipboard"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
      </div>
    
  );
};

export default PDFSummarizer;
