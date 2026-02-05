import React from 'react';
import { BarChart2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="rounded-lg bg-primary-600 p-1.5">
                                <BarChart2 className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Electica
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Empowering simpler, transparent, and efficient polling for modern communities. Make your voice heard.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Features</a></li>
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Pricing</a></li>
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Security</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Documentation</a></li>
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Guides</a></li>
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">API Status</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Privacy</a></li>
                            <li><a href="#" className="text-base text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">Terms</a></li>
                        </ul>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-slate-400 hover:text-primary-500">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary-500">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary-500">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 flex items-center justify-between">
                    <p className="text-base text-slate-400">
                        &copy; {new Date().getFullYear()} Electica. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
