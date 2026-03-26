import React from 'react';
import { Mail, MapPin, Github, Linkedin, Award } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                                <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">👨‍💻</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Project Developer</h1>
                        <p className="text-blue-600 font-medium mt-1">3rd Year B.Tech CSE (AI/ML)</p>
                        <p className="text-gray-500 mt-4 leading-relaxed max-w-lg mx-auto">
                            Passionate about leveraging Artificial Intelligence to solve real-world healthcare challenges.
                            This project represents a culmination of research in medical image processing and machine learning.
                        </p>

                        <div className="mt-8 flex justify-center gap-6">
                            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 gap-4 text-left">
                            <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                                <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                                    <Award className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Institution</p>
                                    <p className="font-semibold text-gray-900">Your College Name</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                                <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                                    <Mail className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Contact</p>
                                    <p className="font-semibold text-gray-900">student@example.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} LungAI Research Project. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
