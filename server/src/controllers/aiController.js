const axios = require('axios');
const FormData = require('form-data');

/**
 * AI X-Ray Analysis Gateway Controller
 * Intercepts binary image buffers from client requests and streams them to the FastAPI microservice layer.
 */
exports.analyzeXray = async (req, res) => {
    try {
        // Validate if standard file binary buffer exists via Multer extraction
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No dental radiograph file detected inside the request payload body structure."
            });
        }

        // Build network-compatible multi-part boundary stream payload package
        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname || 'radiograph_target.jpg',
            contentType: req.file.mimetype
        });

        // Pipeline connection to localized running FastAPI process running on port 5000
        const internalAIServiceEndpoint = 'http://127.0.0.1:5000/predict';
        
        console.log(`[Gatekeeper] Forwarding buffer matrix to local model cluster: ${internalAIServiceEndpoint}`);
        
        const response = await axios.post(internalAIServiceEndpoint, form, {
            headers: {
                ...form.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Directly return the complete structured diagnostic payload response mapping to client applications
        return res.status(200).json(response.data);

    } catch (error) {
        console.error("[Gatekeeper Error] AI Service Interface Connection Broken:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to pipe image streams into internal neural prediction server framework.",
            error: error.message
        });
    }
};