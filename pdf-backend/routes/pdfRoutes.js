const express = require('express');
const router = express.Router();
const { uploadPdf, uploadWord, uploadExcel, uploadPpt, uploadImages, uploadText  } = require('../config/multer');
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
const { convertPdfToTxt } = require('../controllers/pdfToTxtController');
const { convertWordToPdf } = require('../controllers/wordToPdfController');
const { convertExcelToPdf } = require('../controllers/excelToPdfController');
const { convertPptToPdf } = require('../controllers/pptToPdfController');
const { convertJpgToPdf } = require('../controllers/jpgToPdfController');
const { convertPngToPdf } = require('../controllers/pngToPdfController');
const { convertTextToPdf } = require('../controllers/textToPdfController');
const { removePdfProtection } = require('../controllers/removePdfProtectionController');
const { encryptPdf } = require('../controllers/pdfEncryptController');

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
router.post('/convert-to-txt', uploadPdf.single('pdf'), convertPdfToTxt);
router.post('/compress', uploadPdf.single('pdfFile'), compressPdf);
router.post('/convert-word-to-pdf', uploadWord.single('documents'), convertWordToPdf);
router.post('/convert-excel-to-pdf', uploadExcel.single('excelFile'), convertExcelToPdf);
router.post('/convert-ppt-to-pdf', uploadPpt.single('pptFile'), convertPptToPdf);
router.post('/convert-jpg-to-pdf', uploadImages.array('images'), convertJpgToPdf);
router.post('/convert-png-to-pdf', uploadImages.array('images'), convertPngToPdf);
router.post('/convert-text-to-pdf', uploadText.single('file'), convertTextToPdf);
router.post('/remove-protection', uploadPdf.single('pdfFile'), removePdfProtection);
router.post('/encrypt-pdf', uploadPdf.single('pdfFile'), encryptPdf);

module.exports = router;