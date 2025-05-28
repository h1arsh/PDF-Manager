const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { promisify } = require('util');
const sharp = require('sharp');

const unlinkAsync = promisify(fs.unlink);

const convertPngToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const { layout = 'portrait', margin = 'medium', quality = 'high' } = req.body;
    
    // Create a new PDF document
    const pdfDoc = new PDFDocument({
      layout: layout === 'landscape' ? 'landscape' : 'portrait',
      margin: 0 // We'll handle margins manually
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');

    // Pipe the PDF to the response
    pdfDoc.pipe(res);

    // Process each image
    for (const file of req.files) {
      const imagePath = path.join(file.path);
      
      // Calculate margins based on user selection
      const marginSize = {
        none: 0,
        small: 20,
        medium: 40,
        large: 60
      }[margin] || 40;

      // Process image with sharp based on quality setting
      let processedImage;
      try {
        processedImage = await sharp(imagePath)
          .resize({
            width: layout === 'auto' ? undefined : (layout === 'landscape' ? 792 - (marginSize * 2) : 612 - (marginSize * 2)),
            height: layout === 'auto' ? undefined : (layout === 'landscape' ? 612 - (marginSize * 2) : 792 - (marginSize * 2)),
            fit: quality === 'high' ? 'contain' : 'inside',
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255 }
          })
          .toBuffer();
      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error);
        continue;
      }

      // Add image to PDF
      pdfDoc.image(processedImage, marginSize, marginSize, {
        width: layout === 'landscape' ? 792 - (marginSize * 2) : 612 - (marginSize * 2),
        height: layout === 'landscape' ? 612 - (marginSize * 2) : 792 - (marginSize * 2),
        align: 'center',
        valign: 'center'
      });

      // Add new page if there are more images
      if (req.files.indexOf(file) < req.files.length - 1) {
        pdfDoc.addPage();
      }
    }

    // Finalize the PDF
    pdfDoc.end();

    // Clean up uploaded files after sending
    res.on('finish', async () => {
      try {
        for (const file of req.files) {
          await unlinkAsync(file.path);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up files:', cleanupError);
      }
    });

  } catch (error) {
    console.error('Error converting PNG to PDF:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
    
    // Clean up files in case of error
    if (req.files) {
      for (const file of req.files) {
        try {
          await unlinkAsync(file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up files:', cleanupError);
        }
      }
    }
  }
};

module.exports = { convertPngToPdf };