import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { Clock, AlertCircle, BarChart2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PollDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                // Pass userId to check if voted
                const response = await api.get(`/polls/${id}`, {
                    params: { userId: user?.id }
                });
                setPoll(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch poll", err);
                setError('Failed to load poll details.');
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchPoll();
        }
    }, [id, user]);

    // Countdown Timer Logic
    useEffect(() => {
        if (!poll || !poll.expiryTime) return;

        const timer = setInterval(() => {
            const expiry = new Date(poll.expiryTime).getTime();
            const now = new Date().getTime();
            const distance = expiry - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('EXPIRED');
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [poll]);

    const handleVote = async () => {
        if (!selectedOption) return;
        setSubmitting(true);
        setError('');

        try {
            await api.post(`/polls/${id}/vote`, {
                option: { id: selectedOption },
                user: { id: user.id }
            });

            navigate(`/polls/${id}/results`, { state: { justVoted: true } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit vote.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Poll not found</h3>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/polls')}>
                    Back to Polls
                </Button>
            </div>
        );
    }

    const isExpired = timeLeft === 'EXPIRED';
    const hasVoted = poll.hasVoted;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:bg-transparent hover:text-primary-600">
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to Dashboard
                </Button>
            </div>

            {/* Timer Banner */}
            {!isExpired && (
                <div className="bg-slate-900 text-white px-6 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg">
                    <span className="text-slate-300 font-medium text-sm uppercase tracking-wider">Time Remaining</span>
                    <div className="flex items-center font-mono text-xl font-bold text-primary-400">
                        <Clock className="h-5 w-5 mr-2 text-primary-500" />
                        {timeLeft}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${isExpired
                            ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {isExpired ? 'Closed' : 'Active Poll'}
                        </span>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                            {poll.question}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Created by {poll.createdBy || 'Unknown'} • {new Date(poll.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Already Voted Message */}
                    {hasVoted && (
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex items-center border border-blue-100 dark:border-blue-800/50">
                            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">You have already voted in this poll.</p>
                                <Link to={`/polls/${id}/results`} className="text-sm underline hover:text-blue-600 dark:hover:text-blue-200">
                                    View Live Results
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {/* Options */}
                    <div className="space-y-4 mb-8">
                        {poll.options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => !hasVoted && !isExpired && setSelectedOption(option.id)}
                                className={`
                                    relative p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center
                                    ${hasVoted || isExpired ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' : 'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-slate-700/50'}
                                    ${selectedOption === option.id
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md ring-1 ring-primary-500'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}
                                `}
                            >
                                <div className={`
                                    w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors
                                    ${selectedOption === option.id
                                        ? 'border-primary-500 bg-primary-500'
                                        : 'border-slate-300 dark:border-slate-500'}
                                `}>
                                    {selectedOption === option.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </div>
                                <span className="text-lg font-medium text-slate-700 dark:text-slate-200">
                                    {option.optionText}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        {(!hasVoted && !isExpired) ? (
                            <Button
                                onClick={handleVote}
                                disabled={!selectedOption || submitting}
                                className="flex-1 py-3 text-lg shadow-lg shadow-primary-500/20"
                            >
                                {submitting ? 'Submitting...' : 'Submit Vote'}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/polls/${id}/results`)}
                                className="flex-1 py-3"
                            >
                                <BarChart2 className="h-5 w-5 mr-2" />
                                View Results
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollDetailsPage;
