const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
    stage: { type: String },
    explanation: { type: String },
    confidence: { type: String }
}, { _id: false });

const ReportSchema = new mongoose.Schema({
    patientId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients', required: true
    },
    patientName:
        { type: String },
    totalFound:
        { type: Number, default: 0 },
    detections:
        [DetectionSchema],
    annotatedImage:
        { type: String },
    pdfBase64:
        { type: String },
    comments:
        { type: String, default: '' },
    type:
        { type: String, default: 'Dental X-Ray AI Scan' },
    status:
        { type: String, default: 'saved' },
    comparisonReport:
        { type: String, default: null },
    createdAt:
        { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reports', ReportSchema);