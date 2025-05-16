const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

const tempDir = path.join(__dirname, '../temp');

const convertPdfToJson = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No PDF files provided' });
  }

  // Ensure temp directory exists
  if (!fssync.existsSync(tempDir)) {
    await fs.mkdir(tempDir, { recursive: true });
  }

  const jsonResults = [];

  try {
    // Process each PDF
    for (const file of req.files) {
      const dataBuffer = await fs.readFile(file.path);
      const data = await pdf(dataBuffer);

      const jsonContent = {
        fileName: file.originalname,
        text: data.text,
        numPages: data.numpages,
        info: data.info,
        metadata: data.metadata,
      };

      const parsedName = path.parse(file.originalname).name;
      const uniqueName = `${parsedName}_${uuidv4()}.json`;
      const jsonFilePath = path.join(tempDir, uniqueName);

      await fs.writeFile(jsonFilePath, JSON.stringify(jsonContent, null, 2));
      jsonResults.push({ jsonFilePath, downloadName: `${parsedName}_converted.json`, filePath: file.path });
    }

    if (jsonResults.length === 1) {
      const { jsonFilePath, downloadName, filePath } = jsonResults[0];
      res.download(jsonFilePath, downloadName, async (err) => {
        await fs.unlink(jsonFilePath);
        await fs.unlink(filePath);
      });
    } else {
      const zipName = `pdf_to_json_${uuidv4()}.zip`;
      const zipPath = path.join(tempDir, zipName);
      const output = fssync.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      for (const { jsonFilePath, downloadName } of jsonResults) {
        archive.file(jsonFilePath, { name: downloadName });
      }

      await archive.finalize();

      output.on('close', async () => {
        res.download(zipPath, 'pdf_to_json_conversion.zip', async () => {
          for (const { jsonFilePath, filePath } of jsonResults) {
            await fs.unlink(jsonFilePath);
            await fs.unlink(filePath);
          }
          await fs.unlink(zipPath);
        });
      });
    }
  } catch (error) {
    console.error('Error during PDF to JSON conversion:', error);
    res.status(500).json({ error: 'Failed to convert PDF to JSON' });
  }
};

module.exports = { convertPdfToJson };
