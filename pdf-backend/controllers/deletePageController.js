const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdf-lib').PDFDocument;
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const deletePages = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  if (!req.body.pageNumbers) {
    if (req.file.path) {
      await unlinkAsync(req.file.path).catch(err => console.error('Error deleting file:', err));
    }
    return res.status(400).json({ error: 'No page numbers provided' });
  }

  try {
    // Parse the page numbers to delete
    const pagesToDelete = parsePageNumbers(req.body.pageNumbers);
    if (pagesToDelete.length === 0) {
      if (req.file.path) {
        await unlinkAsync(req.file.path).catch(err => console.error('Error deleting file:', err));
      }
      return res.status(400).json({ error: 'Invalid page numbers format' });
    }

    // Read the uploaded file
    const pdfBytes = await fs.promises.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get total pages
    const totalPages = pdfDoc.getPageCount();
    
    // Validate page numbers
    const invalidPages = pagesToDelete.filter(page => page < 1 || page > totalPages);
    if (invalidPages.length > 0) {
      if (req.file.path) {
        await unlinkAsync(req.file.path).catch(err => console.error('Error deleting file:', err));
      }
      return res.status(400).json({ 
        error: `Invalid page numbers: ${invalidPages.join(', ')}. PDF has only ${totalPages} pages.`
      });
    }

    // Create a new PDF and copy all pages except the ones to delete
    const newPdfDoc = await PDFDocument.create();
    const pageIndices = Array.from({ length: totalPages }, (_, i) => i)
      .filter(index => !pagesToDelete.includes(index + 1)); // +1 because pages are 1-indexed

    const pages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    pages.forEach(page => newPdfDoc.addPage(page));

    // Save the modified PDF
    const modifiedPdfBytes = await newPdfDoc.save();
    
    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="modified_${req.file.originalname}"`);
    
    // Send the modified PDF
    res.send(modifiedPdfBytes);

  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  } finally {
    // Clean up: delete the uploaded file
    if (req.file && req.file.path) {
      await unlinkAsync(req.file.path).catch(err => console.error('Error deleting file:', err));
    }
  }
};

// Helper function to parse page numbers input (e.g., "1,3-5,7" => [1,3,4,5,7])
function parsePageNumbers(input) {
  if (!input) return [];
  
  const parts = input.split(',');
  const pages = new Set();
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = Number(trimmed);
      if (!isNaN(page)) {
        pages.add(page);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

module.exports = {
  deletePages
};