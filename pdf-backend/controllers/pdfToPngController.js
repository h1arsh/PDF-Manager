const path = require('path');
const fs = require('fs');
const pdf = require('pdf-poppler'); // FIXED
const archiver = require('archiver');

const parsePageRange = (rangeString) => {
  const pages = new Set();
  const parts = rangeString.split(',');

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      pages.add(Number(part));
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
};

const convertPdfToPng = async (req, res) => {
  const file = req.file;
  const { conversionType, pageRange } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const pdfPath = path.resolve(file.path);
  const outputDir = path.resolve(`output_${Date.now()}`);
  fs.mkdirSync(outputDir);

  try {
    const options = {
      format: 'png',
      out_dir: outputDir,
      out_prefix: path.parse(file.originalname).name,
      page: null
    };

    if (conversionType === 'range') {
      const pages = parsePageRange(pageRange);
      for (const page of pages) {
        await pdf.convert(pdfPath, { ...options, page }); // FIXED
      }
    } else {
      await pdf.convert(pdfPath, options); // FIXED
    }

    const zipPath = path.resolve(`converted_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipPath, () => {
        fs.unlinkSync(zipPath);
        fs.rmSync(outputDir, { recursive: true, force: true });
        fs.unlinkSync(pdfPath);
      });
    });

    archive.on('error', err => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();

  } catch (err) {
    console.error(err);
    fs.unlinkSync(pdfPath);
    fs.rmSync(outputDir, { recursive: true, force: true });
    return res.status(500).json({ error: 'Failed to convert PDF to PNG' });
  }
};

module.exports = { convertPdfToPng };
