const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../config/multer');
const { processPdf } = require('../controllers/pdfController');
const { deletePages } = require('../controllers/deletePageController');
const { addTextWatermark } = require('../controllers/watermarkController');
const { rotatePdf } = require('../controllers/rotatePdfController');
const { splitPdf } = require('../controllers/splitPdfController');
const { mergePdfs } = require('../controllers/mergePdfController');
const { convertPdfToWord } = require('../controllers/pdfToWordController');


// Existing routes
router.post('/add-page-numbers', uploadPdf.single('pdfFile'), processPdf);
router.post('/delete-pages', uploadPdf.single('pdfFile'), deletePages);

// Text watermark route
router.post('/text-watermark', uploadPdf.array('pdfs'), addTextWatermark);

// Rotate PDF route
router.post('/rotate', uploadPdf.array('files'), rotatePdf);

// Split PDF Route
router.post('/split', uploadPdf.array('files'), splitPdf);

// Merge PDF Route
router.post('/merge', uploadPdf.array('files'), mergePdfs);

// PDF to Word Route
router.post('/convert-to-word', uploadPdf.single('file'), convertPdfToWord);

module.exports = router;