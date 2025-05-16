const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Main controller
const compressPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const compressionLevel = req.body.compressionLevel || 'medium';
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, `../../temp/compressed_${Date.now()}.pdf`);

    try {
      // Compress using Ghostscript
      await compressWithGhostscript(inputPath, outputPath, compressionLevel);

      if (!fs.existsSync(outputPath)) {
        throw new Error('Compression failed - no output file created');
      }

      // Send compressed file to client
      res.download(outputPath, `compressed_${req.file.originalname}`, (err) => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
        if (err) console.error('Error sending file:', err);
      });
    } catch (error) {
      console.error('Ghostscript compression failed:', error);
      res.status(500).json({ error: 'Failed to compress PDF using Ghostscript' });
    }

  } catch (err) {
    console.error('Unhandled compression error:', err);
    res.status(500).json({ error: 'Internal server error during compression' });
  }
};

// Ghostscript compression logic
const compressWithGhostscript = async (inputPath, outputPath, level) => {
  // Default resolution based on compression level
  let resolution = 100; // medium

  switch (level) {
    case 'high':    // smallest file, lowest quality
      resolution = 34;
      break;
    case 'medium':  // decent quality
      resolution = 70;
      break;
    case 'low':     // best quality, least compression
    default:
      resolution = 100;
      break;
  }

  const command = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
-dNOPAUSE -dQUIET -dBATCH \
-dDownsampleColorImages=true -dColorImageResolution=${resolution} \
-dDownsampleGrayImages=true -dGrayImageResolution=${resolution} \
-dDownsampleMonoImages=true -dMonoImageResolution=${resolution} \
-sOutputFile="${outputPath}" "${inputPath}"`;

  await execAsync(command);
};


module.exports = { compressPdf };
