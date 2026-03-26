import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, RefreshCcw, Download, Activity } from 'lucide-react';
import axios from 'axios';

const PredictPage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handlePredict = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Updated to point to Flask backend API
            const response = await axios.post('http://127.0.0.1:5000/api/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Simulate PCA/LDA processing time for effect if too fast
            setTimeout(() => {
                setResult(response.data);
                setLoading(false);
            }, 1000);

        } catch (err) {
            console.error(err);
            setError("Failed to process image. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">AI Analysis</h1>
                    <p className="text-gray-500 mt-2">Upload a CT scan to run the PCA-LDA prediction model.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-colors
                                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-white'}
                                ${preview ? 'bg-gray-900 border-none relative overflow-hidden' : 'bg-white'}
                            `}
                        >
                            <input {...getInputProps()} />

                            {preview ? (
                                <img src={preview} alt="Upload preview" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Upload className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <p className="text-gray-900 font-medium">Drag & drop CT scan here</p>
                                    <p className="text-sm text-gray-500 mt-2">or click to browse files</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handlePredict}
                            disabled={!file || loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                                ${!file || loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30'}
                            `}
                        >
                            {loading ? (
                                <>
                                    <RefreshCcw className="animate-spin h-5 w-5" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <FileText className="h-5 w-5" />
                                    Run AI Analysis
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="relative">
                        <AnimatePresence>
                            {result && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 h-full"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-gray-900">Analysis Report</h3>
                                        <span className="text-sm text-gray-400">{new Date().toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex flex-col items-center mb-8">
                                        <div className={`p-4 rounded-full mb-4 ${result.label === 'Normal' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {result.label === 'Normal'
                                                ? <CheckCircle className="h-12 w-12 text-green-600" />
                                                : <AlertTriangle className="h-12 w-12 text-red-600" />
                                            }
                                        </div>
                                        <h2 className={`text-3xl font-bold ${result.label === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
                                            {result.label === 'Normal' ? 'Non-Cancerous' : 'Cancer Detected'}
                                        </h2>
                                        <p className="text-gray-500 mt-2 font-medium">Likelihood: {result.risk_level}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Confidence Score</span>
                                                <span className="font-bold text-gray-900">{result.confidence}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${result.label === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ width: `${result.confidence}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* AI Suggestion Section */}
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="h-5 w-5 text-blue-600" />
                                                <h4 className="font-bold text-gray-900">AI Recommendation</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {result.label === 'Normal'
                                                    ? "Great news! The scan appears normal. However, maintaining a healthy lifestyle and regular check-ups is always recommended. If you experience any respiratory issues, consult a doctor."
                                                    : "The AI model has detected potential abnormalities. It is highly recommended to consult an oncologist for further diagnostic tests (such as a biopsy or PET scan) immediately. Early intervention is key."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <button className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                                            <Download className="h-4 w-4" />
                                            Download Full Report
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {loading && (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Processing Image</h3>
                                    <p className="text-gray-500 mt-2">Running PCA feature extraction...</p>
                                    <p className="text-gray-400 text-sm mt-1">Applying LDA classification...</p>
                                </div>
                            )}

                            {!result && !loading && (
                                <div className="h-full bg-slate-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <Activity className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Results will appear here after analysis</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictPage;
