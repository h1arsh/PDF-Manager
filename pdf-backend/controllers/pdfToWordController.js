const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph } = require('docx');

const convertPdfToWord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text || 'No text found in the PDF';

    // Create Word Document
    const doc = new Document({
      sections: [
        {
          children: text.split('\n').map(line => new Paragraph(line)),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Clean up uploaded PDF
    fs.unlinkSync(filePath);

    res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    console.error('Error converting PDF to Word:', err);
    res.status(500).send('Failed to convert PDF to Word');
  }
};

module.exports = { convertPdfToWord };
