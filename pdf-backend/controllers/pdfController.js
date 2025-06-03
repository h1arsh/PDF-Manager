const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

const processPdf = async (req, res) => {
  try {
    const { position = 'bottom-right', size = 'medium' } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Read the file from disk
    const filePath = path.join(__dirname, '../uploads', pdfFile.filename);
    const fileData = await fs.readFile(filePath);

    // Load PDF
    const pdfDoc = await PDFDocument.load(fileData);
    const pages = pdfDoc.getPages();

    // Set font size
    const fontSize = {
      small: 10,
      medium: 14,
      large: 18
    }[size] || 14;

    // Add page numbers
    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNum = (index + 1).toString();
      
      // Position mapping
      const positions = {
        'bottom-right': [width - 50, 30],
        'bottom-middle': [width / 2 - 10, 30],
        'bottom-left': [50, 30],
        'top-right': [width - 50, height - 30],
        'top-middle': [width / 2 - 10, height - 30],
        'top-left': [50, height - 30]
      };

      const [x, y] = positions[position] || positions['bottom-right'];
      
      page.drawText(pageNum, {
        x,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });

    // Send back modified PDF
    const modifiedPdf = await pdfDoc.save();
    
    // Clean up the uploaded file
    await fs.unlink(filePath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=numbered.pdf'
    });
    res.send(modifiedPdf);

  } catch (error) {
    console.error('PDF processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process PDF',
      details: error.message 
    });
  }
};

module.exports = { processPdf };