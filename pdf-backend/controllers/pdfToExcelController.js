const fs = require('fs');
const path = require('path');
const pdf2table = require('pdf2table');
const excel = require('excel4node');

function validateSelectedPages(selectedPages, totalPages) {
  const regex = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
  return regex.test(selectedPages);
}

function applyCellStyle(cell, isHeader = false) {
  const style = {
    font: isHeader ? { bold: true, name: 'Arial', size: 12 } : { name: 'Arial', size: 12 },
    border: {
      left: { style: 'thin', color: '#000000' },
      right: { style: 'thin', color: '#000000' },
      top: { style: 'thin', color: '#000000' },
      bottom: { style: 'thin', color: '#000000' }
    }
  };
  cell.style(style);
}

function handleSelectedPages(rows, selectedPages, totalPages) {
  if (!selectedPages) return rows;

  let selectedLines = [];
  let pageRanges = selectedPages.split(',').map(range => range.split('-').map(Number));

  pageRanges.forEach(range => {
    let [start, end] = range;
    end = end || start;

    start = Math.max(1, Math.min(start, totalPages));
    end = Math.max(1, Math.min(end, totalPages));

    for (let i = start; i <= end; i++) {
      selectedLines.push(...rows[i - 1]);
    }
  });

  return selectedLines;
}

function determineNumberOfColumns(rows) {
  const firstRowItem = rows[0];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i] === firstRowItem) {
      return i;
    }
  }
  return rows.length;
}

function flattenTables(rows, numberOfColumns) {
  const tables = [];
  for (let i = 0; i < rows.length; i += numberOfColumns) {
    const tableSegment = rows.slice(i, i + numberOfColumns);
    tables.push(tableSegment);
  }
  return tables.reduce((flattened, table) => flattened.concat(table), []);
}

exports.convertPdfToExcel = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No PDF files uploaded' });
    }

    const format = req.body.selectedFormat || '.xlsx';
    const selectedPages = req.body.selectedPages;
    const tableOption = req.body.tableOption;

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('PDF Data');

    for (const file of files) {
      const fileBuffer = fs.readFileSync(file.path);

      await new Promise((resolve, reject) => {
        pdf2table.parse(fileBuffer, async (err, rows, pages) => {
          if (err) {
            return reject(err);
          }

          if (selectedPages && !validateSelectedPages(selectedPages, pages.length)) {
            return res.status(400).json({ message: 'Invalid selected pages range.' });
          }

          let processedRows = handleSelectedPages(rows, selectedPages, pages.length);

          if (tableOption === 'Flatten') {
            const numCols = determineNumberOfColumns(processedRows);
            processedRows = flattenTables(processedRows, numCols);
          }

          worksheet.cell(worksheet.lastUsedRow + 1, 1).string(`File: ${file.originalname}`);
          processedRows.forEach((row, rowIndex) => {
            row.forEach((cellValue, cellIndex) => {
              const cell = worksheet.cell(worksheet.lastUsedRow + 1, cellIndex + 1);
              cell.string(cellValue || '');
              applyCellStyle(cell, rowIndex === 0);
            });
          });

          worksheet.cell(worksheet.lastUsedRow + 1, 1).string(''); // Empty row after file
          resolve();
        });
      });
    }

    const outputDir = path.join(__dirname, '../output');
    fs.mkdirSync(outputDir, { recursive: true });

    const outputFileName = `converted_${Date.now()}${format}`;
    const outputPath = path.join(outputDir, outputFileName);

    const buffer = await workbook.writeToBuffer();
    fs.writeFileSync(outputPath, buffer);

    res.download(outputPath, outputFileName, () => {
      files.forEach(file => fs.unlinkSync(file.path));
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('Error converting PDF to Excel:', error);
    res.status(500).json({ message: 'Failed to convert PDF to Excel' });
  }
};
