const multer = require('multer');

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);

const ALLOWED_EXTENSIONS = /\.(pdf|docx)$/i;

const maxSizeMb = Number(process.env.MAX_UPLOAD_MB || 5);

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const extensionOk = ALLOWED_EXTENSIONS.test(file.originalname);
  const mimeOk = ALLOWED_MIME_TYPES.has(file.mimetype);

  if (!extensionOk || !mimeOk) {
    const err = new Error('Only PDF and DOCX resumes are supported.');
    err.status = 400;
    return cb(err);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
});

module.exports = upload;
