const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');

// Allocate memory-buffer configuration block allocations to completely bypass disk writing wait loops
const upload = multer({ storage: multer.memoryStorage() }); 

// End Route Definition Mapping: POST /api/analysis/predict
router.post('/predict', upload.single('file'), aiController.analyzeXray);

module.exports = router;