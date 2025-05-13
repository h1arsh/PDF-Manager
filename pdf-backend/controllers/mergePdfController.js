const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const mergePdfs = async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    // Clean up uploaded files
    req.files.forEach(file => fs.unlinkSync(file.path));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error('PDF Merge Error:', error);
    res.status(500).send('Failed to merge PDFs');
  }
};


module.exports = { mergePdfs };
