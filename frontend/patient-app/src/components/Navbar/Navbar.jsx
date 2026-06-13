import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = ['Home', 'About', 'How It Works', 'Features', 'Contact'];
const brandGradient = 'linear-gradient(135deg,#22c55e,#15803d)';

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-emerald-100/60' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-18 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: brandGradient }}>
                        <ShieldCheckIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-emerald-900">Dent<span className="text-emerald-500">AI</span></span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(l => (
                        <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, '-'))}
                            className="text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors">
                            {l}
                        </button>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated() ? (
                        <button onClick={() => navigate('/patient-dashboard/home')}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                            <UserCircleIcon className="w-5 h-5" />
                            {user?.name}
                        </button>
                    ) : (
                        <>
                            <button onClick={() => navigate('/patient-login')}
                                className="px-5 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                                Login
                            </button>
                            <button onClick={() => navigate('/patient-signup')}
                                className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shadow-md shadow-emerald-200"
                                style={{ background: brandGradient }}>
                                Get Started
                            </button>
                        </>
                    )}
                </div>

                <button className="md:hidden text-emerald-700" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white border-t border-emerald-100 px-6 py-4 space-y-4">
                    {navLinks.map(l => (
                        <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, '-'))}
                            className="block w-full text-left text-sm font-medium text-emerald-700 py-2">
                            {l}
                        </button>
                    ))}

                    {isAuthenticated() ? (
                        <div className="pt-2 border-t border-emerald-100">
                            <button onClick={() => { navigate('/patient-dashboard/home'); setMenuOpen(false); }}
                                className="flex items-center gap-2 w-full text-left text-sm font-semibold text-emerald-700 py-2">
                                <UserCircleIcon className="w-5 h-5" />
                                {user?.name}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 pt-2 border-t border-emerald-100">
                            <button onClick={() => navigate('/patient-login')}
                                className="flex-1 py-2.5 text-sm font-semibold text-emerald-700 border border-emerald-200 rounded-xl">
                                Login
                            </button>
                            <button onClick={() => navigate('/patient-signup')}
                                className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl"
                                style={{ background: brandGradient }}>
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};