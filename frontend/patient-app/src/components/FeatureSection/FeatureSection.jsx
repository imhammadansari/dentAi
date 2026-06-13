import React from 'react';
import {
    BoltIcon,
    ClockIcon,
    LockClosedIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Reveal } from '../Reveal/Reveal';

const features = [
    { icon: BoltIcon, title: 'Instant AI Reports', desc: 'Get your X-ray analyzed in under 30 seconds with detailed findings and risk scores.' },
    { icon: ClockIcon, title: '24/7 Access', desc: 'Upload X-rays and view your dental history anytime — no waiting rooms.' },
    { icon: LockClosedIcon, title: 'Secure & Private', desc: 'End-to-end encryption and bcrypt password protection keeps your data safe.' },
    { icon: CalendarDaysIcon, title: 'Easy Booking', desc: 'Browse available slots from verified dentists and book in under a minute.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Live Chat', desc: 'Chat directly with your dentist during your appointment window.' },
    { icon: DocumentMagnifyingGlassIcon, title: 'Full History', desc: 'Track all your X-rays, reports, and consultations in one organized dashboard.' },
];

export const FeatureSection = () => (
    <section id="features" className="lg:py-14 px-6 lg:px-18">
        <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-12 lg:mb-20">
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                    Everything You Need
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4 mb-4">
                    Why patients love<br />
                    <span className="text-emerald-500">Dent AI</span>
                </h2>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="grid grid-cols-1 gap-5">
                    {features.map((f, i) => (
                        <Reveal key={i} delay={i * 60}>
                            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all group">
                                <div className="w-11 h-11 shrink-0 bg-emerald-100 group-hover:bg-emerald-500 rounded-xl flex items-center justify-center transition-colors">
                                    <f.icon className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 mb-1">{f.title}</h4>
                                    <p className="text-sm text-emerald-600 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={200}>
                    <div className="relative">
                        <img
                            src="/images/why-us.png"
                            alt="Features"
                            className="rounded-3xl shadow-2xl shadow-emerald-100 w-full"
                        />
                        <div className="absolute -top-5 -left-5 bg-emerald-600 text-white rounded-2xl p-4 shadow-xl">
                            <p className="text-2xl font-bold">94%</p>
                            <p className="text-xs text-emerald-200">AI accuracy</p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    </section>
);