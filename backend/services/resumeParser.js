const mammoth = require('mammoth');

/**
 * Lazily require pdf-parse. Some versions of pdf-parse run a debug
 * self-test on import if required at the top of the module in certain
 * environments, so we require it inside the function that needs it.
 */
function getPdfParser() {
  return require('pdf-parse');
}

/**
 * Extracts plain text from an uploaded resume buffer.
 * @param {Buffer} buffer - raw file bytes (multer memory storage)
 * @param {string} mimetype
 * @param {string} originalName
 * @returns {Promise<{ text: string, wordCount: number }>}
 */
async function extractResumeText(buffer, mimetype, originalName) {
  let rawText = '';

  if (mimetype === 'application/pdf' || /\.pdf$/i.test(originalName)) {
    const pdfParse = getPdfParser();
    const data = await pdfParse(buffer);
    rawText = data.text || '';
  } else if (
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    /\.docx$/i.test(originalName)
  ) {
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value || '';
  } else {
    const err = new Error('Unsupported file type. Upload a PDF or DOCX resume.');
    err.status = 400;
    throw err;
  }

  const cleaned = rawText.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();

  if (!cleaned || cleaned.length < 30) {
    const err = new Error(
      'We could not read readable text from this resume. It may be a scanned image — try uploading a text-based PDF or DOCX.'
    );
    err.status = 422;
    throw err;
  }

  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;

  return { text: cleaned, wordCount };
}

module.exports = { extractResumeText };
