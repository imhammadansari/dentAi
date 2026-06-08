const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const reportController = require('../controllers/reportController');

router.use(verifyToken);

router.get('/has-previous', reportController.checkHasPreviousReport);
router.post('/save', reportController.saveReport);
router.post('/generate', reportController.generateReport);
router.post('/compare', reportController.compareWithLastReport);
router.post('/generate-comparison', reportController.generateComparisonReport);
router.get('/my', reportController.getMyReports);
router.get('/download/:id', reportController.downloadReport);
router.get('/:id', reportController.getReportById);

module.exports = router;