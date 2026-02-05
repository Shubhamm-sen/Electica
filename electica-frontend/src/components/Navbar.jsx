import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, User, BarChart2 } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="rounded-lg bg-primary-600 p-1.5 pt-2">
                                <BarChart2 className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Electica
                            </span>
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link to="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Home
                                </Link>
                                <Link to="/about" className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    About
                                </Link>
                                <Link to="/contact" className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="sm">Dashboard</Button>
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.username}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md section p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none dark:hover:bg-slate-800 dark:hover:text-slate-300"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400">Home</Link>
                        <Link to="/about" className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400">About</Link>
                        <Link to="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400">Contact</Link>
                    </div>
                    <div className="border-t border-slate-200 pb-3 pt-4 dark:border-slate-800">
                        <div className="flex items-center justify-between px-5">
                            <div className="flex items-center">
                                {isAuthenticated && (
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                )}
                                <div className="ml-3">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="text-base font-medium leading-none text-slate-800 dark:text-white">{user?.username}</div>
                                            <div className="text-sm font-medium leading-none text-slate-500 dark:text-slate-400">{user?.email}</div>
                                        </>
                                    ) : (
                                        <span className="text-base font-medium text-slate-500">Guest</span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="ml-auto flex-shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-slate-400 dark:hover:text-white"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800">Dashboard</Link>
                                    <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800">Login</Link>
                                    <Link to="/signup" className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
