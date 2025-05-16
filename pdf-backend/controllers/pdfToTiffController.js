const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

exports.convertPdfToTiff = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file provided' });
  }

  const inputPath = req.file.path;
  const baseOutput = path.join(__dirname, '..', 'outputs', `${Date.now()}_page`);
  const outputPattern = `${baseOutput}-%d.tiff`; // multi-page: -1.tiff, -2.tiff...

  // Use pdftoppm to convert PDF pages to TIFF images
  const command = `pdftoppm -tiff -r 150 "${inputPath}" "${baseOutput}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Conversion error:', stderr);
      return res.status(500).json({ error: 'Failed to convert PDF to TIFF' });
    }

    // Find generated TIFF files
    fs.readdir(path.join(__dirname, '..', 'outputs'), (err, files) => {
      if (err) return res.status(500).json({ error: 'Error reading output files' });

      const tiffFiles = files
        .filter(file => file.startsWith(path.basename(baseOutput)) && file.endsWith('.tiff'))
        .map(file => path.join(__dirname, '..', 'outputs', file));

      if (tiffFiles.length === 0) {
        return res.status(500).json({ error: 'No TIFF files generated' });
      }

      // If only one page, send it directly
      if (tiffFiles.length === 1) {
        res.download(tiffFiles[0], () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(tiffFiles[0]);
        });
      } else {
        // Zip multiple TIFFs if multi-page
        const zipPath = `${baseOutput}.zip`;
        const zipCommand = `zip -j "${zipPath}" ${tiffFiles.join(' ')}`;

        exec(zipCommand, () => {
          res.download(zipPath, () => {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(zipPath);
            tiffFiles.forEach(file => fs.unlinkSync(file));
          });
        });
      }
    });
  });
};
