const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');
const reportController = require('../controllers/reportController');

// Patient report routes
router.get('/has-previous', verifyToken('patient'), reportController.checkHasPreviousReport);
router.post('/save', verifyToken('patient'), reportController.saveReport);
router.post('/generate', verifyToken('patient'), reportController.generateReport);
router.post('/compare', verifyToken('patient'), reportController.compareWithLastReport);
router.post('/generate-comparison', verifyToken('patient'), reportController.generateComparisonReport);
router.get('/my', verifyToken('patient'), reportController.getMyReports);
router.get('/download/:id', verifyToken('patient'), reportController.downloadReport);

// Admin report routes
router.get('/admin/all', verifyToken('admin'), isAdmin, reportController.adminGetAllReports);

// Dentist report routes
router.post('/dentist/save', verifyToken('dentist'), reportController.dentistSaveReport);
router.get('/dentist/patient/:patientId', verifyToken('dentist'), reportController.dentistGetPatientReports);

router.get('/:id', verifyToken('patient'), reportController.getReportById);

module.exports = router;