import React from 'react';
import {
    UserGroupIcon,
    DocumentMagnifyingGlassIcon,
    CalendarDaysIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Reveal } from '../Reveal/Reveal';

const aboutStats = [
    { icon: UserGroupIcon, title: '10+ Dentists', sub: 'Expert network' },
    { icon: DocumentMagnifyingGlassIcon, title: '100+ Reports', sub: 'AI generated' },
    { icon: CalendarDaysIcon, title: '50+ Consults', sub: 'Completed' },
    { icon: ShieldCheckIcon, title: '90% Satisfaction', sub: 'Patient rating' },
];

export const AboutSection = () => (
    <section id="about" className="py-28 px-6 lg:px-18">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
                <div className="relative">
                    <img
                        src="/images/about-image.jpg"
                        alt="About DentAI"
                        className="rounded-3xl shadow-2xl shadow-emerald-100 w-full object-cover h-[480px]"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-emerald-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <UserGroupIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-emerald-900 text-lg">Student-Built</p>
                                <p className="text-sm text-emerald-600">University FYP → Real Impact</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            <div>
                <Reveal delay={100}>
                    <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4 border border-emerald-200">
                        Our Story
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6 leading-tight">
                        Built by students,<br />
                        <span className="text-emerald-500">for everyone.</span>
                    </h2>
                    <p className="text-emerald-700 text-lg leading-relaxed mb-8">
                        Dent AI was founded by a passionate team of university students who saw an opportunity to make dental care more accessible and accurate. What started as a final-year project quickly evolved into a mission — combining AI with real-world healthcare needs to help patients get faster, more reliable dental insights.
                    </p>
                </Reveal>

                <div className="grid grid-cols-2 gap-4">
                    {aboutStats.map((s, i) => (
                        <Reveal key={i} delay={i * 80}>
                            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                    <s.icon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <p className="font-bold text-emerald-900">{s.title}</p>
                                <p className="text-sm text-emerald-600">{s.sub}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    </section>
);