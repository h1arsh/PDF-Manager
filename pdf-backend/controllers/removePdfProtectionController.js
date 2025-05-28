const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const removePdfProtection = async (req, res) => {
  const outputDir = path.join(__dirname, '../public/outputs');
  
  try {
    // 1. Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { password } = req.body;
    const inputPath = req.file.path;

    // 2. Create output directory if needed
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 3. Generate output filename
    const originalName = path.parse(req.file.originalname).name;
    const outputFilename = `${originalName}_unprotected.pdf`;
    const outputPath = path.join(outputDir, outputFilename);

    // 4. Build qpdf command
    const command = password
      ? `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`
      : `qpdf --decrypt "${inputPath}" "${outputPath}"`;

    // 5. Execute command with detailed error handling
    try {
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error('qpdf stderr:', stderr);
        throw new Error(stderr.includes('invalid password') 
          ? 'Incorrect password provided' 
          : 'PDF processing failed');
      }

      // Verify output file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('Output file was not created');
      }

      // Stream the result
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);
      
      const fileStream = fs.createReadStream(outputPath);
      fileStream.pipe(res);
      
      fileStream.on('close', () => {
        try {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        } catch (err) {
          console.error('Error cleaning up files:', err);
        }
      });

    } catch (error) {
      console.error('qpdf error:', error);
      throw new Error(error.stderr?.includes('password') 
        ? 'Incorrect or missing password' 
        : 'Failed to process PDF');
    }

  } catch (error) {
    console.error('Controller error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { removePdfProtection };