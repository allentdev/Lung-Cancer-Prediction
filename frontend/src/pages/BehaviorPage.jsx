import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle, ChevronRight, User, Info } from 'lucide-react';
import axios from 'axios';

const BehaviorPage = () => {
    const [formData, setFormData] = useState({
        smoking_years: 0,
        cigarettes_per_day: 0,
        age: 30,
        pollution_exposure: 0 // 0-10 scale
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await axios.post('/api/risk', formData);
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to calculate risk. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const sliders = [
        { name: 'smoking_years', label: 'Years of Smoking', min: 0, max: 50, step: 1 },
        { name: 'cigarettes_per_day', label: 'Cigarettes per Day', min: 0, max: 40, step: 1 },
        { name: 'age', label: 'Age', min: 18, max: 100, step: 1 },
        { name: 'pollution_exposure', label: 'Pollution Exposure (0-10)', min: 0, max: 10, step: 1, help: "Rate your daily exposure to pollution from 0 (Clean Air) to 10 (High Pollution)" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="text-blue-600 h-8 w-8" />
                        <h1 className="text-3xl font-bold text-gray-900">Patient Data Analysis</h1>
                    </div>
                    <p className="text-gray-500 mt-2">Adjust the sliders to estimate lung cancer risk based on behavioral factors.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            User Inputs
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {sliders.map((field) => (
                                <div key={field.name} className="relative">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {field.label}
                                            {field.help && (
                                                <div className="group relative">
                                                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {field.help}
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                        <span className="text-blue-600 font-bold">{formData[field.name]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        name={field.name}
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>{field.min}</span>
                                        <span>{field.max}</span>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Calculating...' : <>Analyze Risk <ChevronRight className="h-5 w-5" /></>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Result Section */}
                    <div className="lg:col-span-1">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`rounded-2xl shadow-xl p-6 border h-full flex flex-col justify-between ${result.risk === 'High' ? 'bg-red-50 border-red-100' : result.risk === 'Medium' ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'}`}
                                >
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            {result.risk === 'High' ? (
                                                <AlertCircle className="h-16 w-16 text-red-500" />
                                            ) : result.risk === 'Medium' ? (
                                                <AlertCircle className="h-16 w-16 text-yellow-500" />
                                            ) : (
                                                <CheckCircle className="h-16 w-16 text-green-500" />
                                            )}
                                        </div>
                                        <h2 className={`text-3xl font-bold mb-1 ${result.risk === 'High' ? 'text-red-600' : result.risk === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {result.risk} Risk
                                        </h2>
                                        <p className="text-gray-500 text-sm mb-6">Based on provided lifestyle factors</p>

                                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                                            <div className="text-sm text-gray-500 mb-1">Risk Score</div>
                                            <div className="text-2xl font-mono font-bold text-gray-900">{result.score}</div>
                                        </div>

                                        <div className="text-left bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider">Recommendations</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                {result.recommendations && result.recommendations.map((rec, i) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span className="text-blue-500">•</span> {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center h-full flex flex-col justify-center items-center text-gray-400">
                                    <User className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Adjust sliders and verify risk analysis.</p>
                                </div>
                            )}
                        </AnimatePresence>
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BehaviorPage;
