const multer = require('multer');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File is too large. Max size is ${process.env.MAX_UPLOAD_MB || 5}MB.`,
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  const status = err.status || 500;
  const message =
    status === 500 ? 'Something went wrong on our end. Please try again.' : err.message;

  res.status(status).json({ success: false, message });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found.' });
}

module.exports = { errorHandler, notFound };
