// 

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth provider component - SIMPLIFIED FOR PATIENT ONLY
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            // Check localStorage for existing user
            const storedUser = localStorage.getItem('dentai_user');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Auth check error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Simple login function - Accepts any credentials for patient
    const login = async (email, password) => {
        setLoading(true);

        try {
            // For demo - accept any email/password for patient login
            const userData = {
                id: 1,
                name: 'Hammad Ansari',
                email: email || 'patient@example.com',
                role: 'patient',
                memberSince: '2023-06-15',
                avatar: null
            };

            // Store in localStorage
            localStorage.setItem('dentai_user', JSON.stringify(userData));

            // Update state
            setUser(userData);

            return { success: true, user: userData };

        } catch (err) {
            return { success: false, error: 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    // Simple register function
    const register = async (name, email, password) => {
        setLoading(true);

        try {
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                role: 'patient',
                memberSince: new Date().toISOString().split('T')[0]
            };

            // Store in localStorage
            localStorage.setItem('dentai_user', JSON.stringify(newUser));

            // Update state
            setUser(newUser);

            return { success: true, user: newUser };

        } catch (err) {
            return { success: false, error: 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('dentai_user');

        // Update state
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;