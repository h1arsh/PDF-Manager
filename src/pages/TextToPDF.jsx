import { useState } from 'react';
import { Helmet } from 'react-helmet';

const TextToPDF = () => {
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('document.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [pageSize, setPageSize] = useState('A4');
  const [margin, setMargin] = useState('normal');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('text', textContent);
      formData.append('filename', fileName);
      formData.append('fontSize', fontSize);
      formData.append('fontFamily', fontFamily);
      formData.append('pageSize', pageSize);
      formData.append('margin', margin);

      // This would be your API call in a real implementation
      console.log('Submitting text for PDF conversion:', {
        text: textContent,
        fileName,
        fontSize,
        fontFamily,
        pageSize,
        margin
      });
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the response and provide download
      // const response = await fetch('/text-to-pdf', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.blob();
      // Create download link for the generated PDF

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
          <title>PDF Verse - Text to PDF Converter</title>
          <meta name="description" content="Convert plain text to PDF documents with our easy-to-use FREE online converter tool" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Convert Text to PDF
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert plain text into professional PDF documents in seconds.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Text Input Area */}
            <div className="mb-6">
              <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your text:
              </label>
              <textarea
                id="textContent"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type or paste your text here..."
                required
              />
            </div>

            {/* Conversion Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Filename:
                </label>
                <input
                  type="text"
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                disabled={!textContent.trim() || isProcessing}
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