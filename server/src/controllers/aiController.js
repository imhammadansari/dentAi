const axios = require('axios');
const FormData = require('form-data');


exports.analyzeXray = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No dental radiograph file detected inside the request payload body structure."
            });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname || 'radiograph_target.jpg',
            contentType: req.file.mimetype
        });

        // const internalAIServiceEndpoint = 'http://127.0.0.1:8001/predict';
        const internalAIServiceEndpoint = 'https://dentai-production-1f1f.up.railway.app/predict';
        
        
        console.log(`[Gatekeeper] Forwarding buffer matrix to local model cluster: ${internalAIServiceEndpoint}`);
        
        const response = await axios.post(internalAIServiceEndpoint, form, {
            headers: {
                ...form.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

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
