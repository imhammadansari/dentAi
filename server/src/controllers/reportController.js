const ReportModel = require('../models/reportModel');
const PatientModel = require('../models/patientModel');
const DentistModel = require('../models/dentistModel');
const PDFDocument = require('pdfkit');
const axios = require('axios');

// ─── Helper: Build professional PDF ──────────────────────────────────────────
const buildPDF = (report, patientName) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 0, size: 'A4', autoFirstPage: true });
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
        const pageHeight = doc.page.height;
        const FOOTER_H = 55;
        const SAFE_BOTTOM = pageHeight - FOOTER_H - 10;
        const checkPage = (neededHeight, currentY) => {
            if (currentY + neededHeight > SAFE_BOTTOM) {
                doc.addPage();
                return margin;
            }
            return currentY;
        };

        doc.rect(0, 0, pageWidth, 110).fill(GREEN);
        doc.fontSize(26).fillColor('white').font('Helvetica-Bold')
            .text('DENT AI', margin, 22);
        doc.fontSize(10).fillColor('rgba(255,255,255,0.75)').font('Helvetica')
            .text('Powered by AI-assisted radiograph analysis', margin, 52);
        doc.fontSize(9).fillColor('rgba(255,255,255,0.7)')
            .text('Report ID: ' + report._id.toString(), margin, 70)
            .text('Generated: ' + new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }), margin, 84);
        let y = 125;

        // Patient Info Card
        y = checkPage(80, y);
        doc.rect(margin, y, contentWidth, 70).fill('#f0fdf4').stroke('#bbf7d0');
        doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11)
            .text('PATIENT INFORMATION', margin + 15, y + 10);
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Name:', margin + 15, y + 28, { continued: true })
            .fillColor(DARK).font('Helvetica-Bold').text('  ' + patientName, { continued: false });
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Scan Type:', margin + 15, y + 44, { continued: true })
            .fillColor(DARK).font('Helvetica-Bold').text('  ' + (report.type || 'Dental X-Ray AI Scan'), { continued: false });
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Total Issues Found:', margin + 250, y + 28, { continued: true })
            .fillColor(report.totalFound > 0 ? RED : GREEN).font('Helvetica-Bold')
            .text('  ' + report.totalFound, { continued: false });
        doc.font('Helvetica').fontSize(10).fillColor(GRAY)
            .text('Date:', margin + 250, y + 44, { continued: true })
            .fillColor(DARK).font('Helvetica-Bold')
            .text('  ' + new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), { continued: false });

        // Uploaded by tag
        if (report.uploadedBy === 'dentist' && report.dentistName) {
            doc.font('Helvetica').fontSize(9).fillColor(GRAY)
                .text('Uploaded by:', margin + 15, y + 58, { continued: true })
                .fillColor('#1d4ed8').font('Helvetica-Bold').text('  Dr. ' + report.dentistName, { continued: false });
        }

        y += 85;

        // Findings
        y = checkPage(40, y);
        doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(13)
            .text('DIAGNOSTIC FINDINGS', margin, y);
        doc.moveTo(margin, y + 18).lineTo(margin + contentWidth, y + 18).stroke(GREEN);
        y += 26;

        if (!report.detections || report.detections.length === 0) {
            y = checkPage(50, y);
            doc.rect(margin, y, contentWidth, 44).fill('#f0fdf4').stroke('#bbf7d0');
            doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(11)
                .text('No dental issues detected in this scan.', margin + 15, y + 14);
            y += 54;
        } else {
            report.detections.forEach((d, i) => {
                const expText = d.explanation || 'N/A';
                // measure text width properly with inner padding accounted for
                const textWidth = contentWidth - 40;
                const expHeight = doc.heightOfString(expText, { width: textWidth, fontSize: 9.5 });
                // 10 (top pad) + 18 (title row) + 12 (gap) + 8 (Diagnosis label) + expHeight + 14 (bottom pad)
                const cardH = Math.max(72, expHeight + 70);
                y = checkPage(cardH + 8, y);

                const severity = d.stage && d.stage.toLowerCase().includes('advanced') ? RED :
                    d.stage && d.stage.toLowerCase().includes('moderate') ? AMBER : GREEN;
                doc.rect(margin, y, contentWidth, cardH).fill('#fafafa').stroke('#e5e7eb');
                doc.rect(margin, y, 5, cardH).fill(severity);
                doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
                    .text('#' + (i + 1) + '  ' + ((d.stage || d.label_raw || 'FINDING').replace(/_/g, ' ').toUpperCase()), margin + 18, y + 10);
                const conf = parseFloat(d.confidence) || 0;
                const confColor = conf >= 0.8 ? RED : conf >= 0.5 ? AMBER : GREEN;
                // doc.font('Helvetica-Bold').fontSize(9).fillColor(confColor)
                //     .text('Confidence: ' + (d.confidence || 'N/A'), margin + contentWidth - 120, y + 10);
                doc.font('Helvetica').fontSize(9.5).fillColor(GRAY)
                    .text('Diagnosis: ', margin + 18, y + 30, { continued: true, width: textWidth })
                    .fillColor(DARK).text(expText, { continued: false });
                y += cardH + 8;
            });
        }

        y += 8;

        // Comments
        if (report.comments) {
            const commentH = doc.heightOfString(report.comments, { width: contentWidth - 30, fontSize: 10 });
            const boxH = commentH + 30;
            y = checkPage(boxH + 40, y);
            doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(13)
                .text('COMMENTS & RECOMMENDATIONS', margin, y);
            doc.moveTo(margin, y + 18).lineTo(margin + contentWidth, y + 18).stroke(GREEN);
            y += 26;
            doc.rect(margin, y, contentWidth, boxH).fill('#fffbeb').stroke('#fde68a');
            doc.font('Helvetica').fontSize(10).fillColor(DARK)
                .text(report.comments, margin + 15, y + 12, { width: contentWidth - 30 });
            y += boxH + 18;
        }

        // Comparison Report
        if (report.comparisonReport) {
            const compH = doc.heightOfString(report.comparisonReport, { width: contentWidth - 30, fontSize: 10 });
            const compBoxH = compH + 30;
            y = checkPage(compBoxH + 40, y);
            doc.fillColor('#2563eb').font('Helvetica-Bold').fontSize(13)
                .text('AI COMPARISON ANALYSIS', margin, y);
            doc.moveTo(margin, y + 18).lineTo(margin + contentWidth, y + 18).stroke('#2563eb');
            y += 26;
            doc.rect(margin, y, contentWidth, compBoxH).fill('#eff6ff').stroke('#bfdbfe');
            doc.font('Helvetica').fontSize(10).fillColor(DARK)
                .text(report.comparisonReport, margin + 15, y + 12, { width: contentWidth - 30 });
            y += compBoxH + 18;
        }

        // ── Footer — pinned to absolute bottom of the last page ──
        const footerY = pageHeight - FOOTER_H;
        doc.rect(0, footerY, pageWidth, FOOTER_H).fill(GREEN);
        doc.font('Helvetica').fontSize(8.5).fillColor('rgba(255,255,255,0.85)')
            .text('This report is generated by DentAI and is intended for informational purposes only.', margin, footerY + 10, { align: 'center', width: contentWidth })
            .text('Always consult a qualified dental professional for diagnosis and treatment decisions.', margin, footerY + 24, { align: 'center', width: contentWidth })
            .text('DentAI Platform  -  Confidential Patient Record', margin, footerY + 38, { align: 'center', width: contentWidth });

        doc.end();
    });
};

// ─── Patient: Check if patient has previous reports ───────────────────────────
exports.checkHasPreviousReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const count = await ReportModel.countDocuments({ patientId });
        res.status(200).json({ success: true, hasPrevious: count > 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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
            status: 'saved',
            uploadedBy: 'patient'
        });

        res.status(200).json({ success: true, message: 'Report saved successfully', data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.generateReport = async (req, res) => {
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
            status: 'generated',
            uploadedBy: 'patient'
        });

        const pdfBuffer = await buildPDF(report, patient.name);
        report.pdfBase64 = pdfBuffer.toString('base64');
        await report.save();

        const filename = 'DentAI_Report_' + new Date().toISOString().slice(0, 10) + '_' + report._id.toString().slice(-6).toUpperCase() + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Patient: Download existing PDF by report ID ──────────────────────────────
exports.downloadReport = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;
        const report = await ReportModel.findOne({ _id: id, patientId });
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        if (!report.pdfBase64) {
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

// ─── Patient: Get all reports ─────────────────────────────────────────────────
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

// ─── Patient: Get single report ───────────────────────────────────────────────
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

exports.checkHasPreviousReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const count = await ReportModel.countDocuments({ patientId });
        res.status(200).json({ success: true, hasPrevious: count > 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.compareWithLastReport = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { currentScan, excludeReportId } = req.body;

        const query = {
            patientId,
            comparisonReport: { $in: [null, ''] }
        };

        // If the user saved the current scan before clicking Compare,
        // exclude that report so we don't compare the scan against itself.
        if (excludeReportId) {
            query._id = { $ne: excludeReportId };
        }

        const lastReport = await ReportModel.findOne(query).sort({ createdAt: -1 });

        if (!lastReport) {
            return res.status(404).json({ success: false, message: 'No previous original scan report found to compare with.' });
        }

        const patient = await PatientModel.findById(patientId);
        const prevIssues = lastReport.detections || [];
        const currIssues = currentScan.detections || [];
        const prevStages = prevIssues.map(d => d.stage || d.label_raw || '').filter(Boolean);
        const currStages = currIssues.map(d => d.stage || d.label_raw || '').filter(Boolean);
        const countStages = (arr) => arr.reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
        const prevCounts = countStages(prevStages);
        const currCounts = countStages(currStages);
        const allStages = [...new Set([...prevStages, ...currStages])];

        const issueChanges = allStages.map(stage => {
            const prev = prevCounts[stage] || 0;
            const curr = currCounts[stage] || 0;
            const status = curr === 0 ? 'RESOLVED' : curr > prev ? 'INCREASED' : curr < prev ? 'DECREASED' : 'UNCHANGED';
            return { stage: stage.replace(/_/g, ' '), prev, curr, status };
        });

        const prevDetail = prevIssues.map(d => `- ${(d.stage || d.label_raw || 'unknown').replace(/_/g, ' ')}: ${d.explanation || 'N/A'} (confidence: ${d.confidence || 'N/A'})`).join('\n') || 'None';
        const currDetail = currIssues.map(d => `- ${(d.stage || d.label_raw || 'unknown').replace(/_/g, ' ')}: ${d.explanation || 'N/A'} (confidence: ${d.confidence || 'N/A'})`).join('\n') || 'None';
        const changesDetail = issueChanges.map(c => `- ${c.stage}: was ${c.prev}, now ${c.curr} → ${c.status}`).join('\n');

        const prompt = `You are an expert dental radiologist AI. Analyze the two dental X-ray scan reports below for patient "${patient?.name}" and provide a thorough issue-by-issue comparison.\n\nPREVIOUS REPORT (Date: ${new Date(lastReport.createdAt).toLocaleDateString()}):\nTotal issues: ${lastReport.totalFound}\nDetected issues:\n${prevDetail}\nComments: ${lastReport.comments || 'None'}\n\nCURRENT SCAN (Today):\nTotal issues: ${currentScan.totalFound}\nDetected issues:\n${currDetail}\nComments: ${currentScan.comments || 'None'}\n\nISSUE-LEVEL CHANGES:\n${changesDetail}\n\nPlease provide a professional dental comparison report with these sections:\n\n1. OVERALL STATUS: State clearly if health has IMPROVED, WORSENED, or REMAINED STABLE and why.\n\n2. ISSUE-BY-ISSUE ANALYSIS: For each issue listed in the changes above, explain what it means clinically.\n\n3. NEW FINDINGS: List any issues that appeared in the current scan that were not in the previous one.\n\n4. RESOLVED ISSUES: List any issues from the previous scan that are no longer detected.\n\n5. RECOMMENDATIONS: Give specific, actionable dental advice based on the findings.\n\n6. PATIENT MESSAGE: Write a short encouraging or cautionary note directly to the patient.\n\nWrite in plain text paragraphs only (no markdown, no asterisks, no bullet symbols).`;

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ success: false, message: 'GROQ_API_KEY not set in .env file.' });
        }

        const groqRes = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            { model: 'llama-3.3-70b-versatile', max_tokens: 700, messages: [{ role: 'user', content: prompt }] },
            { headers: { 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY, 'Content-Type': 'application/json' } }
        );

        const comparisonText = groqRes.data.choices[0].message.content;
        res.status(200).json({
            success: true,
            comparison: comparisonText,
            previousReport: { id: lastReport._id, date: lastReport.createdAt, totalFound: lastReport.totalFound }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Patient: Generate comparison PDF ────────────────────────────────────────
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
            status: 'generated',
            uploadedBy: 'patient'
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DENTIST: Save Report on behalf of a patient ─────────────────────────────
exports.dentistSaveReport = async (req, res) => {
    try {
        const dentistId = req.user.id;
        const { patientId, totalFound, detections, annotatedImage, comments } = req.body;

        if (!patientId) return res.status(400).json({ success: false, message: 'patientId is required' });

        const patient = await PatientModel.findById(patientId);
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        const dentist = await DentistModel.findById(dentistId);

        const report = await ReportModel.create({
            patientId,
            patientName: patient.name,
            totalFound: totalFound || 0,
            detections: detections || [],
            annotatedImage: annotatedImage || null,
            comments: comments || '',
            status: 'saved',
            uploadedBy: 'dentist',
            dentistId,
            dentistName: dentist?.name || null
        });

        res.status(200).json({ success: true, message: 'Report saved successfully', data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DENTIST: Get reports for a specific patient ──────────────────────────────
exports.dentistGetPatientReports = async (req, res) => {
    try {
        const { patientId } = req.params;
        const reports = await ReportModel.find({ patientId })
            .select('-annotatedImage -pdfBase64')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── ADMIN: Get all reports with optional filters ─────────────────────────────
exports.adminGetAllReports = async (req, res) => {
    try {
        const { search, dateFilter, uploadedBy, page = 1, limit = 50 } = req.query;

        const query = {};

        // Filter by who uploaded
        if (uploadedBy && uploadedBy !== 'all') {
            query.uploadedBy = uploadedBy;
        }

        // Date filter
        if (dateFilter === 'week') {
            query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        } else if (dateFilter === 'month') {
            const now = new Date();
            query.createdAt = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
            };
        }

        // Search by patient name (server-side)
        if (search) {
            query.$or = [
                { patientName: { $regex: search, $options: 'i' } },
                { dentistName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [reports, total] = await Promise.all([
            ReportModel.find(query)
                .select('-annotatedImage -pdfBase64')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ReportModel.countDocuments(query)
        ]);

        // Stats (always across all reports, not filtered)
        const [totalCount, savedCount, generatedCount, patientCount, dentistCount] = await Promise.all([
            ReportModel.countDocuments(),
            ReportModel.countDocuments({ status: 'saved' }),
            ReportModel.countDocuments({ status: 'generated' }),
            ReportModel.countDocuments({ uploadedBy: 'patient' }),
            ReportModel.countDocuments({ uploadedBy: 'dentist' }),
        ]);

        res.status(200).json({
            success: true,
            data: reports,
            total,
            stats: {
                total: totalCount,
                saved: savedCount,
                generated: generatedCount,
                byPatient: patientCount,
                byDentist: dentistCount
            }
        });
    } catch (error) {
        console.error('[adminGetAllReports]', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};