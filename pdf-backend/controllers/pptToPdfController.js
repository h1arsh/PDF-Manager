const libre = require('libreoffice-convert');
const fs = require('fs');
const path = require('path');
libre.convertAsync = require('util').promisify(libre.convert);

exports.convertPptToPdf = async (req, res) => {
  let pptPath, pdfPath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    pptPath = req.file.path;
    const outputDir = path.join(__dirname, '../../converted');
    const fileName = path.basename(pptPath, path.extname(pptPath)) + '.pdf';
    pdfPath = path.join(outputDir, fileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const file = fs.readFileSync(pptPath);
    const pdfBuf = await libre.convertAsync(file, '.pdf', undefined);
    
    fs.writeFileSync(pdfPath, pdfBuf);

    res.download(pdfPath, fileName, (err) => {
      fs.unlinkSync(pptPath);
      fs.unlinkSync(pdfPath);
      if (err) throw err;
    });

  } catch (err) {
    console.error('Conversion error:', err);
    if (pptPath && fs.existsSync(pptPath)) fs.unlinkSync(pptPath);
    if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    
    res.status(500).json({ 
      error: 'Failed to convert PowerPoint to PDF',
      details: err.message 
    });
  }
};