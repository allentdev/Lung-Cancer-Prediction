import React from 'react';
import { ArrowRight, Upload, Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:text-left lg:pt-32">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className='mb-12 lg:mb-0'
                        >
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block mb-2">AI-Powered</span>
                                <span className="block text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                    Lung Cancer Detection
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Early detection saves lives. Utilize our advanced Machine Learning algorithms to analyze CT scans with 97% accuracy. Fast, reliable, and secure.
                            </p>
                            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/predict"
                                    className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                                >
                                    <Upload className="mr-2 h-5 w-5" />
                                    Predict Scan
                                </Link>
                                <Link
                                    to="/behavior"
                                    className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-blue-700 bg-white border-2 border-blue-50 hover:border-blue-200 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
                                >
                                    <Activity className="mr-2 h-5 w-5" />
                                    Behavior Analysis
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-10 pointer-events-none" />
                                {/* Placeholder for AI Illustration - Using a generated gradient/shape for now */}
                                <div className="bg-slate-900 h-96 w-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Activity className="h-24 w-24 text-blue-500 mx-auto mb-4 animate-pulse" />
                                        <p className="text-blue-100/70 font-mono">Analyzing Scan Data...</p>
                                        <div className="mt-4 flex gap-2 justify-center">
                                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4"
                            >
                                <div className="bg-green-100 p-3 rounded-full">
                                    <ShieldCheck className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Model Accuracy</p>
                                    <p className="text-xl font-bold text-gray-900">97.4%</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose LungAI?</h2>
                        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Advanced technology meets medical expertise to provide rapid and accurate assessments.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Activity className="h-8 w-8 text-blue-600" />,
                                title: "High Precision Analysis",
                                desc: "Utilizing PCA for feature extraction and LDA for robust classification."
                            },
                            {
                                icon: <Zap className="h-8 w-8 text-amber-500" />,
                                title: "Instant Results",
                                desc: "Get analysis reports in seconds, enabling faster decision making."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
                                title: "Secure &amp; Private",
                                desc: "Your medical data is processed locally and securely."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
