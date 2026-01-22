const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');

const upload = multer({ storage: multer.memoryStorage() }); // Image memory mein rakhta hai

// Route: POST /api/analysis/predict
router.post('/predict', upload.single('file'), aiController.analyzeXray);

module.exports = router;