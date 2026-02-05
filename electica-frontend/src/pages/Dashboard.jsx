import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Plus, BarChart2, Calendar, Clock, ChevronRight, Activity, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [createdPolls, setCreatedPolls] = useState([]);
    const [votedPolls, setVotedPolls] = useState([]);
    const [activeTab, setActiveTab] = useState('created');
    const [loading, setLoading] = useState(true);

    // Stats
    const [stats, setStats] = useState({ total: 0, active: 0, votesReceived: 0 });

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                // Fetch Created Polls
                const createdRes = await api.get(`/polls/my?userId=${user.id}`);
                setCreatedPolls(createdRes.data);

                // Fetch Voted Polls
                const votedRes = await api.get(`/polls/voted?userId=${user.id}`);
                setVotedPolls(votedRes.data);

                const activeCount = createdRes.data.filter(p => !p.closed && new Date(p.expiryTime) > new Date()).length;
                const totalVotes = createdRes.data.reduce((acc, curr) => acc + (curr.voteCount || 0), 0);

                setStats({
                    total: createdRes.data.length,
                    active: activeCount,
                    votesReceived: totalVotes
                });

                setLoading(false);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getTimeRemaining = (expiryTime) => {
        const total = Date.parse(expiryTime) - Date.parse(now);
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        if (total <= 0) return 'Expired';
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {getGreeting()}, {user?.username || 'User'}
                        </h1>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">Here's your Electica activity overview.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium animate-pulse">
                            <Activity className="w-4 h-4 mr-1.5" /> Live Updates
                        </div>
                        <Link to="/create-poll">
                            <Button size="lg" className="shadow-md shadow-primary-500/20">
                                <Plus className="mr-2 h-5 w-5" />
                                Create New Poll
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Polls Created</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Polls Now</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.active}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Votes Received</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.votesReceived}</p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                <UsersIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-slate-200 dark:border-slate-700 px-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('created')}
                                className={`${activeTab === 'created'
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                My Created Polls
                            </button>
                            <button
                                onClick={() => setActiveTab('voted')}
                                className={`${activeTab === 'voted'
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                Polls I Voted In
                            </button>
                        </nav>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-r-primary-600"></div>
                            <p className="mt-2 text-slate-500">Loading your data...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {activeTab === 'created' ? (
                                createdPolls.length > 0 ? (
                                    createdPolls.map((poll) => (
                                        <div key={poll.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center flex-wrap gap-2 mb-2">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${!poll.closed && new Date(poll.expiryTime) > now
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
                                                            }`}>
                                                            {!poll.closed && new Date(poll.expiryTime) > now ? 'Active' : 'Closed'}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            Created {new Date(poll.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                                        {poll.question}
                                                    </h3>
                                                    <div className="mt-2 flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                        <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                        <span className="font-semibold text-slate-900 dark:text-white mr-1">{poll.voteCount || 0}</span> votes
                                                        <span className="mx-2">&middot;</span>
                                                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                        <span className="font-mono text-xs">
                                                            {!poll.closed && new Date(poll.expiryTime) > now
                                                                ? getTimeRemaining(poll.expiryTime)
                                                                : 'Ended'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link to={`/polls/${poll.id}`}>
                                                        <Button variant="outline" size="sm">Details</Button>
                                                    </Link>
                                                    {/* If user handles their own polls, maybe they can always see results? Assuming yes for creator */}
                                                    <Link to={`/polls/${poll.id}/results`}>
                                                        <Button variant="ghost" size="sm">Analytics</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-slate-500">
                                        You haven't created any polls yet.
                                    </div>
                                )
                            ) : (
                                votedPolls.length > 0 ? (
                                    votedPolls.map((poll) => (
                                        <div key={poll.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center flex-wrap gap-2 mb-2">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${!poll.closed && new Date(poll.expiryTime) > now
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
                                                            }`}>
                                                            {!poll.closed && new Date(poll.expiryTime) > now ? 'Active' : 'Expired'}
                                                        </span>
                                                        <span className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Voted: {poll.myVote}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                                        {poll.question}
                                                    </h3>
                                                    <div className="mt-2 flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                        <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                        <span className="font-semibold text-slate-900 dark:text-white mr-1">{poll.votes}</span> total votes
                                                        {poll.result && (
                                                            <>
                                                                <span className="mx-2">&middot;</span>
                                                                <span className="font-semibold text-green-600 dark:text-green-400">Winner: {poll.result}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link to={`/polls/${poll.id}/results`}>
                                                        <Button variant="outline" size="sm">
                                                            {poll.closed || new Date(poll.expiryTime) <= now ? 'View Final Results' : 'View Results'}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-slate-500">
                                        You haven't participated in any polls yet.
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper icon component since Users is already imported in some contexts but maybe not here
function UsersIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export default Dashboard;
