import React from 'react';
import { motion } from 'framer-motion';
import { Database, GitBranch, Binary, Brain, ArrowRight } from 'lucide-react';

const AboutPage = () => {
    const steps = [
        {
            icon: <UploadIcon />,
            title: "Input Acquisition",
            desc: "High-resolution CT scan images are uploaded to the system."
        },
        {
            icon: <Brain className="text-purple-500" />,
            title: "Preprocessing",
            desc: "Images are resized, normalized, and noise-reduced for optimal analysis."
        },
        {
            icon: <GitBranch className="text-blue-500" />,
            title: "Feature Extraction (PCA)",
            desc: "Principal Component Analysis reduces dimensionality while retaining 95% of variance."
        },
        {
            icon: <Binary className="text-green-500" />,
            title: "Classification (LDA)",
            desc: "Linear Discriminant Analysis separates classes to maximize separability."
        },
        {
            icon: <Database className="text-red-500" />,
            title: "Predictive Output",
            desc: "The model generates a probability score and classifies as Normal or Cancerous."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Under the Hood
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        How our AI system processes medical imagery.
                    </p>
                </div>

                {/* Methodology Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">PCA + LDA Architecture</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Our model utilizes a hybrid approach combining <strong>Principal Component Analysis (PCA)</strong> for feature extraction and <strong>Linear Discriminant Analysis (LDA)</strong> for classification.
                            This combination ensures that we extract the most significant features from the CT scans while maximizing the margin between cancerous and non-cancerous/benign samples.
                        </p>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">Model Accuracy</span>
                                <span className="font-bold text-green-600">97.4%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '97.4%' }}></div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    >
                        {/* Simple Visualization of PCA/LDA */}
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
                                {Array.from({ length: 36 }).map((_, i) => (
                                    <div key={i} className="border border-blue-200"></div>
                                ))}
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="flex gap-4 justify-center mb-4">
                                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                </div>
                                <p className="text-sm text-gray-500 font-mono">Separating Hyperplane</p>
                                <div className="h-0.5 w-32 bg-gray-800 mx-auto mt-2 transform rotate-12"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Pipeline Steps */}
                <div className="space-y-4">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 bg-slate-50 rounded-lg">
                                {step.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                                <p className="text-gray-500">{step.desc}</p>
                            </div>
                            {idx !== steps.length - 1 && (
                                <ArrowRight className="text-gray-300 hidden md:block" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const UploadIcon = () => (
    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export default AboutPage;
