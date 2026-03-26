import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Accuracy', value: 97.4, fill: '#0077b6' },
    { name: 'Precision', value: 96.8, fill: '#0096c7' },
    { name: 'Recall', value: 95.9, fill: '#48cae4' },
    { name: 'F1 Score', value: 96.3, fill: '#90e0ef' },
];

const confMatrixData = [
    { name: 'True Pos', value: 450, color: '#22c55e' },
    { name: 'True Neg', value: 480, color: '#3b82f6' },
    { name: 'False Pos', value: 15, color: '#ef4444' },
    { name: 'False Neg', value: 20, color: '#f97316' },
];

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Model Insights Dashboard</h1>
                    <p className="text-gray-500 mt-2">Performance metrics for the PCA-LDA Lung Cancer Prediction Model</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {data.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-gray-500 font-medium text-sm uppercase">{item.name}</h3>
                            <div className="mt-2 flex items-end justify-between">
                                <span className="text-3xl font-bold text-gray-900">{item.value}%</span>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+2.4%</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Accuracy Comparison Chart */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics Analysis</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis domain={[80, 100]} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Confusion Matrix Visualization */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Confusion Matrix Distribution</h3>
                        <div className="h-80 w-full flex align-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={confMatrixData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {confMatrixData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
