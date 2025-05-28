const fs = require('fs-extra');
const path = require('path');
const libre = require('libreoffice-convert');

const convertWordToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = '.pdf';
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, `../output/${Date.now()}_converted.pdf`);

    const docxBuf = fs.readFileSync(inputPath);

    libre.convert(docxBuf, ext, undefined, (err, done) => {
      if (err) {
        console.error(`Error converting file: ${err}`);
        return res.status(500).json({ message: 'Conversion failed' });
      }

      fs.writeFileSync(outputPath, done);

      res.download(outputPath, 'converted.pdf', async () => {
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { convertWordToPdf };
