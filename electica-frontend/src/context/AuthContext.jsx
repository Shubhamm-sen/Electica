import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // Start Validating token with backend
                    // Assuming there's a /auth/me or similar endpoint to check token validity and get user details
                    // For now, we'll try to get user details. If it fails with 401, the interceptor will handle it.
                    // If your backend doesn't have a /me endpoint, you might need to decode the JWT if it's a real JWT.
                    // But for security, checking with backend is better.

                    // const response = await api.get('/auth/me'); 
                    // setUser(response.data);

                    // FALLBACK if no /me endpoint yet: 
                    // We assume token is valid if it exists for this step, 
                    // but usually you want to fetch the user profile here.
                    // Let's at least decode it or assume logged in.

                    // Since we don't know the exact "get user" endpoint, we will optimistically set a user object
                    // In a real app, you should fetch this from the server.

                    // If your backend sends the user object on login, you might want to store it in localStorage too (less secure)
                    // or fetch it on load.

                    // For this stage of learning, let's keep it simple:
                    // If we have a token, we are "authenticated".
                    // We can try to fetch user details if you have that endpoint.

                    if (!user) {
                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        } else {
                            // If no user data stored but we have a token (rare edge case), 
                            // we might want to fetch /auth/me or just logout. 
                            // For now, let's keep the user null until we have a real /me endpoint.
                        }
                    }

                } catch (error) {
                    console.error("Token validation failed", error);
                    logout();
                }
            }
            setLoading(false);
        };

        validateToken();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            // Assuming response structure: { token: "...", user: { ... } }
            // Adjust this based on your actual backend response!
            // The backend returns a flat object: { id, username, email, role, token, message }
            const { token: newToken, ...userData } = response.data;

            if (newToken) {
                localStorage.setItem('token', newToken);
                // Also save user data to localStorage to persist across reloads
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(newToken);
                setUser(userData);
                return true;
            } else {
                console.error("No token received in login response", response.data);
                throw new Error("Login failed: No token received");
            }

        } catch (error) {
            console.error("Login error:", error);
            throw error; // Propagate error to the component to show to user
        }
    };

    const signup = async (userData) => {
        try {
            await api.post('/auth/signup', userData);
            return true;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        // Merge existing user data with updates
        const newUser = { ...user, ...updatedUserData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
