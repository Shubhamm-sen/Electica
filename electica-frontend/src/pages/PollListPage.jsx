import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, Filter, Calendar, BarChart2 } from 'lucide-react';
import api from '../services/api';

const PollListPage = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, closed

    useEffect(() => {
        const fetchPolls = async () => {
            setLoading(true);
            try {
                const response = await api.get('/polls');
                // Transform backend data to match frontend expectations
                const mappedPolls = response.data.map(poll => ({
                    ...poll,
                    status: new Date(poll.expiryTime) > new Date() ? 'active' : 'closed',
                    votes: poll.totalVotes || 0,
                    author: poll.createdBy || 'Unknown'
                }));
                setPolls(mappedPolls);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch polls", error);
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    const filteredPolls = polls.filter(poll => {
        const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && poll.status === 'active') ||
            (filter === 'closed' && poll.status !== 'active');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Polls</h1>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">Browse and vote on active polls.</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <Input
                                placeholder="Search polls..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white appearance-none"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                            </select>
                            <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredPolls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPolls.map(poll => (
                            <div key={poll.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${poll.status === 'active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                        {poll.status === 'active' ? 'Active' : 'Closed'}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(poll.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {poll.question}
                                </h3>

                                <div className="mt-auto pt-4">
                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        <span className="flex items-center">
                                            <BarChart2 className="h-4 w-4 mr-1" /> {poll.votes} votes
                                        </span>
                                        <span>by {poll.author}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/polls/${poll.id}`} className="col-span-1">
                                            <Button variant={poll.status === 'active' ? 'primary' : 'secondary'} className="w-full">
                                                {poll.status === 'active' ? 'Vote Now' : 'View Details'}
                                            </Button>
                                        </Link>

                                        {poll.status !== 'active' ? (
                                            <Link to={`/polls/${poll.id}/results`} className="col-span-1">
                                                <Button variant="outline" className="w-full">
                                                    Final Results
                                                </Button>
                                            </Link>
                                        ) : (
                                            <div className="col-span-1 flex items-center justify-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 italic text-center px-1">
                                                Results hidden
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                            <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No polls found</h3>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollListPage;
