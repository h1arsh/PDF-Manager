import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const PDFEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pdfFile } = location.state || {};
  
  const [pdf, setPdf] = useState(null);
  const [activeTool, setActiveTool] = useState('selector');
  const [brushSize, setBrushSize] = useState(5);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState('#212121');
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const pdfContainerRef = useRef(null);
  const pdfInstanceRef = useRef(null);
  const pdfDocumentRef = useRef(null);

  const renderPage = async (pageNum) => {
    if (!pdfDocumentRef.current || !pdfContainerRef.current) return;

    try {
      setIsLoading(true);
      const page = await pdfDocumentRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport,
        intent: 'display'
      }).promise;

      if (pdfInstanceRef.current) {
        pdfInstanceRef.current.dispose();
      }

      const fabricCanvas = new fabric.Canvas(canvas, {
        selection: true,
        selectionColor: 'rgba(0, 0, 255, 0.3)',
        selectionBorderColor: 'blue',
        selectionLineWidth: 1,
        backgroundColor: '#fff'
      });

      pdfContainerRef.current.innerHTML = '';
      pdfContainerRef.current.appendChild(canvas);
      pdfInstanceRef.current = fabricCanvas;

      fabricCanvas.freeDrawingBrush.width = parseInt(brushSize);
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.isDrawingMode = activeTool === 'pencil';
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render PDF page');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfFile) {
      setError('No PDF file provided');
      setIsLoading(false);
      return;
    }

    const initPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Read the file as ArrayBuffer
        const arrayBuffer = await pdfFile.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/cmaps/',
          cMapPacked: true,
        });
        
        const pdfDocument = await loadingTask.promise;
        pdfDocumentRef.current = pdfDocument;
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);
        
        await renderPage(currentPage);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF. Please try another file.');
        setIsLoading(false);
      }
    };

    initPDF();

    return () => {
      if (pdfInstanceRef.current) {
        pdfInstanceRef.current.dispose();
      }
    };
  }, [pdfFile]);

  useEffect(() => {
    if (pdfDocumentRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage, scale]);

  useEffect(() => {
    if (pdfInstanceRef.current) {
      pdfInstanceRef.current.freeDrawingBrush.width = parseInt(brushSize);
      pdfInstanceRef.current.freeDrawingBrush.color = color;
    }
  }, [brushSize, color]);

  const changeActiveTool = (tool) => {
    setActiveTool(tool);
    if (pdfInstanceRef.current) {
      pdfInstanceRef.current.isDrawingMode = tool === 'pencil';
      pdfInstanceRef.current.selection = tool === 'selector';
    }
  };

  const enableAddText = () => {
    if (pdfInstanceRef.current) {
      const text = new fabric.IText('Double click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: parseInt(fontSize),
        fill: color,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.7)'
      });
      pdfInstanceRef.current.add(text);
      pdfInstanceRef.current.setActiveObject(text);
      pdfInstanceRef.current.renderAll();
    }
  };

  const addRectangle = () => {
    if (pdfInstanceRef.current) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 60,
        fill: 'transparent',
        stroke: color,
        strokeWidth: brushSize
      });
      pdfInstanceRef.current.add(rect);
      pdfInstanceRef.current.setActiveObject(rect);
      pdfInstanceRef.current.renderAll();
    }
  };

  const addArrow = () => {
    if (pdfInstanceRef.current) {
      const line = new fabric.Line([50, 100, 200, 100], {
        stroke: color,
        strokeWidth: brushSize,
        selectable: true
      });
      
      const arrowHead = new fabric.Triangle({
        width: 15,
        height: 15,
        fill: color,
        left: 200,
        top: 100,
        angle: 90
      });
      
      const group = new fabric.Group([line, arrowHead], {
        selectable: true
      });
      
      pdfInstanceRef.current.add(group);
      pdfInstanceRef.current.setActiveObject(group);
      pdfInstanceRef.current.renderAll();
    }
  };

  const addImageToCanvas = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fabric.Image.fromURL(event.target.result, (img) => {
            img.set({
              left: 100,
              top: 100,
              scaleX: 0.5,
              scaleY: 0.5,
              selectable: true
            });
            pdfInstanceRef.current.add(img);
            pdfInstanceRef.current.renderAll();
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const deleteSelectedObject = () => {
    if (pdfInstanceRef.current) {
      const activeObject = pdfInstanceRef.current.getActiveObject();
      if (activeObject) {
        pdfInstanceRef.current.remove(activeObject);
      }
    }
  };

  const clearPage = () => {
    if (pdfInstanceRef.current) {
      const confirmClear = window.confirm('Are you sure you want to clear all annotations on this page?');
      if (confirmClear) {
        pdfInstanceRef.current.clear();
        renderPage(currentPage);
      }
    }
  };

  const savePDF = () => {
    if (pdfInstanceRef.current) {
      const canvas = pdfInstanceRef.current.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: pdfInstanceRef.current.width > pdfInstanceRef.current.height ? 'landscape' : 'portrait',
        unit: 'px'
      });
      
      const imgWidth = doc.internal.pageSize.getWidth() - 20;
      const imgHeight = (pdfInstanceRef.current.height * imgWidth) / pdfInstanceRef.current.width;
      
      doc.addImage(canvas, 'PNG', 10, 10, imgWidth, imgHeight);
      const downloadName = pdfFile?.name ? `edited_${pdfFile.name}` : 'edited-pdf.pdf';
      doc.save(downloadName);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <h3 className="text-xl font-medium text-red-800">Error</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button 
            onClick={goBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 p-4">
      <div className="flex flex-wrap gap-4 bg-white border rounded-md shadow-md p-4 w-full justify-start items-center mb-4">
        <button 
          onClick={goBack}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          title="Go back"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span>Zoom: {(scale * 100).toFixed(0)}%</span>
          <button 
            onClick={() => setScale(prev => prev + 0.1)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              ←
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              →
            </button>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm font-medium">Brush Size</label>
          <input 
            type="range"
            value={brushSize}
            min="1"
            max="50"
            onChange={(e) => setBrushSize(e.target.value)}
            className="w-20"
          />
          <span className="text-xs text-center">{brushSize}px</span>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Font Size</label>
          <select 
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {[10, 12, 16, 18, 24, 32, 48, 64, 72, 108].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 items-center">
          {['#212121', '#ff0000', '#0000ff', '#00ff00', '#ffffff', '#ffff00', '#ff00ff'].map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border ${color === c ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>

        <div className="border-l border-gray-300 h-8 mx-2"></div>

        <button 
          className={`px-3 py-1 border rounded ${activeTool === 'selector' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => changeActiveTool('selector')}
          title="Select"
        >
          Select
        </button>

        <button 
          className={`px-3 py-1 border rounded ${activeTool === 'pencil' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => changeActiveTool('pencil')}
          title="Draw"
        >
          Draw
        </button>

        <button 
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
          onClick={enableAddText}
          title="Add Text"
        >
          Text
        </button>

        <button 
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
          onClick={addArrow}
          title="Add Arrow"
        >
          Arrow
        </button>

        <button 
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
          onClick={addRectangle}
          title="Add Rectangle"
        >
          Rectangle
        </button>

        <button 
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
          onClick={addImageToCanvas}
          title="Add Image"
        >
          Image
        </button>

        <div className="border-l border-gray-300 h-8 mx-2"></div>

        <button 
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={deleteSelectedObject}
          title="Delete Selected"
        >
          Delete
        </button>

        <button 
          className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500"
          onClick={clearPage}
          title="Clear Page"
        >
          Clear
        </button>

        <button 
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={savePDF}
          title="Save PDF"
        >
          Save
        </button>
      </div>

      <div
        id="pdf-container"
        ref={pdfContainerRef}
        className="overflow-auto border rounded shadow max-w-full bg-white"
        style={{ maxHeight: '80vh', width: '100%' }}
      />
    </div>
  );
};

export default PDFEditor;