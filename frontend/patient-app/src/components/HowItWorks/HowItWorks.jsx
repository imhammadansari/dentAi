import React from 'react';
import { CameraIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Reveal } from '../Reveal/Reveal';

const steps = [
    {
        step: '01', icon: CameraIcon,
        title: 'Upload Your X-Ray',
        desc: 'Securely upload your dental X-ray image. We accept all standard formats from any device.',
        img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    },
    {
        step: '02', icon: SparklesIcon,
        title: 'AI Analyzes Instantly',
        desc: 'Our advanced AI scans your X-ray in seconds, detecting issues and generating a detailed report.',
        img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    },
    {
        step: '03', icon: ChatBubbleLeftRightIcon,
        title: 'Consult a Dentist',
        desc: 'Book a live consultation with a verified dentist to discuss results and get expert advice.',
        img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    },
];

export const HowItWorks = () => (
    <section id="how-it-works" className="py-28 px-6 lg:px-18 bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-20">
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                    Simple Process
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4 mb-4">
                    Three steps to better<br />dental health
                </h2>
                <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
                    From X-ray upload to expert consultation — fast, accurate, and effortless.
                </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-4 relative">
                <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-px bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

                {steps.map((s, i) => (
                    <Reveal key={i} delay={i * 120}>
                        <div className="group relative bg-white rounded-3xl border border-emerald-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-48 overflow-hidden">
                                <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                <div className="absolute top-4 right-4 text-5xl font-bold text-white/30 leading-none">{s.step}</div>
                            </div>
                            <div className="p-6">
                                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                    <s.icon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-900 mb-2">{s.title}</h3>
                                <p className="text-emerald-600 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);