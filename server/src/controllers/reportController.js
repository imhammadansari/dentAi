const ReportModel = require('../models/reportModel');
const PatientModel = require('../models/patientModel');
const PDFDocument = require('pdfkit');
const axios = require('axios');

// ─── Helper: Build professional PDF ──────────────────────────────────────────
const buildPDF = (report, patientName) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        const GREEN = '#16a34a';
        const DARK = '#1a2e1a';
        const GRAY = '#6b7280';
        const RED = '#dc2626';
        const AMBER = '#d97706';
        const pageWidth = doc.page.width;
        const margin = 50;
        const contentWidth = pageWidth - margin * 2;

        // ── Header Banner
        doc.rect(0, 0, pageWidth, 110).fill(GREEN);
        doc.fontSize(26).fillColor('white').font('Helvetica-Bold')
            .text('DENT AI', margin, 28, { continued: true });
        doc.fontSize(12).font('Helvetica').fillColor('rgba(255,255,255,0.85)')
            .text('  -  Smart Dental Diagnostic Platform', { continued: false });
        doc.fontSize(10).fillColor('rgba(255,255,255,0.75)').font('Helvetica')
            .text('Powered by AI-assisted radiograph analysis', margin, 58);
        doc.fontSize(9).fillColor('rgba(255,255,255,0.7)')
            .text('Report ID: #' + report._id.toString().slice(-8).toUpperCase(), margin, 78)
            .text('Generated: ' + new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }), margin, 92);

        let y = 130;

        // ── Patient Info Card
        doc.rect(margin, y, contentWidth, 70).fill('#f0fdf4').stroke('#bbf7d0');
        doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11)
            .text('PATIENT INFORMATION', margin + 15, y + 10);
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Name:', margin + 15, y + 28, { continued: true })
            .fillColor(DARK).font('Helvetica-Bold').text('  ' + patientName, { continued: false });
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Scan Type:', margin + 15, y + 44, { continued: true })
            .fillColor(DARK).font('Helvetica-Bold').text('  ' + report.type, { continued: false });
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Total Issues Found:', margin + 250, y + 28, { continued: true })
            .fillColor(report.totalFound > 0 ? RED : GREEN).font('Helvetica-Bold')
            .text('  ' + report.totalFound, { continued: false });
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Date:', margin + 250, y + 44, { continued: true })
            .fillColor(DARK).font('Helvetica-Bold')
            .text('  ' + new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), { continued: false });

        y += 90;

        // ── Findings Section
        doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(13)
            .text('DIAGNOSTIC FINDINGS', margin, y);
        doc.moveTo(margin, y + 18).lineTo(margin + contentWidth, y + 18).stroke(GREEN);
        y += 26;

        if (!report.detections || report.detections.length === 0) {
            doc.rect(margin, y, contentWidth, 44).fill('#f0fdf4').stroke('#bbf7d0');
            doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(11)
                .text('No dental issues detected in this scan.', margin + 15, y + 14);
            y += 60;
        } else {
            report.detections.forEach((d, i) => {
                if (y > 720) { doc.addPage(); y = 50; }
                const cardH = 72;
                const severity = d.stage && d.stage.toLowerCase().includes('advanced') ? RED :
                    d.stage && d.stage.toLowerCase().includes('moderate') ? AMBER : GREEN;
                doc.rect(margin, y, contentWidth, cardH).fill('#fafafa').stroke('#e5e7eb');
                doc.rect(margin, y, 5, cardH).fill(severity);
                doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
                    .text('#' + (i + 1) + '  ' + ((d.stage || 'FINDING').replace(/_/g, ' ').toUpperCase()), margin + 18, y + 10);
                const conf = parseFloat(d.confidence) || 0;
                const confColor = conf >= 0.8 ? RED : conf >= 0.5 ? AMBER : GREEN;
                doc.font('Helvetica-Bold').fontSize(9).fillColor(confColor)
                    .text('Confidence: ' + d.confidence, margin + contentWidth - 110, y + 10);
                doc.font('Helvetica').fontSize(9.5).fillColor(GRAY)
                    .text('Diagnosis:', margin + 18, y + 28, { continued: true })
                    .fillColor(DARK).text('  ' + (d.explanation || 'N/A'), { width: contentWidth - 30, continued: false });
                y += cardH + 8;
            });
        }

        y += 10;

        // ── Comments
        if (report.comments) {
            if (y > 680) { doc.addPage(); y = 50; }
            doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(13)
                .text('COMMENTS & RECOMMENDATIONS', margin, y);
            doc.moveTo(margin, y + 18).lineTo(margin + contentWidth, y + 18).stroke(GREEN);
            y += 28;
            const commentLines = doc.heightOfString(report.comments, { width: contentWidth - 30, fontSize: 10 });
            const boxH = commentLines + 30;
            doc.rect(margin, y, contentWidth, boxH).fill('#fffbeb').stroke('#fde68a');
            doc.font('Helvetica').fontSize(10).fillColor(DARK)
                .text(report.comments, margin + 15, y + 12, { width: contentWidth - 30 });
            y += boxH + 20;
        }

        // ── Comparison Report
        if (report.comparisonReport) {
            if (y > 600) { doc.addPage(); y = 50; }
            doc.fillColor('#2563eb').font('Helvetica-Bold').fontSize(13)
                .text('AI COMPARISON ANALYSIS', margin, y);
            doc.moveTo(margin, y + 18).lineTo(margin + contentWidth, y + 18).stroke('#2563eb');
            y += 28;
            const compLines = doc.heightOfString(report.comparisonReport, { width: contentWidth - 30, fontSize: 10 });
            const compBoxH = compLines + 30;
            doc.rect(margin, y, contentWidth, compBoxH).fill('#eff6ff').stroke('#bfdbfe');
            doc.font('Helvetica').fontSize(10).fillColor(DARK)
                .text(report.comparisonReport, margin + 15, y + 12, { width: contentWidth - 30 });
            y += compBoxH + 20;
        }

        // ── Footer
        const footerY = doc.page.height - 55;
        doc.rect(0, footerY, pageWidth, 55).fill(GREEN);
        doc.font('Helvetica').fontSize(8.5).fillColor('rgba(255,255,255,0.85)')
            .text('This report is generated by DentAI and is intended for informational purposes only.', margin, footerY + 10, { align: 'center', width: contentWidth })
            .text('Always consult a qualified dental professional for diagnosis and treatment decisions.', margin, footerY + 24, { align: 'center', width: contentWidth })
            .text('DentAI Platform  -  Confidential Patient Record', margin, footerY + 38, { align: 'center', width: contentWidth });

        doc.end();
    });
};

// ─── CONTROLLER: Check if patient has previous reports ───────────────────────
exports.checkHasPreviousReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const count = await ReportModel.countDocuments({ patientId });
        res.status(200).json({ success: true, hasPrevious: count > 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Save Report (no PDF) ────────────────────────────────────────
exports.saveReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { totalFound, detections, annotatedImage, comments } = req.body;
        const patient = await PatientModel.findById(patientId);
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        const report = await ReportModel.create({
            patientId,
            patientName: patient.name,
            totalFound: totalFound || 0,
            detections: detections || [],
            annotatedImage: annotatedImage || null,
            comments: comments || '',
            status: 'saved'
        });

        res.status(200).json({ success: true, message: 'Report saved successfully', data: report });
    } catch (error) {
        console.error('[saveReport]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Generate Report — streams PDF directly as download ───────────
exports.generateReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { totalFound, detections, annotatedImage, comments } = req.body;
        const patient = await PatientModel.findById(patientId);
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        // Save record so it appears in Reports page
        const report = await ReportModel.create({
            patientId,
            patientName: patient.name,
            totalFound: totalFound || 0,
            detections: detections || [],
            annotatedImage: annotatedImage || null,
            comments: comments || '',
            status: 'generated'
        });

        // Build PDF
        const pdfBuffer = await buildPDF(report, patient.name);

        // Store base64 so patient can re-download from Reports page
        report.pdfBase64 = pdfBuffer.toString('base64');
        await report.save();

        // Stream directly to browser — triggers file download
        const filename = 'DentAI_Report_' + new Date().toISOString().slice(0, 10) + '_' + report._id.toString().slice(-6).toUpperCase() + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('[generateReport]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Download existing PDF by report ID ──────────────────────────
exports.downloadReport = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;
        const report = await ReportModel.findOne({ _id: id, patientId });
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        if (!report.pdfBase64) {
            // Re-generate PDF on the fly
            const patient = await PatientModel.findById(patientId);
            const pdfBuffer = await buildPDF(report, patient.name);
            report.pdfBase64 = pdfBuffer.toString('base64');
            await report.save();
            const filename = 'DentAI_Report_' + report._id.toString().slice(-6).toUpperCase() + '.pdf';
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
            res.setHeader('Content-Length', pdfBuffer.length);
            return res.send(pdfBuffer);
        }

        const pdfBuffer = Buffer.from(report.pdfBase64, 'base64');
        const filename = 'DentAI_Report_' + report._id.toString().slice(-6).toUpperCase() + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Get patient's all reports ────────────────────────────────────
exports.getMyReports = async (req, res) => {
    try {
        const patientId = req.user.id;
        const reports = await ReportModel.find({ patientId })
            .select('-annotatedImage -pdfBase64')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Get single report ───────────────────────────────────────────
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;
        const report = await ReportModel.findOne({ _id: id, patientId });
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Compare current scan with last report via Grok ──────────────
exports.compareWithLastReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { currentScan } = req.body;

        const lastReport = await ReportModel.findOne({ patientId }).sort({ createdAt: -1 });
        if (!lastReport) {
            return res.status(404).json({ success: false, message: 'No previous report found to compare with.' });
        }

        const patient = await PatientModel.findById(patientId);

        const prompt = `
You are a dental AI assistant. Compare the two dental X-ray scan reports below for patient "${patient?.name}" and provide a professional medical comparison analysis.

PREVIOUS REPORT (Date: ${new Date(lastReport.createdAt).toLocaleDateString()}):
- Total issues found: ${lastReport.totalFound}
- Detections: ${JSON.stringify(lastReport.detections)}
- Comments: ${lastReport.comments || 'None'}

CURRENT SCAN:
- Total issues found: ${currentScan.totalFound}
- Detections: ${JSON.stringify(currentScan.detections)}
- Comments: ${currentScan.comments || 'None'}

Please provide:
1. Overall comparison: Has the patient's dental health IMPROVED, WORSENED, or REMAINED STABLE?
2. Specific changes: List any new issues, resolved issues, or changes in severity.
3. Professional recommendation: What should the patient do next?
4. Motivational note to the patient about their progress.

Keep the response professional, clear, and patient-friendly. Format it as plain text paragraphs (no markdown).
`;

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ success: false, message: 'GROQ_API_KEY not set in .env file.' });
        }

        const groqRes = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                max_tokens: 700,
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const comparisonText = groqRes.data.choices[0].message.content;

        res.status(200).json({
            success: true,
            comparison: comparisonText,
            previousReport: { id: lastReport._id, date: lastReport.createdAt, totalFound: lastReport.totalFound }
        });

    } catch (error) {
        console.error('[compareWithLastReport]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CONTROLLER: Generate comparison PDF ─────────────────────────────────────
exports.generateComparisonReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { totalFound, detections, annotatedImage, comments, comparisonReport } = req.body;
        const patient = await PatientModel.findById(patientId);
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        const report = await ReportModel.create({
            patientId,
            patientName: patient.name,
            totalFound: totalFound || 0,
            detections: detections || [],
            annotatedImage: annotatedImage || null,
            comments: comments || '',
            comparisonReport: comparisonReport || '',
            status: 'generated'
        });

        const pdfBuffer = await buildPDF(report, patient.name);
        report.pdfBase64 = pdfBuffer.toString('base64');
        await report.save();

        const filename = 'DentAI_Comparison_' + new Date().toISOString().slice(0, 10) + '_' + report._id.toString().slice(-6).toUpperCase() + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('[generateComparisonReport]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};