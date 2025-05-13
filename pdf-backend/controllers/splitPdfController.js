const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const AdmZip = require('adm-zip');

exports.splitPdf = async (req, res) => {
  try {
    const files = req.files;
    const pageRanges = req.body.pageRanges; // e.g. "1-2,5-6"
    const outputDir = path.join(__dirname, '../outputs');
    const zip = new AdmZip();

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const ranges = pageRanges
      .split(',')
      .map(range => {
        const [start, end] = range.split('-').map(n => parseInt(n.trim(), 10));
        return { start, end: end || start };
      });

    for (const file of files) {
      const fileBuffer = fs.readFileSync(file.path);
      const originalPdf = await PDFDocument.load(fileBuffer);

      for (let i = 0; i < ranges.length; i++) {
        const { start, end } = ranges[i];

        if (start < 1 || end > originalPdf.getPageCount()) {
          return res.status(400).json({ error: `Invalid page range: ${start}-${end}` });
        }

        const newPdf = await PDFDocument.create();
        for (let pageIndex = start - 1; pageIndex <= end - 1; pageIndex++) {
          const [copiedPage] = await newPdf.copyPages(originalPdf, [pageIndex]);
          newPdf.addPage(copiedPage);
        }

        const splitBuffer = await newPdf.save();
        const filename = `split_${Date.now()}_${i + 1}.pdf`;
        const outputPath = path.join(outputDir, filename);

        fs.writeFileSync(outputPath, splitBuffer);
        zip.addLocalFile(outputPath);
      }

      // Cleanup uploaded file
      fs.unlinkSync(file.path);
    }

    // Create zip file
    const zipName = `split_files_${Date.now()}.zip`;
    const zipPath = path.join(outputDir, zipName);
    zip.writeZip(zipPath);

    res.download(zipPath, zipName, err => {
      if (err) {
        console.error('Error sending zip:', err);
      }

      // Cleanup zip and outputs after sending
      fs.unlinkSync(zipPath);
      fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.pdf'))
        .forEach(file => fs.unlinkSync(path.join(outputDir, file)));
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while splitting the PDF.' });
  }
};
