import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navigateLinks = ['Home', 'About', 'How It Works', 'Features', 'Contact'];

const patientLinks = [
    { label: 'Upload X-Ray', path: '/patient-dashboard/upload' },
    { label: 'View Reports', path: '/patient-dashboard/reports' },
    { label: 'Book Consultation', path: '/patient-dashboard/book' },
    { label: 'My Consultations', path: '/patient-dashboard/consultations' },
];

const supportLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'Cookie Policy', path: '/cookie-policy' },
    { label: 'Help Center', path: '/help-center' },
    { label: 'Contact Us', path: '/contact-us' },
];

export const Footer = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // If logged in, go straight to the dashboard page.
    // If not, send them to login — and remember where they wanted to go
    // so the login page can redirect back after success.
    const handlePatientLinkClick = (path) => {
        if (isAuthenticated()) {
            navigate(path);
        } else {
            navigate('/patient-login', { state: { from: { pathname: path } } });
        }
    };

    return (
        <footer className="bg-emerald-950 text-white py-16 px-6 lg:px-18">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-10 mb-12">
                    <div>
                        <div className="flex items-center gap-2.5 mb-5">
                            {/* <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                                <ShieldCheckIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Dent<span className="text-emerald-400">AI</span></span> */}

                            <img className='w-36' src="/images/logo-dent-white.png" alt="" />
                        </div>
                        <p className="text-emerald-400 text-sm leading-relaxed">
                            Revolutionizing dental care through AI-powered analysis and expert connectivity.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Navigate</h4>
                        <ul className="space-y-3">
                            {navigateLinks.map(l => (
                                <li key={l}>
                                    <button
                                        onClick={() => scrollToSection(l.toLowerCase().replace(/\s+/g, '-'))}
                                        className="text-emerald-400 cursor-pointer hover:text-white text-sm transition-colors">
                                        {l}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">For Patients</h4>
                        <ul className="space-y-3">
                            {patientLinks.map(l => (
                                <li key={l.label}>
                                    <button
                                        onClick={() => handlePatientLinkClick(l.path)}
                                        className="text-emerald-400 cursor-pointer hover:text-white text-sm transition-colors">
                                        {l.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            {supportLinks.map(l => (
                                <li key={l.label}>
                                    <button
                                        onClick={() => navigate(l.path)}
                                        className="text-emerald-400 cursor-pointer hover:text-white text-sm transition-colors">
                                        {l.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-emerald-800 flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-emerald-500 text-sm">© 2025 Dent AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};