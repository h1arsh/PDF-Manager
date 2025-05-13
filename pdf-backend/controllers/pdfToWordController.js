const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph } = require('docx');
const pdfParse = require('pdf-parse');

const pdfToWord = async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    const paragraphs = data.text
      .split('\n')
      .map(line => new Paragraph(line.trim()))
      .filter(p => p.root.length > 0);

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);

    const outputPath = path.join(__dirname, '../temp', `${Date.now()}.docx`);
    fs.writeFileSync(outputPath, buffer);

    // Clean up uploaded PDF
    fs.unlinkSync(req.file.path);

    res.download(outputPath, 'converted.docx', (err) => {
      if (err) console.error('Download error:', err);
      fs.unlinkSync(outputPath); // Clean up after sending
    });
  } catch (error) {
    console.error('PDF to Word Error:', error);
    res.status(500).send('Failed to convert PDF to Word');
  }
};

module.exports = {pdfToWord};