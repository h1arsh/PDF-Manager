const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');

const convertPdfToTxt = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No PDF file uploaded' });

    const pdfPath = file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const parsedData = await pdfParse(dataBuffer);

    // ✅ Ensure the outputs directory exists
    const outputDir = path.join(__dirname, '../outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputFileName = `${uuidv4()}.txt`;
    const outputPath = path.join(outputDir, outputFileName);

    fs.writeFileSync(outputPath, parsedData.text);

    res.download(outputPath, 'converted.txt', err => {
      fs.unlinkSync(pdfPath); // Clean up uploaded file
      fs.unlinkSync(outputPath); // Clean up output file
      if (err) console.error('Download error:', err);
    });
  } catch (err) {
    console.error('PDF to TXT conversion error:', err);
    res.status(500).json({ error: 'Failed to convert PDF to text' });
  }
};

module.exports = { convertPdfToTxt };
