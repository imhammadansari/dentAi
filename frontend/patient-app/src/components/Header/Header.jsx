import React, { useState } from 'react'
import {
    SparklesIcon,
    XMarkIcon,
    Bars3Icon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className={`w-full px-[24px] bg-white transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className='flex gap-2 items-center'>
                    {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                        <ShieldCheckIcon className="w-6 h-6 text-white cusror-pointer" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>
                            Dent<span style={{ color: '#22c55e' }}>AI</span>
                        </h1>
                    </div> */}
                    <img src="/images/logo.png" alt="" />

                </div>

                {/* Desktop Navigation */}
                {/* <div className='flex gap-[20px]'> */}
                {/* <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollToSection('home')} className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">Home</button>
                        <button onClick={() => scrollToSection('about')} className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">About</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">How It Works</button>
                        <button onClick={() => scrollToSection('why-us')} className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">Why Us</button>
                        <button onClick={() => scrollToSection('contact')} className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">Contact</button>
                    </div> */}

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => navigate('/patient-login')} className="px-5 cursor-pointer py-2 text-emerald-700 cursor-pointer font-medium hover:text-emerald-900 transition-colors">
                        Login As Patient
                    </button>
                    <button onClick={() => navigate('/dentist-login')} className="px-5 cursor-pointer py-2 text-emerald-700 cursor-pointer font-medium hover:text-emerald-900 transition-colors">
                        Login As Dentist
                    </button>
                </div>

                {/* </div> */}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-emerald-700 cursor-pointer"
                >
                    {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {/* {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6">
                    <div className="flex flex-col gap-4">
                        <button onClick={() => scrollToSection('home')} className="text-emerald-700 hover:text-emerald-900 font-medium py-2">Home</button>
                        <button onClick={() => scrollToSection('about')} className="text-emerald-700 hover:text-emerald-900 font-medium py-2">About</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-emerald-700 hover:text-emerald-900 font-medium py-2">How It Works</button>
                        <button onClick={() => scrollToSection('why-us')} className="text-emerald-700 hover:text-emerald-900 font-medium py-2">Why Us</button>
                        <button onClick={() => scrollToSection('contact')} className="text-emerald-700 hover:text-emerald-900 font-medium py-2">Contact</button>
                        <div className="flex gap-4 pt-4 border-t border-emerald-100">
                            <button className="flex-1 px-4 py-2 text-emerald-700 font-medium border border-emerald-200 rounded-lg">
                                Login
                            </button>
                            <button className="flex-1 px-4 py-2 text-emerald-700 font-medium border border-emerald-200 rounded-lg">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </nav>
    )
}

export default Header
