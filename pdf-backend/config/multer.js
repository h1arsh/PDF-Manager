const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

// Safer directory creation
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// Enhanced file filters with extension checks
const createFileFilter = (allowedMimeTypes, allowedExtensions, errorMessage) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(errorMessage), false);
    }
  };
};

// File type configurations
const fileTypeConfigs = {
  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    errorMsg: 'Only PDF files (.pdf) are allowed!'
  },
  word: {
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    extensions: ['.docx', '.doc'],
    errorMsg: 'Only Word files (.doc or .docx) are allowed!'
  },
  excel: {
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ],
    extensions: ['.xls', '.xlsx', '.csv'],
    errorMsg: 'Only Excel/CSV files (.xls, .xlsx or .csv) are allowed!'
  },
  ppt: {
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    extensions: ['.ppt', '.pptx'],
    errorMsg: 'Only PowerPoint files (.ppt or .pptx) are allowed!'
  },
  image: {
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/tiff',
      'image/bmp'
    ],
    extensions: ['.jpeg', '.jpg', '.png', '.webp', '.tiff', '.bmp'],
    errorMsg: 'Only image files (JPEG, JPG, PNG, WebP, TIFF, BMP) are allowed!'
  },
  text: {
    mimeTypes: ['text/plain'],
    extensions: ['.txt'],
    errorMsg: 'Only text files (.txt) are allowed!'
  }
};

// Create upload configurations
const createUploader = (type, options = {}) => {
  const config = fileTypeConfigs[type];
  return multer({
    storage,
    fileFilter: createFileFilter(config.mimeTypes, config.extensions, config.errorMsg),
    limits: {
      fileSize: options.fileSize || 15 * 1024 * 1024, // Default 15MB
      files: options.files || 1
    }
  });
};

// Configure uploaders
const uploadPdf = createUploader('pdf', { 
  fileSize: 15 * 1024 * 1024, 
  files: 5 
});

const uploadWord = createUploader('word', { 
  fileSize: 15 * 1024 * 1024 
});

const uploadExcel = createUploader('excel', { 
  fileSize: 15 * 1024 * 1024 
});

const uploadPpt = createUploader('ppt', { 
  fileSize: 25 * 1024 * 1024 
});

const uploadImages = createUploader('image', { 
  fileSize: 12 * 1024 * 1024,
  files: 30 
});

// Special configuration for PDF conversion
const uploadForPdfConversion = createUploader('image', {
  fileSize: 15 * 1024 * 1024,
  files: 50
});

const uploadText = createUploader('text', { 
  fileSize: 10 * 1024 * 1024 // 10MB
});

module.exports = {
  uploadPdf,
  uploadWord,
  uploadExcel,
  uploadPpt,
  uploadImages,
  uploadForPdfConversion,
  storage, // Exporting storage for potential direct use
  uploadText
};