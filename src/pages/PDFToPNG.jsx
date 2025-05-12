import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import * as pdfjsLib from 'pdfjs-dist';
import { JSZip } from 'jszip';
import { saveAs } from 'file-saver';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToPNG = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [renderedPages, setRenderedPages] = useState([]);
  const [showDownload, setShowDownload] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfDocument(null);
      setCurrentPage(1);
      setTotalPages(0);
      setRenderedPages([]);
      setShowDownload(false);
    }
  };

  const renderPDF = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      
      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);
      await renderPage(pdf, currentPage);
    } catch (error) {
      console.error('Error rendering PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPage = async (pdfDoc, pageNum) => {
    if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) return;
    
    setIsProcessing(true);
    
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      setCurrentPage(pageNum);
      
      // Add to rendered pages if not already there
      if (!renderedPages.includes(pageNum)) {
        setRenderedPages([...renderedPages, pageNum]);
      }
    } catch (error) {
      console.error('Error rendering page:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      renderPage(pdfDocument, currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      renderPage(pdfDocument, currentPage + 1);
    }
  };

  const downloadAllAsZip = async () => {
    if (!pdfDocument || renderedPages.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("pdf_images");
      
      for (const pageNum of renderedPages) {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        const imageData = canvas.toDataURL('image/png');
        const base64Data = imageData.split(',')[1];
        imgFolder.file(`page_${pageNum}.png`, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'pdf_images.zip');
      setShowDownload(false);
    } catch (error) {
      console.error('Error creating zip:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (renderedPages.length > 0) {
      setShowDownload(true);
    }
  }, [renderedPages]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Helmet>
          <title>PDF Verse - Convert PDF to PNG Online</title>
          <meta name="description" content="Convert and view your PDF files to PNG images online, quickly" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              PDF to PNG Converter
            </span>
          </h1>
          <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Convert and view your PDF files to PNG images online, quickly.
          </h5>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* File Upload Area */}
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".pdf" 
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
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

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button 
                type="button"
                onClick={renderPDF}
                disabled={!pdfFile || isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing && pdfDocument === null ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Rendering...
                  </span>
                ) : (
                  'Render PDF'
                )}
              </button>

              {showDownload && (
                <button 
                  type="button"
                  onClick={downloadAllAsZip}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing Download...
                    </span>
                  ) : (
                    'Download All as ZIP'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* PDF Viewer */}
          <div id="pdf-main-container" className="mt-8">
            {isProcessing && pdfDocument === null && (
              <div id="pdf-loader" className="text-center py-8 text-gray-500">
                Loading document...
              </div>
            )}

            {pdfDocument && (
              <div id="pdf-contents" className="flex flex-col items-center">
                <canvas 
                  ref={canvasRef} 
                  id="pdf-canvas" 
                  className="border border-gray-200 shadow-sm mb-4"
                  width="800"
                ></canvas>

                {isProcessing && (
                  <div id="page-loader" className="text-center py-4 text-gray-500">
                    Loading page...
                  </div>
                )}

                <div id="pdf-meta" className="mt-4 w-full">
                  <div id="pdf-buttons" className="flex items-center justify-center gap-4">
                    <button 
                      id="pdf-prev"
                      onClick={goToPrevPage}
                      disabled={currentPage <= 1 || isProcessing}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    <div id="page-count-container" className="flex items-center gap-1 text-gray-700">
                      Page <span id="pdf-current-page" className="font-medium">{currentPage}</span> of <span id="pdf-total-pages" className="font-medium">{totalPages}</span>
                    </div>
                    
                    <button 
                      id="pdf-next"
                      onClick={goToNextPage}
                      disabled={currentPage >= totalPages || isProcessing}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PDFToPNG;