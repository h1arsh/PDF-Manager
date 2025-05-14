const fs = require('fs');
const path = require('path');
const poppler = require('pdf-poppler');
const archiver = require('archiver');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const TEMP_DIR = path.join(__dirname, '../temp');
const OUTPUT_DIR = path.join(TEMP_DIR, 'output');
const UPLOAD_DIR = path.join(__dirname, '../uploads');

async function ensureDirs() {
  await mkdirp(OUTPUT_DIR);
}

// Convert entire PDF to JPG
async function convertPdfToJpg(pdfPath, outputDir) {
  const allJpgFiles = [];
  const outPrefix = path.basename(pdfPath, '.pdf');

  const options = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: outPrefix,
    page: null, // convert all pages
    dpi: 150,   // fixed default DPI
  };

  try {
    await poppler.convert(pdfPath, options);
    const files = fs.readdirSync(outputDir)
      .filter(f => f.endsWith('.jpg'))
      .map(f => path.join(outputDir, f));
    allJpgFiles.push(...files);
  } catch (err) {
    throw new Error(`Error converting PDF to JPG: ${err.message}`);
  }

  return allJpgFiles;
}

function zipFiles(files, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    output.on('close', () => resolve(zipPath));
    archive.on('error', err => reject(err));

    files.forEach(file => {
      archive.file(file, { name: path.basename(file) });
    });

    archive.finalize();
  });
}

async function convertPdfToJpgController(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded' });
    }

    await ensureDirs();
    const allImages = [];

    for (const file of req.files) {
      const pdfPath = file.path;
      const outputDir = path.join(OUTPUT_DIR, path.basename(pdfPath, '.pdf'));
      await mkdirp(outputDir);

      const jpgFiles = await convertPdfToJpg(pdfPath, outputDir);
      allImages.push(...jpgFiles);
    }

    if (allImages.length === 0) {
      return res.status(500).json({ error: 'No JPG images were generated' });
    }

    const zipPath = path.join(TEMP_DIR, `converted_${Date.now()}.zip`);
    await zipFiles(allImages, zipPath);

    res.download(zipPath, 'converted_images.zip', async err => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to send zip file' });
        }
      }

      // Cleanup
      try {
        fs.existsSync(zipPath) && fs.unlinkSync(zipPath);
        req.files.forEach(f => fs.unlinkSync(f.path));
        rimraf.sync(OUTPUT_DIR);
      } catch (e) {
        console.warn('Cleanup failed:', e.message);
      }
    });

  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      error: error.message || 'Failed to convert PDF to JPG',
    });
  }
}

module.exports = {
  convertPdfToJpgController,
};
