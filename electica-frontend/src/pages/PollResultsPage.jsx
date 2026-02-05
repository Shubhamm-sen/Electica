import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Button from '../components/Button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PollResultsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('bar'); // 'pie' or 'bar'

    // Check if we just redirected from voting
    const showSuccessMessage = location.state?.justVoted;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`/polls/${id}`);
                const data = response.data;

                setPoll({
                    ...data,
                    status: new Date(data.expiryTime) > new Date() ? 'active' : 'expired',
                    options: data.options.map(o => ({
                        ...o,
                        text: o.optionText,
                        votes: o.voteCount || 0 // Use voteCount from backend
                    })),
                    totalVotes: data.totalVotes || 0, // Use totalVotes from backend
                    author: data.createdBy ? data.createdBy.username : 'Unknown'
                });
                setLoading(false);
            } catch (err) {
                console.error("Failed to load results", err);
                setLoading(false);
            }
        };

        fetchResults(); // Initial fetch

        // Poll every 2 seconds for "live cricket match" feel
        const interval = setInterval(fetchResults, 2000);

        return () => clearInterval(interval);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            </div>
        );
    }

    if (!poll) {
        return <div>Poll not found</div>;
    }

    // Prepare Chart Data
    const chartData = {
        labels: poll.options.map(o => o.text),
        datasets: [
            {
                label: '# of Votes',
                data: poll.options.map(o => o.votes),
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)', // primary-500
                    'rgba(59, 130, 246, 0.8)', // blue-500
                    'rgba(16, 185, 129, 0.8)', // emerald-500
                    'rgba(245, 158, 11, 0.8)', // amber-500
                    'rgba(239, 68, 68, 0.8)',  // red-500
                    'rgba(236, 72, 153, 0.8)', // pink-500
                ],
                borderColor: [
                    'rgba(139, 92, 246, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            },
            title: {
                display: false,
            },
        },
        scales: chartType === 'bar' ? {
            y: {
                beginAtZero: true,
                grid: {
                    color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0',
                },
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b',
                    stepSize: 1
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b',
                }
            }
        } : {}
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 mb-6 hover:bg-transparent hover:text-primary-600">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to Dashboard
                </Button>

                {showSuccessMessage && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center animate-fade-in-down">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Vote Submitted Successfully!</h3>
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">Thanks for participating. Here are the live results.</p>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                            {poll.question}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Total Votes: {poll.totalVotes} &middot; Status: <span className="capitalize">{poll.status}</span>
                        </p>

                        {/* Chart Controls */}
                        <div className="flex justify-end mb-4 space-x-2">
                            <button
                                onClick={() => setChartType('bar')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${chartType === 'bar'
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Bar Chart
                            </button>
                            <button
                                onClick={() => setChartType('pie')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${chartType === 'pie'
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Pie Chart
                            </button>
                        </div>

                        {/* Chart Container */}
                        <div className="h-80 w-full mb-10">
                            {chartType === 'bar' ? (
                                <Bar data={chartData} options={chartOptions} />
                            ) : (
                                <div className="h-full flex justify-center">
                                    <div className="w-full max-w-sm">
                                        <Pie data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Detailed Breakdown */}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Detailed Breakdown</h3>
                        <div className="space-y-4">
                            {poll.options.map((option) => {
                                const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                                return (
                                    <div key={option.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{option.text}</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                {option.votes} votes ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollResultsPage;
