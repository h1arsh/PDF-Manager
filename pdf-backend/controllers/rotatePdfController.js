const fs = require('fs');
const path = require('path');
const { PDFDocument, degrees } = require('pdf-lib');
const JSZip = require('jszip');

const rotatePdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded' });
    }

    const rotationDirection = req.body.rotationDirection || 'right';
    let rotationDegrees = 0;

    // Map rotation direction to degrees
    switch (rotationDirection) {
      case 'left':
        rotationDegrees = 270;
        break;
      case 'right':
        rotationDegrees = 90;
        break;
      case 'upsideDown':
        rotationDegrees = 180;
        break;
      default:
        rotationDegrees = 90;
    }

    const processedPdfs = await Promise.all(
      req.files.map(async (file) => {
        const pdfBytes = await fs.promises.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        // Apply rotation to each page using `degrees()`
        pages.forEach(page => {
          page.setRotation(degrees(rotationDegrees));
        });

        const rotatedPdfBytes = await pdfDoc.save();
        return {
          originalName: file.originalname,
          buffer: rotatedPdfBytes
        };
      })
    );

    // Return single PDF directly
    if (processedPdfs.length === 1) {
      const pdf = processedPdfs[0];
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=rotated_${pdf.originalName}`);
      return res.send(pdf.buffer);
    }

    // Return multiple PDFs as a zip
    const zip = new JSZip();
    processedPdfs.forEach(pdf => {
      zip.file(`rotated_${pdf.originalName}`, pdf.buffer);
    });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=rotated_pdfs.zip');
    res.send(zipBuffer);

  } catch (error) {
    console.error('Error rotating PDF:', error);
    res.status(500).json({ error: 'Failed to rotate PDFs' });
  } finally {
    // Cleanup temporary uploaded files
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
  }
};

module.exports = { rotatePdf };
