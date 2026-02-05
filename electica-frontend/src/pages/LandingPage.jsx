import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, BarChart2, Shield, Users, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
                        <span className="block">Online Polling Made</span>
                        <span className="block text-primary-600 dark:text-primary-400">Transparent, Scalable, Secure</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                        Create polls, share with your audience, and get real-time insights. Electica is the easiest way to make decisions together.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="shadow-lg shadow-primary-500/30">
                                Create Poll
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/polls">
                            <Button variant="outline" size="lg">Vote Now</Button>
                        </Link>
                    </div>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[800px] opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-16 bg-white dark:bg-slate-900/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Everything you need to vote</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: <BarChart2 className="h-8 w-8 text-primary-600" />,
                                title: 'Real-time Analytics',
                                description: 'Watch results come in live as people vote. Beautiful charts and graphs make understanding data easy.'
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-primary-600" />,
                                title: 'Secure & Reliable',
                                description: 'Built with Spring Boot security. We ensure every vote counts and prevent duplicate submissions.'
                            },
                            {
                                icon: <Users className="h-8 w-8 text-primary-600" />,
                                title: 'User Friendly',
                                description: 'Clean, intuitive interface designed for everyone. No technical knowledge required to create or vote.'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="relative p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl mb-5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl mb-6">
                                Why choose Electica?
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                                Whether you're organizing a small team decision or a large community poll, Electica scales with you.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Instant setup - create a poll in seconds',
                                    'Mobile-optimized for voting on the go',
                                    'Export results for further analysis',
                                    'Customizable expiry dates'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-10 lg:mt-0 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-20 dark:opacity-40"></div>
                            <div className="relative rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                                {/* Mock Poll Card UI for visual interest */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Where should we go for the retreat?</h4>
                                    <div className="space-y-3">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Bali, Indonesia</div>
                                                <div className="text-xs font-semibold text-primary-600 dark:text-primary-400">45%</div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200 dark:bg-slate-700">
                                                <div style={{ width: "45%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"></div>
                                            </div>
                                        </div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kyoto, Japan</div>
                                                <div className="text-xs font-semibold text-slate-500">30%</div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200 dark:bg-slate-700">
                                                <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
