// controllers/pdfToPptController.js
const fs = require('fs');
const officegen = require('officegen');
const pdfParse = require('pdf-parse');

exports.convertPdfToPpt = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    const pptx = officegen('pptx');
    
    // Presentation settings
    pptx.setDocTitle('PDF to PPT Conversion');
    const slideWidth = 10; // inches
    const slideHeight = 7.5; // inches
    const margin = 0.5; // inches
    const baseLineHeight = 0.25; // inches
    const fontSize = 12; // points
    const titleFontSize = 20;
    const subTitleFontSize = 16;

    for (const file of req.files) {
      if (!file.mimetype.includes('application/pdf')) {
        continue;
      }

      const pdfBuffer = fs.readFileSync(file.path);
      const pdfDocument = await pdfParse(pdfBuffer);

      // Split text by pages (form feed character)
      const pages = pdfDocument.text.split(/\f/);

      // Process each page
      for (const pageText of pages) {
        let slide = pptx.makeNewSlide();
        slide.back = 'ffffff'; // White background
        
        // Split into paragraphs (assuming double newlines separate sections)
        const paragraphs = pageText.split(/\n\s*\n/);
        
        let currentY = margin;
        
        for (const paragraph of paragraphs) {
          if (paragraph.trim() === '') continue;
          
          // Clean up the text (remove excessive spaces and line breaks)
          const cleanText = paragraph.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
          
          // Determine text type (heading, subheading, or normal text)
          let textType = 'normal';
          if (cleanText.length < 30) {
            if (cleanText === cleanText.toUpperCase()) {
              textType = 'heading';
            } else if (cleanText.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*[.:]?$/)) {
              textType = 'subheading';
            }
          }

          // Calculate required height based on text length and type
          const avgCharsPerLine = (slideWidth - (margin * 2)) * 6; // Approx chars per line
          const lineCount = Math.ceil(cleanText.length / avgCharsPerLine);
          const textHeight = (textType === 'heading' ? 0.6 : 
                            textType === 'subheading' ? 0.4 : 
                            baseLineHeight * lineCount);
          
          // Check if we need a new slide
          if (currentY + textHeight > slideHeight - margin) {
            slide = pptx.makeNewSlide();
            slide.back = 'ffffff';
            currentY = margin;
          }

          // Add text to slide with appropriate formatting
          slide.addText(cleanText, {
            x: margin,
            y: currentY,
            w: slideWidth - (margin * 2),
            h: textHeight,
            fontSize: textType === 'heading' ? titleFontSize : 
                    textType === 'subheading' ? subTitleFontSize : 
                    fontSize,
            fontFace: 'Arial',
            bold: textType === 'heading',
            color: textType === 'heading' ? '2d2d2d' : 
                  textType === 'subheading' ? '3a3a3a' : 
                  '4a4a4a',
            align: 'left',
            valign: 'top',
            margin: 0.1 // Small margin between text elements
          });
          
          // Update Y position for next element
          currentY += textHeight + (textType === 'heading' ? 0.2 : 0.1);
        }
      }

      // Remove the uploaded file after processing
      fs.unlinkSync(file.path);
    }

    // Set response headers for PowerPoint download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pptx');

    // Generate and stream PowerPoint file
    pptx.generate(res, {
      'finalize': function() {
        console.log('PPTX file generated successfully');
      },
      'error': function(err) {
        console.error('Error generating PPTX:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error generating presentation', error: err.message });
        }
      }
    });

  } catch (err) {
    console.error('Conversion error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Conversion failed', error: err.message });
    }
  }
};