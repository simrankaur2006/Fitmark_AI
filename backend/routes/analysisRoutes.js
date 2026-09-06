const express = require('express');
const upload = require('../middleware/upload');
const {
  createAnalysis,
  listAnalyses,
  getAnalysis,
  deleteAnalysis,
} = require('../controllers/analysisController');

const router = express.Router();

router.post('/', upload.single('resume'), createAnalysis);
router.get('/', listAnalyses);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);

module.exports = router;
