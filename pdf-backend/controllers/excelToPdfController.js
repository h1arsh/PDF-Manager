const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.convertExcelToPdf = async (req, res) => {
  let excelPath, pdfPath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    excelPath = req.file.path;
    const outputDir = path.join(__dirname, '../../converted');
    const fileName = path.basename(excelPath, path.extname(excelPath)) + '.pdf';
    pdfPath = path.join(outputDir, fileName);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);

    // Create PDF document
    const pdfDoc = new PDFDocument({ 
      size: 'A4', 
      margin: 30,
      bufferPages: true
    });

    const stream = fs.createWriteStream(pdfPath);
    pdfDoc.pipe(stream);

    // Process worksheets
    const worksheetCount = workbook.worksheets.length;
    for (let i = 0; i < worksheetCount; i++) {
      const worksheet = workbook.worksheets[i];
      
      // Add worksheet title
      pdfDoc.fontSize(14).font('Helvetica-Bold')
        .text(worksheet.name, { align: 'center', underline: true });
      pdfDoc.moveDown(0.5);

      // Calculate column widths
      const colWidths = calculateColumnWidths(worksheet);
      let tableTop = pdfDoc.y; // Changed from const to let

      // Draw table headers
      drawTableHeader(pdfDoc, worksheet, colWidths, tableTop);

      // Process rows in batches
      const rowCount = worksheet.rowCount;
      const batchSize = 100;
      
      for (let rowNum = 2; rowNum <= rowCount; rowNum += batchSize) {
        const endRow = Math.min(rowNum + batchSize - 1, rowCount);
        await processRowBatch(pdfDoc, worksheet, rowNum, endRow, colWidths);
        
        // Add new page if needed (now using let for tableTop)
        if (pdfDoc.y > pdfDoc.page.height - 50) {
          pdfDoc.addPage();
          tableTop = 30; // This is where the error was occurring
        }
      }

      // Add page break if not last worksheet
      if (i < worksheetCount - 1) {
        pdfDoc.addPage();
      }
    }

    pdfDoc.end();

    // Wait for PDF generation to complete
    await new Promise(resolve => stream.on('finish', resolve));

    // Stream the PDF file for download
    const fileStream = fs.createReadStream(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Clean up files
      fs.unlinkSync(excelPath);
      fs.unlinkSync(pdfPath);
    });

  } catch (err) {
    console.error('Conversion error:', err);
    // Clean up any created files
    if (excelPath && fs.existsSync(excelPath)) fs.unlinkSync(excelPath);
    if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    
    res.status(500).json({ 
      error: 'Failed to convert Excel to PDF',
      details: err.message 
    });
  }
};

// Helper functions remain the same
function calculateColumnWidths(worksheet) {
  const colWidths = [];
  worksheet.columns.forEach(column => {
    const headerWidth = column.header ? column.header.length * 7 : 0;
    const contentWidth = column.width ? column.width / 5 : 0;
    colWidths.push(Math.max(headerWidth, contentWidth, 60));
  });
  return colWidths;
}

function drawTableHeader(pdfDoc, worksheet, colWidths, tableTop) {
  pdfDoc.font('Helvetica-Bold');
  let x = pdfDoc.x;
  
  worksheet.columns.forEach((column, colIndex) => {
    const header = column.header || `Column ${colIndex + 1}`;
    pdfDoc.text(header, x + 2, tableTop + 2, {
      width: colWidths[colIndex] - 4,
      align: 'left'
    });
    
    pdfDoc.rect(x, tableTop, colWidths[colIndex], 20).stroke();
    x += colWidths[colIndex];
  });
  
  pdfDoc.font('Helvetica');
  pdfDoc.y = tableTop + 22;
}

async function processRowBatch(pdfDoc, worksheet, startRow, endRow, colWidths) {
  for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
    const row = worksheet.getRow(rowNum);
    const rowY = pdfDoc.y;
    let x = pdfDoc.x;
    
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const value = cell.text || '';
      const cellWidth = colWidths[colNumber - 1];
      
      pdfDoc.rect(x, rowY, cellWidth, 20).stroke();
      pdfDoc.text(value, x + 2, rowY + 2, {
        width: cellWidth - 4,
        align: 'left'
      });
      
      x += cellWidth;
    });
    
    pdfDoc.y = rowY + 20;
    pdfDoc.x = 30;
  }
}