import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Code as CodeIcon } from 'lucide-react';

const CreditsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-8">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>
                    <h1 className="text-4xl font-bold tracking-tight">Data Sources & Credits</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        We believe in transparency and giving credit where it's due. The problems and educational content on this platform are sourced from or inspired by the following excellent resources.
                    </p>
                </div>

                {/* Source Cards */}
                <div className="grid gap-6">
                    {/* LeetCode */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                                <CodeIcon size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">LeetCode</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    The majority of our coding problems, including problem statements and test cases, are sourced from <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">LeetCode</a>.
                                    We use this content for educational purposes to help developers improve their algorithmic skills.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* System Design Primer */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Database size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">System Design</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Our system design problems are inspired by real-world architectures and common interview questions found in resources like the <a href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">System Design Primer</a> and various engineering blogs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-sm text-slate-500 dark:text-slate-500">
                    <p>
                        This platform is an independent educational project and is not affiliated with LeetCode or any other mentioned organizations. 
                        Content is used under fair use principles for non-profit educational visualization.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreditsPage;
