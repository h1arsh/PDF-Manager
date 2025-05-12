import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path to CDN (most reliable solution)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToJPG = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfDocRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file (PDF extension required)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size too large (max 50MB)');
      return;
    }

    setPdfFile(file);
    setError(null);
    setCurrentPage(1);
    setTotalPages(0);
    setImageUrls([]);
  };

  const processPDF = async () => {
    if (!pdfFile) {
      setError('No PDF file selected');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const pdfUrl = URL.createObjectURL(pdfFile);
      const pdfDoc = await pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: 'cmaps/',
        cMapPacked: true
      }).promise;

      pdfDocRef.current = pdfDoc;
      setTotalPages(pdfDoc.numPages);
      
      // Render first page
      await renderPage(1);
      
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(`Failed to process PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPage = async (pageNum) => {
    if (!pdfDocRef.current) return;
    
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
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
      
      // Convert to JPG and store URL
      const jpgUrl = await convertPageToJPG(page);
      setImageUrls(prev => {
        const newUrls = [...prev];
        newUrls[pageNum - 1] = jpgUrl;
        return newUrls;
      });
      
    } catch (err) {
      console.error('Error rendering page:', err);
      setError(`Failed to render page ${pageNum}: ${err.message}`);
    }
  };

  const convertPageToJPG = async (page) => {
    const scale = 2; // Higher scale for better quality
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: viewport
    }).promise;
    
    return canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
  };

  const downloadAllPages = async () => {
    if (!pdfDocRef.current || isConverting) return;
    
    setIsConverting(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder('images');
      
      // Process all pages
      for (let i = 1; i <= totalPages; i++) {
        if (!imageUrls[i - 1]) {
          const page = await pdfDocRef.current.getPage(i);
          const jpgUrl = await convertPageToJPG(page);
          setImageUrls(prev => {
            const newUrls = [...prev];
            newUrls[i - 1] = jpgUrl;
            return newUrls;
          });
        }
        
        const base64Data = imageUrls[i - 1].split(',')[1];
        imgFolder.file(`page_${i}.jpg`, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${pdfFile.name.replace('.pdf', '')}_converted.zip`);
      
    } catch (err) {
      console.error('Error creating ZIP:', err);
      setError(`Failed to create download: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Helmet>
        <title>PDF to JPG Converter | PDF Verse</title>
      </Helmet>
      
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            PDF to JPG Converter
          </span>
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Convert PDF pages to high-quality JPG images instantly
        </p>
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            id="pdf-input"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label 
            htmlFor="pdf-input"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg cursor-pointer transition-colors"
          >
            {pdfFile ? pdfFile.name : 'Choose PDF File'}
          </label>
          <p className="mt-2 text-sm text-gray-500">Max file size: 50MB</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={processPDF}
            disabled={!pdfFile || isProcessing}
            className={`bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:transform-none ${
              totalPages > 0 ? 'hidden' : ''
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Convert to JPG'
            )}
          </button>
          
          <button
            onClick={downloadAllPages}
            disabled={!pdfFile || isConverting || totalPages === 0}
            className={`bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:transform-none ${
              totalPages === 0 ? 'hidden' : ''
            }`}
          >
            {isConverting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing Download...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All Pages
              </span>
            )}
          </button>
        </div>

        {totalPages > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center">
              <canvas 
                ref={canvasRef} 
                className="border border-gray-200 max-w-full max-h-[80vh]"
              />
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-4">
              <button
                onClick={() => renderPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => renderPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFToJPG;