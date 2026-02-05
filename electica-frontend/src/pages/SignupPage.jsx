import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { BarChart2 } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await signup(formData);
            navigate('/login');
        } catch (err) {
            console.error("Signup failed:", err);
            let msg = 'Failed to create account. Please try again.';
            if (err.response) {
                // Server responded with a status code
                msg = `Server Error (${err.response.status}): ` +
                    (err.response.data?.error || err.response.data?.message || JSON.stringify(err.response.data));
            } else if (err.request) {
                // Request made but no response received
                msg = 'Network Error: No response from server. Check if backend is running.';
            } else {
                // Something else happened
                msg = 'Error: ' + err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center">
                        <BarChart2 className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Join thousands of users making better decisions
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            id="username"
                            label="Username"
                            type="text"
                            required
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <Input
                            id="email"
                            label="Email address"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Input
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={loading}
                    >
                        Create Account
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
