const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const probe = require('probe-image-size');

const convertJpgToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const { layout = 'portrait', margin = 'medium' } = req.body;
    const marginSizes = {
      small: 18,   // 0.25 inch (72 dpi)
      medium: 36,  // 0.5 inch
      large: 72,   // 1 inch
      none: 0
    };

    const marginSize = marginSizes[margin] || marginSizes.medium;

    // Create a new PDF document
    const doc = new PDFDocument({
      autoFirstPage: false // We'll add pages manually
    });

    // Generate a unique filename
    const outputFilename = `converted-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../temp', outputFilename);
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Process each image
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imagePath = file.path;

      // Get image dimensions using probe-image-size
      let dimensions;
      try {
        const readStream = fs.createReadStream(imagePath);
        dimensions = await probe(readStream);
        readStream.close();
        
        if (!dimensions) {
          throw new Error('Could not determine image dimensions');
        }
      } catch (err) {
        console.error(`Error reading image dimensions for ${file.originalname}:`, err);
        throw new Error(`Invalid image file: ${file.originalname}`);
      }

      // Determine page options based on layout selection
      let pageOptions = {
        margin: marginSize
      };

      switch (layout) {
        case 'portrait':
          pageOptions.layout = 'portrait';
          break;
        case 'landscape':
          pageOptions.layout = 'landscape';
          break;
        case 'square':
          pageOptions.size = [612, 612]; // 8.5x8.5 inches
          break;
        case 'auto':
          // Use image's natural dimensions
          pageOptions.size = [dimensions.width, dimensions.height];
          break;
        default:
          pageOptions.layout = 'portrait';
      }

      // Add page with the determined options
      doc.addPage(pageOptions);

      // Calculate available space considering margins
      const availableWidth = doc.page.width - (marginSize * 2);
      const availableHeight = doc.page.height - (marginSize * 2);

      // Add image to the page
      doc.image(imagePath, {
        fit: [availableWidth, availableHeight],
        align: 'center',
        valign: 'center'
      });
    }

    // Finalize the PDF
    doc.end();

    // When PDF is finished, send it to client
    stream.on('finish', () => {
      res.download(outputPath, 'converted.pdf', (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).json({ message: 'Error generating PDF' });
        }
        
        // Clean up: delete the temporary files
        fs.unlinkSync(outputPath);
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    });

  } catch (error) {
    console.error('Error in JPG to PDF conversion:', error);
    res.status(500).json({ message: error.message || 'Error converting images to PDF' });
    
    // Clean up any temporary files in case of error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
  }
};

module.exports = {
  convertJpgToPdf
};