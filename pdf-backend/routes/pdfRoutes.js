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
const { convertPdfToExcel } = require('../controllers/pdfToExcelController');
const { convertPdfToPpt } = require('../controllers/pdfToPptController');
const { convertPdfToJpgController } = require('../controllers/pdfToJpgController');
const { convertPdfToPng } = require('../controllers/pdfToPngController');
const { convertPdfToJson } = require('../controllers/pdfToJsonController');
const { compressPdf } = require('../controllers/compressPdfController');
const { convertPdfToTiff } = require('../controllers/pdfToTiffController');
const { convertPdfToTxt } = require('../controllers/pdfToTxtController');
// const { encryptPdf } = require('../controllers/pdfEncryptController');


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

// PDF to Excel Route
router.post('/convert-to-excel', uploadPdf.array('files'), convertPdfToExcel);

// PDF to Excel Route
router.post('/convert-to-ppt', uploadPdf.array('files'), convertPdfToPpt);

// PDF to JPG Route
// Change from single file to multiple files
router.post('/convert-to-jpg', uploadPdf.array('files'), convertPdfToJpgController);

router.post('/convert-to-png', uploadPdf.single('file'), convertPdfToPng);

router.post('/convert-to-json', uploadPdf.array('files'), convertPdfToJson);

router.post('/convert-to-tiff', uploadPdf.single('file'), convertPdfToTiff);

router.post('/convert-to-txt', uploadPdf.single('pdf'), convertPdfToTxt);

// router.post('/encrypt', uploadPdf.single('pdfFile'), encryptPdf);

router.post('/compress', uploadPdf.single('pdfFile'), compressPdf);


module.exports = router;