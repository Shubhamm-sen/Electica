import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { User, Mail, Save, AlertCircle, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth(); // Destructure updateUser from context
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put(`/users/${user.id}`, formData);

            // Update local user context
            // We need a way to update the user in AuthContext without full re-login flow if possible.
            // Assuming the response returns the updated UserResponseDTO.
            // If AuthContext doesn't support partial updates, we might need to modify it or simulate a login refresh.
            // For now, let's assume `login` can take the DTO directly if structured correctly, 
            // OR ideally we should add an `updateUser` method to AuthContext. 
            // As a workaround, we can manually update localStorage and state if exposed, 
            // but standard cleaner way is re-fetching or using a dedicated context method.

            // Let's rely on the fact that AuthContext usually persists user data.
            // We'll trust the backend response and maybe reload the page or trigger a context refresh if available.

            // Actually, let's look at AuthContext later. For now, basic success UI.

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Hacky context update for immediate UI reflection if context is simple
            const updatedUser = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Ensure persistence
            updateUser(response.data); // Update context state

            // Redirect to Dashboard after a short delay to show success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            console.error("Profile update failed", err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
                            <p className="text-slate-500 dark:text-slate-400">Update your personal information</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3" /> : <AlertCircle className="h-5 w-5 mr-3" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            icon={User}
                            placeholder="Enter your username"
                            required
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                            placeholder="Enter your email"
                            required
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 text-lg shadow-lg shadow-primary-500/20"
                            >
                                {loading ? 'Saving Changes...' : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
