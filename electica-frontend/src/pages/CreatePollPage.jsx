import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Trash2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const CreatePollPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([{ id: 1, text: '' }, { id: 2, text: '' }]);

    // Default expiry: 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const [expiryDate, setExpiryDate] = useState(defaultDate.toISOString().split('T')[0]);

    const [expiryTime, setExpiryTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddOption = () => {
        const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
        setOptions([...options, { id: newId, text: '' }]);
    };

    const handleRemoveOption = (id) => {
        if (options.length <= 2) {
            setError('A poll must have at least 2 options');
            return;
        }
        setOptions(options.filter(o => o.id !== id));
        setError('');
    };

    const handleOptionChange = (id, text) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Please enter a poll question');
            return;
        }
        if (options.some(o => !o.text.trim())) {
            setError('All options must have text');
            return;
        }

        setLoading(true);
        setError('');

        // Construct deadline ISO string if provided
        let deadline = null;
        if (expiryDate) {
            const time = expiryTime || '23:59';
            deadline = new Date(`${expiryDate}T${time}`).toISOString();
        }

        if (!user || !user.id) {
            setError('You must be logged in to create a poll');
            return;
        }

        const pollData = {
            question,
            options: options.map(o => o.text), // Backend expects List<String>
            expiryTime: deadline, // Backend expects "expiryTime"
            userId: user.id
        };

        try {
            console.log('Sending Poll Data:', pollData);
            await api.post('/polls', pollData);

            navigate('/dashboard');
        } catch (err) {
            console.error("Poll creation failed:", err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to create poll';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-primary-600">
                        <ArrowLeft className="h-5 w-5 mr-1" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Create a New Poll</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Ask your community anything.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Question Section */}
                        <div>
                            <label htmlFor="question" className="block text-lg font-medium text-slate-900 dark:text-white mb-2">
                                Poll Question
                            </label>
                            <Input
                                id="question"
                                placeholder="e.g., What should we order for lunch?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="text-lg py-3"
                            />
                        </div>

                        {/* Options Section */}
                        <div>
                            <label className="block text-lg font-medium text-slate-900 dark:text-white mb-2">
                                Options
                            </label>
                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                        <div className="flex-grow">
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                            />
                                        </div>
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(option.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Remove option"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddOption}
                                    className="w-full sm:w-auto"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Add Option
                                </Button>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Poll Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Expiry Date (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Expiry Time (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            value={expiryTime}
                                            onChange={(e) => setExpiryTime(e.target.value)}
                                        />
                                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                If left blank, the poll will remain active for 7 days by default.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/dashboard')}
                                className="mr-3"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                isLoading={loading}
                            >
                                Create Poll
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePollPage;
