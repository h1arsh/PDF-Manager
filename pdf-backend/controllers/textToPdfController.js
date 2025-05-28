const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

// Constants
const PAGE_SIZES = Object.freeze({
  A4: { width: 595, height: 842 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  A5: { width: 420, height: 595 }
});

const MARGINS = Object.freeze({
  narrow: 36,
  normal: 72,
  wide: 108
});

const FONT_MAPPINGS = Object.freeze({
  'Arial': 'Helvetica',
  'Times New Roman': 'Times-Roman',
  'Courier New': 'Courier',
  'Helvetica': 'Helvetica',
  'Verdana': 'Helvetica'
});

const DEFAULT_OPTIONS = Object.freeze({
  filename: 'document.pdf',
  fontSize: 12,
  fontFamily: 'Arial',
  pageSize: 'A4',
  margin: 'normal',
  lineHeightMultiplier: 1.2
});

class PDFGenerator {
  constructor() {
    this.pdfDoc = null;
    this.currentPage = null;
    this.currentFont = null;
    this.options = {};
  }

  async initialize(options) {
    // Validate and convert numeric options
    const validatedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      fontSize: this.validateNumber(options.fontSize, DEFAULT_OPTIONS.fontSize),
      lineHeightMultiplier: this.validateNumber(options.lineHeightMultiplier, DEFAULT_OPTIONS.lineHeightMultiplier)
    };

    this.options = validatedOptions;
    this.pdfDoc = await PDFDocument.create();
    this.pdfDoc.registerFontkit(fontkit);
    
    this.setDocumentMetadata();
    this.currentFont = await this.getFont();
    this.addPage();
  }

  validateNumber(value, defaultValue) {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  setDocumentMetadata() {
    const { filename } = this.options;
    this.pdfDoc.setTitle(filename.replace('.pdf', ''));
    this.pdfDoc.setAuthor('PDF Verse');
    this.pdfDoc.setCreator('PDF Verse Text to PDF Converter');
  }

  async getFont() {
    const { fontFamily } = this.options;
    const pdfFontFamily = FONT_MAPPINGS[fontFamily] || FONT_MAPPINGS.Arial;
    return this.pdfDoc.embedFont(pdfFontFamily);
  }

  addPage() {
    const { pageSize } = this.options;
    const dimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;
    this.currentPage = this.pdfDoc.addPage([dimensions.width, dimensions.height]);
    return this.currentPage;
  }

  getTextDimensions() {
    const { pageSize, margin, fontSize } = this.options;
    const page = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;
    const marginSize = MARGINS[margin] || MARGINS.normal;
    
    return {
      width: page.width - (marginSize * 2),
      height: page.height - (marginSize * 2),
      margin: marginSize,
      lineHeight: fontSize * this.options.lineHeightMultiplier
    };
  }

  splitTextIntoLines(text) {
    const { fontSize } = this.options;
    const { width: textWidth } = this.getTextDimensions();
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.currentFont.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > textWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  async renderText(text) {
    const { fontSize } = this.options;
    const { margin, lineHeight, height: pageHeight } = this.getTextDimensions();
    let yPosition = pageHeight - margin - fontSize;

    const lines = this.splitTextIntoLines(text);

    for (const line of lines) {
      if (yPosition < margin) {
        this.addPage();
        yPosition = pageHeight - margin - fontSize;
      }

      this.currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: this.currentFont,
        color: rgb(0, 0, 0),
        lineHeight: lineHeight
      });

      yPosition -= lineHeight;
    }
  }

  async generate() {
    return this.pdfDoc.save();
  }
}

const convertTextToPdf = async (req, res) => {
  try {
    const { text, ...options } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res.status(400).json({ error: 'No text content or file provided' });
    }

    const generator = new PDFGenerator();
    await generator.initialize(options);

    // Get content from either text or file
    const content = text || await readFileAsync(file.path, 'utf8');
    await generator.renderText(content);

    const pdfBytes = await generator.generate();

    // Clean up if file was uploaded
    if (file) {
      await unlinkAsync(file.path).catch(console.error);
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${options.filename || DEFAULT_OPTIONS.filename}"`);
    
    // Send the PDF
    res.send(pdfBytes);

  } catch (error) {
    console.error('Error converting text to PDF:', error);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      await unlinkAsync(req.file.path).catch(console.error);
    }

    res.status(500).json({ 
      error: 'Failed to convert text to PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  convertTextToPdf
};