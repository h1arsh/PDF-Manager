const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, degrees } = require('pdf-lib'); // Import degrees from pdf-lib
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Helper function to delete files
async function cleanupFiles(files) {
  for (const file of files) {
    if (file && file.path) {
      await unlinkAsync(file.path).catch(err => console.error('Error deleting file:', err));
    }
  }
}

// Text Watermark
const addTextWatermark = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No PDF files uploaded' });
  }

  const { watermarkText, fontSize = 40, fontFamily = 'Helvetica', rotation = 45, opacity = 0.5 } = req.body;

  if (!watermarkText) {
    await cleanupFiles(req.files);
    return res.status(400).json({ error: 'Watermark text is required' });
  }

  try {
    // Process each PDF
    const processedFiles = await Promise.all(req.files.map(async (file) => {
      const pdfBytes = await fs.promises.readFile(file.path);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Embed font
      let font;
      try {
        font = await pdfDoc.embedFont(fontFamily);
      } catch (err) {
        font = await pdfDoc.embedFont('Helvetica'); // Fallback to Helvetica
      }

      const pages = pdfDoc.getPages();
      
      // Add watermark to each page
      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        page.drawText(watermarkText, {
          x: width / 2,
          y: height / 2,
          size: parseInt(fontSize),
          font,
          color: rgb(0, 0, 0),
          rotate: degrees(parseInt(rotation)), // Use degrees() function
          opacity: parseFloat(opacity),
        });
      });

      const modifiedPdfBytes = await pdfDoc.save();
      return {
        name: `watermarked_${file.originalname}`,
        data: modifiedPdfBytes
      };
    }));

    // If single file, send directly
    if (processedFiles.length === 1) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${processedFiles[0].name}"`);
      return res.send(processedFiles[0].data);
    }

    // For multiple files, create a zip
    const JSZip = require('jszip');
    const zip = new JSZip();
    
    processedFiles.forEach(file => {
      zip.file(file.name, file.data);
    });

    const zipData = await zip.generateAsync({ type: 'nodebuffer' });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="watermarked_pdfs.zip"');
    res.send(zipData);

  } catch (error) {
    console.error('Error adding text watermark:', error);
    res.status(500).json({ error: 'Failed to add text watermark' });
  } finally {
    await cleanupFiles(req.files);
  }
};

module.exports = {
  addTextWatermark
};