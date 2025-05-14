import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const PDFToExcel = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [selectedPages, setSelectedPages] = useState('');
  const [tableOption, setTableOption] = useState('Auto-detect');

  const formats = ['xlsx', 'xls', 'csv'];
  const tableOptions = ['Auto-detect', 'Single table', 'Multiple tables', 'Text only'];

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
      formData.append('selectedFormat', selectedFormat);
      formData.append('selectedPages', selectedPages);
      formData.append('tableOption', tableOption);

      // This would be your API call in a real implementation
      console.log('Submitting PDFs for Excel conversion:', {
        files: pdfFiles,
        format: selectedFormat,
        pages: selectedPages,
        tableOption
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/excel-convert', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.blob();
      // Create download link for the Excel file
      const response = await fetch('http://localhost:5000/api/pdf/convert-to-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `converted.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);


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
          <title>PDF Verse - PDF to Excel Converter</title>
          <meta name="description" content="Convert your PDF files to Excel spreadsheets online, quickly" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              PDF to Excel Converter
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert your PDF files to Excel spreadsheets online, quickly.
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
              {pdfFiles.length > 0 && (
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Selected files: {pdfFiles.length}
                </p>
              )}
            </div>

            {/* Conversion Options */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="selectedFormat" className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                  Choose Excel Format:
                </label>
                <select 
                  id="selectedFormat"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="selectedPages" className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                  Select Pages (e.g., 1,3-5):
                </label>
                <input
                  type="text"
                  id="selectedPages"
                  value={selectedPages}
                  onChange={(e) => setSelectedPages(e.target.value)}
                  placeholder="Leave blank for all pages"
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="tableOption" className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                  Table Handling:
                </label>
                <select 
                  id="tableOption"
                  value={tableOption}
                  onChange={(e) => setTableOption(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {tableOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                type="submit" 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
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
                  'Convert to Excel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PDFToExcel;