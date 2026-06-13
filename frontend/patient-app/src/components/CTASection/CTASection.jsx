import React from 'react';
import { SparklesIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../Reveal/Reveal';

export const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <Reveal>
                    <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center text-white"
                        style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)' }}>
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '16px 16px' }} />
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
                            style={{ background: '#22c55e' }} />
                        <div className="relative z-10">
                            <SparklesIcon className="w-12 h-12 mx-auto text-emerald-300 mb-4" />
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Ready for smarter dental care?
                            </h2>
                            <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto">
                                Join hundreds of patients already using Dent AI to stay ahead of dental issues — before they become problems.
                            </p>
                            <button onClick={() => navigate('/patient-signup')}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-emerald-800 font-bold rounded-2xl text-lg hover:bg-emerald-50 transition-all shadow-2xl shadow-emerald-900/30 hover:-translate-y-0.5">
                                Create Free Account
                                <ArrowUpRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};