const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../config/multer');
const { processPdf } = require('../controllers/pdfController');
const { deletePages } = require('../controllers/deletePageController');
const { addTextWatermark } = require('../controllers/watermarkController');

// Existing routes
router.post('/add-page-numbers', uploadPdf.single('pdfFile'), processPdf);
router.post('/delete-pages', uploadPdf.single('pdfFile'), deletePages);

// Text watermark route
router.post('/text-watermark', uploadPdf.array('pdfs'), addTextWatermark);

module.exports = router;