import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';

const WatermarkPDF = () => {
  // Text Watermark State
  const [textPdfFiles, setTextPdfFiles] = useState([]);
  const [watermarkText, setWatermarkText] = useState('');
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [rotation, setRotation] = useState(45);
  const [opacity, setOpacity] = useState(0.5);

  // Image Watermark State
  const [imagePdfFile, setImagePdfFile] = useState(null);
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps: getTextPdfRootProps, getInputProps: getTextPdfInputProps } = useDropzone({
    accept: '.pdf',
    multiple: true,
    onDrop: acceptedFiles => {
      setTextPdfFiles(acceptedFiles);
    }
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: '.pdf',
    multiple: false,
    onDrop: acceptedFiles => {
      setImagePdfFile(acceptedFiles[0]);
    }
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: acceptedFiles => {
      setWatermarkImage(acceptedFiles[0]);
    }
  });

  const handleTextWatermarkSubmit = async (e) => {
    e.preventDefault();
    if (textPdfFiles.length === 0 || !watermarkText) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      textPdfFiles.forEach(file => {
        formData.append('pdfs', file);
      });
      formData.append('watermarkText', watermarkText);
      formData.append('fontSize', fontSize);
      formData.append('fontFamily', fontFamily);
      formData.append('rotation', rotation);
      formData.append('opacity', opacity);

      console.log('Adding text watermark:', {
        files: textPdfFiles,
        text: watermarkText,
        fontSize,
        fontFamily,
        rotation,
        opacity
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // API call would go here
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageWatermarkSubmit = async (e) => {
    e.preventDefault();
    if (!imagePdfFile || !watermarkImage) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('imgpdf', imagePdfFile);
      formData.append('img', watermarkImage);

      console.log('Adding image watermark:', {
        pdf: imagePdfFile,
        image: watermarkImage
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // API call would go here
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" style={{ width: '90%' }}>
        <Helmet>
          <title>PDF Verse - Watermark PDF Online</title>
          <meta name="description" content="Stamp text or image over your PDF with custom options" />
        </Helmet>
        
        {/* Text Watermark Section */}
        <div className="mb-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Text Watermark PDF
              </span>
            </h1>
            <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
              Stamp text over your PDF. Choose the typography, transparency and position
            </h5>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <form onSubmit={handleTextWatermarkSubmit}>
              <div 
                {...getTextPdfRootProps()} 
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
              >
                <input {...getTextPdfInputProps()} />
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
                {textPdfFiles.length > 0 && (
                  <p className="mt-4 text-sm font-medium text-gray-900">
                    Selected files: {textPdfFiles.length}
                  </p>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="watermarkText" className="block text-sm font-medium text-gray-700 mb-1">
                      Watermark Text:
                    </label>
                    <input
                      type="text"
                      id="watermarkText"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Font Size:
                    </label>
                    <input
                      type="number"
                      id="fontSize"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      min="1"
                      max="140"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
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
                      <option value="Helvetica">Helvetica</option>
                      <option value="Arial">Arial</option>
                      <option value="Times">Times</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rotation" className="block text-sm font-medium text-gray-700 mb-1">
                      Rotation:
                    </label>
                    <input
                      type="number"
                      id="rotation"
                      value={rotation}
                      onChange={(e) => setRotation(e.target.value)}
                      min="-360"
                      max="360"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="opacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Opacity: {opacity}
                </label>
                <input
                  type="range"
                  id="opacity"
                  value={opacity}
                  onChange={(e) => setOpacity(e.target.value)}
                  min="0"
                  max="1"
                  step="0.1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="mt-8 flex justify-center">
                <button 
                  type="submit" 
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                  disabled={textPdfFiles.length === 0 || !watermarkText || isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying Watermark...
                    </span>
                  ) : (
                    'Watermark PDFs'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Image Watermark Section */}
        <div className="mt-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Image Watermark PDF
              </span>
            </h1>
            <h5 className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
              Stamp an image or text over your PDF in seconds
            </h5>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <form onSubmit={handleImageWatermarkSubmit}>
              <div className="space-y-6">
                <div 
                  {...getPdfRootProps()} 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <input {...getPdfInputProps()} />
                  <h3 className="text-lg font-medium text-gray-900">Select PDF file</h3>
                  <p className="mt-1 text-sm text-gray-500">Drag and drop or click to browse</p>
                  {imagePdfFile && (
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Selected: {imagePdfFile.name}
                    </p>
                  )}
                </div>

                <div 
                  {...getImageRootProps()} 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <input {...getImageInputProps()} />
                  <h3 className="text-lg font-medium text-gray-900">Select image file</h3>
                  <p className="mt-1 text-sm text-gray-500">Drag and drop or click to browse (JPG/PNG)</p>
                  {watermarkImage && (
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Selected: {watermarkImage.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button 
                  type="submit" 
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
                  disabled={!imagePdfFile || !watermarkImage || isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying Watermark...
                    </span>
                  ) : (
                    'Add Watermark'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default WatermarkPDF;