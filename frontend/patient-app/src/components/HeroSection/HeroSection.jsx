import React from 'react';
import { SparklesIcon, ArrowUpRightIcon, CheckCircleIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const brandGradient = 'linear-gradient(135deg,#22c55e,#15803d)';
const avatarColors = ['#22c55e', '#16a34a', '#15803d', '#166534'];
const avatarLetters = ['M', 'S', 'A', 'R'];

export const HeroSection = ({ scrollTo }) => {
    const navigate = useNavigate();

    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden lg:px-12">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #22c55e, #bbf7d0)' }} />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #86efac, #d1fae5)' }} />
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{ backgroundImage: 'linear-gradient(#15803d 1px,transparent 1px),linear-gradient(90deg,#15803d 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6 lg:py-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold mb-8"
                        style={{ animation: 'fadeIn 0.6s ease' }}>
                        <SparklesIcon className="w-4 h-4" />
                        AI-Powered Dental Care Platform
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
                        style={{ animation: 'slideUp 0.7s ease 0.1s both' }}>
                        Your Smile,<br />
                        <span className="text-emerald-500">Smarter</span>{' '}
                        <span className="text-emerald-900">Than</span><br />
                        <span className="text-emerald-900">Ever Before.</span>
                    </h1>
                    <p className="text-lg text-emerald-700 leading-relaxed mb-10 max-w-lg"
                        style={{ animation: 'slideUp 0.7s ease 0.2s both' }}>
                        Upload your X-rays, get instant AI analysis, and connect with top dentists — all in one place. Take control of your dental health today.
                    </p>
                    <div className="flex flex-wrap gap-4" style={{ animation: 'slideUp 0.7s ease 0.3s both' }}>
                        <button onClick={() => navigate('/patient-signup')}
                            className="group flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:-translate-y-0.5"
                            style={{ background: brandGradient }}>
                            Start For Free
                            <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                        <button onClick={() => scrollTo('how-it-works')}
                            className="flex items-center gap-2 px-8 py-4 font-semibold text-emerald-700 bg-white border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                            See How It Works
                        </button>
                    </div>

                    <div className="flex items-center gap-6 mt-12" style={{ animation: 'slideUp 0.7s ease 0.4s both' }}>
                        <div className="flex -space-x-3">
                            {avatarColors.map((c, i) => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                    style={{ background: c }}>
                                    {avatarLetters[i]}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-emerald-900">500+ happy patients</p>
                            <div className="flex gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                            </div>
                        </div>
                        <div className="w-px h-10 bg-emerald-200" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-900">94% accuracy</p>
                            <p className="text-xs text-emerald-600">AI detection rate</p>
                        </div>
                    </div>
                </div>

                <div className="relative" style={{ animation: 'slideUp 0.8s ease 0.2s both' }}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200/60">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
                            alt="Dental care"
                            className="w-full h-[520px] object-cover"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,46,22,0.3), transparent)' }} />
                    </div>

                    <div className="absolute -left-8 top-12 bg-white rounded-2xl p-4 shadow-xl shadow-emerald-100 flex items-center gap-3 border border-emerald-50"
                        style={{ animation: 'float 4s ease-in-out infinite' }}>
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-emerald-500 font-medium">Analysis Complete</p>
                            <p className="text-sm font-bold text-emerald-900">No cavities detected ✓</p>
                        </div>
                    </div>

                    <div className="absolute -right-6 bottom-20 bg-white rounded-2xl p-4 shadow-xl shadow-emerald-100 border border-emerald-50"
                        style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                        <p className="text-xs text-emerald-500 font-medium mb-1">Next Appointment</p>
                        <p className="text-sm font-bold text-emerald-900">Dr. Hammad · Tomorrow</p>
                        <p className="text-xs text-emerald-600 mt-0.5">10:30 AM — 11:00 AM</p>
                    </div>

                    <div className="absolute left-6 -bottom-5 bg-emerald-600 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3"
                        style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                        <BoltIcon className="w-5 h-5 text-emerald-200" />
                        <div>
                            <p className="text-xs text-emerald-200">AI powered</p>
                            <p className="text-sm font-bold">Instant results</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};