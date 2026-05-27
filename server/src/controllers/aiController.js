const axios = require('axios');
const FormData = require('form-data');

exports.analyzeXray = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const formData = new FormData();
        formData.append('file', req.file.buffer, { filename: req.file.originalname });

        const response = await axios.post("https://unfailing-perturbedly-kadence.ngrok-free.dev/predict", formData, {
            headers: { ...formData.getHeaders() }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ error: "AI Server Connection Failed" });
    }
};