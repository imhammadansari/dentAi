import React from 'react';
import { Reveal } from '../Reveal/Reveal';

const testimonials = [
    {
        name: 'Maaz Ilyas',
        role: 'Patient',
        avatar: 'MI',
        color: '#22c55e',
        quote: 'The AI detected a cavity I didn\'t know I had. I booked a consultation immediately and got it treated early. This platform is a game-changer.',
        stars: 5,
    },
    {
        name: 'Sara Ahmed',
        role: 'Patient',
        avatar: 'SA',
        color: '#16a34a',
        quote: 'So easy to use! I uploaded my X-ray at midnight and had a full report by morning. Booked my dentist slot the same day.',
        stars: 5,
    },
    {
        name: 'Dr. Arham Siddiqui',
        role: 'Partner Dentist',
        avatar: 'AS',
        color: '#15803d',
        quote: 'Dent AI makes my patients come in better prepared. The AI reports save us 10 minutes per consultation and improve outcomes significantly.',
        stars: 5,
    },
];

export const TestimonialsSection = () => (
    <section className="py-28 px-6 lg:px-18 bg-gradient-to-b from-white to-emerald-50/60">
        <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-16">
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                    Patient Stories
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4 mb-4">
                    Real people, real results
                </h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                    <Reveal key={i} delay={i * 100}>
                        <div className="bg-white rounded-3xl p-7 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <div className="flex mb-2">
                                {[...Array(t.stars)].map((_, j) => <span key={j} className="text-amber-400">★</span>)}
                            </div>
                            <p className="text-emerald-700 leading-relaxed flex-1 mb-6 text-sm">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ background: t.color }}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-900 text-sm">{t.name}</p>
                                    <p className="text-emerald-500 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);