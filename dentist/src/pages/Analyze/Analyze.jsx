import React, { useState } from 'react';
import axios from 'axios';

const Analyze = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Jab user file select kare
    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setResult(null); // Purana result clear kar dein
    };

    const onUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        const formData = new FormData();
        // Node.js backend isi 'file' key ka intezar karega
        formData.append('file', selectedFile);

        try {
            // Node.js backend ka endpoint call karna
            const res = await axios.post('http://localhost:8000/api/analysis/predict', formData);
            setResult(res.data); // Python AI se aya hua report
        } catch (err) {
            console.error(err);
            alert("Error: AI server se rabta nahi ho saka!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Dent AI - Smart Caries Detection</h2>

            <div style={styles.uploadBox}>
                <input type="file" onChange={onFileChange} accept="image/*" />
                <button
                    onClick={onUpload}
                    disabled={!selectedFile || loading}
                    style={loading ? styles.buttonDisabled : styles.button}
                >
                    {loading ? "Analyzing X-ray..." : "Start Analysis"}
                </button>
            </div>

            {result && (
                <div style={styles.resultsContainer}>
                    <h3>Scan Results: {result.total_found} Issues Detected</h3>

                    {/* Annotated Image: Base64 string ko image mein convert karna */}
                    <div style={styles.imageWrapper}>
                        <img
                            src={`data:image/jpeg;base64,${result.image}`}
                            alt="AI Annotated X-ray"
                            style={styles.predictionImage}
                        />

                    </div>

                    <div style={styles.reportList}>
                        {result.detections.map((d, i) => (
                            <div key={i} style={styles.reportCard}>
                                <div style={styles.badge}>{d.stage.replace('_', ' ')}</div>
                                <p><strong>Diagnosis:</strong> {d.explanation}</p>
                                <p><strong>Confidence:</strong> {d.confidence}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Styles for Professional Look
const styles = {
    container: { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' },
    title: { textAlign: 'center', color: '#2c3e50' },
    uploadBox: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' },
    button: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    buttonDisabled: { padding: '10px 20px', backgroundColor: '#bdc3c7', color: 'white', border: 'none', borderRadius: '5px' },
    resultsContainer: { marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '20px' },
    imageWrapper: { textAlign: 'center', marginBottom: '20px' },
    predictionImage: { maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    reportCard: { background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '5px solid #e74c3c' },
    badge: { display: 'inline-block', background: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }
};

export default Analyze;