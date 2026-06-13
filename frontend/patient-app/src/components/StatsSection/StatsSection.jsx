import React from 'react';
import { Reveal } from '../Reveal/Reveal';

const stats = [
    { num: '500+', label: 'Patients Served' },
    { num: '94%', label: 'AI Accuracy Rate' },
    { num: '10+', label: 'Expert Dentists' },
    { num: '24/7', label: 'Always Available' },
];

export const StatsSection = () => (
    <section className="bg-emerald-600 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                {stats.map((s, i) => (
                    <Reveal key={i} delay={i * 80}>
                        <div className="text-4xl font-bold mb-1">{s.num}</div>
                        <div className="text-emerald-200 text-sm font-medium">{s.label}</div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);