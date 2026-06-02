import React, { useState, useEffect, useRef } from 'react';
import {
    ShieldCheckIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    DocumentMagnifyingGlassIcon,
    SparklesIcon,
    CheckCircleIcon,
    ClockIcon,
    UserGroupIcon,
    ChevronRightIcon,
    Bars3Icon,
    XMarkIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ArrowUpRightIcon,
    CameraIcon,
    BoltIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

/* ─── tiny hook: reveal on scroll ─── */
const useReveal = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
};

/* ─── reusable reveal wrapper ─── */
const Reveal = ({ children, delay = 0, className = '' }) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

const LandingPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    const navLinks = ['Home', 'About', 'How It Works', 'Features', 'Contact'];

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="bg-white text-emerald-950 overflow-x-hidden ">

            {/* ── NAV ── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-emerald-100/60' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                            <ShieldCheckIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-emerald-900">Dent<span className="text-emerald-500">AI</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(l => (
                            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(' ', '-'))}
                                className="text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors">
                                {l}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/patient-login')}
                            className="px-5 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                            Login
                        </button>
                        <button onClick={() => navigate('/patient-signup')}
                            className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shadow-md shadow-emerald-200"
                            style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                            Get Started
                        </button>
                    </div>

                    <button className="md:hidden text-emerald-700" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </div>

                {/* mobile drawer */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-emerald-100 px-6 py-4 space-y-4">
                        {navLinks.map(l => (
                            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(' ', '-'))}
                                className="block w-full text-left text-sm font-medium text-emerald-700 py-2">
                                {l}
                            </button>
                        ))}
                        <div className="flex gap-3 pt-2 border-t border-emerald-100">
                            <button onClick={() => navigate('/patient-login')}
                                className="flex-1 py-2.5 text-sm font-semibold text-emerald-700 border border-emerald-200 rounded-xl">Login</button>
                            <button onClick={() => navigate('/patient-signup')}
                                className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl"
                                style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>Sign Up</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── HERO ── */}
            <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* background blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl"
                        style={{ background: 'radial-gradient(circle, #22c55e, #bbf7d0)' }} />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                        style={{ background: 'radial-gradient(circle, #86efac, #d1fae5)' }} />
                    {/* subtle grid */}
                    <div className="absolute inset-0 opacity-[0.025]"
                        style={{ backgroundImage: 'linear-gradient(#15803d 1px,transparent 1px),linear-gradient(90deg,#15803d 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    {/* left */}
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
                                style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                                Start For Free
                                <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                            <button onClick={() => scrollTo('how-it-works')}
                                className="flex items-center gap-2 px-8 py-4 font-semibold text-emerald-700 bg-white border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                                See How It Works
                            </button>
                        </div>

                        {/* trust bar */}
                        <div className="flex items-center gap-6 mt-12" style={{ animation: 'slideUp 0.7s ease 0.4s both' }}>
                            <div className="flex -space-x-3">
                                {['#22c55e','#16a34a','#15803d','#166534'].map((c, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                        style={{ background: c }}>
                                        {['M','S','A','R'][i]}
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

                    {/* right — hero image with floating cards */}
                    <div className="relative" style={{ animation: 'slideUp 0.8s ease 0.2s both' }}>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200/60">
                            <img
                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
                                alt="Dental care"
                                className="w-full h-[520px] object-cover"
                            />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,46,22,0.3), transparent)' }} />
                        </div>

                        {/* floating card 1 */}
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

                        {/* floating card 2 */}
                        <div className="absolute -right-6 bottom-20 bg-white rounded-2xl p-4 shadow-xl shadow-emerald-100 border border-emerald-50"
                            style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                            <p className="text-xs text-emerald-500 font-medium mb-1">Next Appointment</p>
                            <p className="text-sm font-bold text-emerald-900">Dr. Arham · Tomorrow</p>
                            <p className="text-xs text-emerald-600 mt-0.5">10:30 AM — 11:00 AM</p>
                        </div>

                        {/* floating card 3 */}
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

            {/* ── STATS BAND ── */}
            <section className="bg-emerald-600 py-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {[
                            { num: '500+', label: 'Patients Served' },
                            { num: '94%', label: 'AI Accuracy Rate' },
                            { num: '10+', label: 'Expert Dentists' },
                            { num: '24/7', label: 'Always Available' },
                        ].map((s, i) => (
                            <Reveal key={i} delay={i * 80}>
                                <div className="text-4xl font-bold mb-1">{s.num}</div>
                                <div className="text-emerald-200 text-sm font-medium">{s.label}</div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section id="about" className="py-28 px-6">
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
                            {[
                                { icon: UserGroupIcon, title: '10+ Dentists', sub: 'Expert network' },
                                { icon: DocumentMagnifyingGlassIcon, title: '100+ Reports', sub: 'AI generated' },
                                { icon: CalendarDaysIcon, title: '50+ Consults', sub: 'Completed' },
                                { icon: ShieldCheckIcon, title: '90% Satisfaction', sub: 'Patient rating' },
                            ].map((s, i) => (
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

            {/* ── HOW IT WORKS ── */}
            <section id="how-it-works" className="py-28 px-6 bg-gradient-to-b from-emerald-50/60 to-white">
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

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* connector line */}
                        <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-px bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

                        {[
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
                        ].map((s, i) => (
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

            {/* ── FEATURES ── */}
            <section id="features" className="py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <Reveal className="text-center mb-20">
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
                            {[
                                { icon: BoltIcon, title: 'Instant AI Reports', desc: 'Get your X-ray analyzed in under 30 seconds with detailed findings and risk scores.' },
                                { icon: ClockIcon, title: '24/7 Access', desc: 'Upload X-rays and view your dental history anytime — no waiting rooms.' },
                                { icon: LockClosedIcon, title: 'Secure & Private', desc: 'End-to-end encryption and bcrypt password protection keeps your data safe.' },
                                { icon: CalendarDaysIcon, title: 'Easy Booking', desc: 'Browse available slots from verified dentists and book in under a minute.' },
                                { icon: ChatBubbleLeftRightIcon, title: 'Live Chat', desc: 'Chat directly with your dentist during your appointment window.' },
                                { icon: DocumentMagnifyingGlassIcon, title: 'Full History', desc: 'Track all your X-rays, reports, and consultations in one organized dashboard.' },
                            ].map((f, i) => (
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
                                {/* floating badge */}
                                <div className="absolute -top-5 -left-5 bg-emerald-600 text-white rounded-2xl p-4 shadow-xl">
                                    <p className="text-2xl font-bold">94%</p>
                                    <p className="text-xs text-emerald-200">AI accuracy</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-28 px-6 bg-gradient-to-b from-white to-emerald-50/60">
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
                        {[
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
                        ].map((t, i) => (
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

            {/* ── CTA BANNER ── */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center text-white"
                            style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)' }}>
                            {/* texture */}
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

            {/* ── CONTACT ── */}
            <section id="contact" className="py-28 px-6 bg-emerald-50/40">
                <div className="max-w-7xl mx-auto">
                    <Reveal className="text-center mb-16">
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                            Contact Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4 mb-4">
                            We'd love to hear from you
                        </h2>
                        <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
                            Have a question or need support? Send us a message and we'll get back to you promptly.
                        </p>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* contact info */}
                        <Reveal>
                            <div className="space-y-6">
                                {[
                                    { icon: EnvelopeIcon, label: 'Email', val: 'contact@dentai.com' },
                                    { icon: PhoneIcon, label: 'Phone', val: '+92 328 2020966' },
                                    { icon: MapPinIcon, label: 'Office', val: 'Gulshan-e-Iqbal Block 11, Karachi' },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                            <c.icon className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">{c.label}</p>
                                            <p className="font-semibold text-emerald-900">{c.val}</p>
                                        </div>
                                    </div>
                                ))}

                                <img
                                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80"
                                    alt="Office"
                                    className="rounded-2xl w-full h-52 object-cover shadow-lg"
                                />
                            </div>
                        </Reveal>

                        {/* form */}
                        <Reveal delay={150}>
                            <form className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-lg space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {['First Name', 'Last Name'].map(l => (
                                        <div key={l}>
                                            <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">{l}</label>
                                            <input type="text" placeholder={l === 'First Name' ? 'Ali' : 'Khan'}
                                                className="w-full px-4 py-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Email</label>
                                    <input type="email" placeholder="ali@example.com"
                                        className="w-full px-4 py-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Subject</label>
                                    <input type="text" placeholder="How can we help?"
                                        className="w-full px-4 py-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Message</label>
                                    <textarea rows="5" placeholder="Tell us more..."
                                        className="w-full px-4 py-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none" />
                                </div>
                                <button type="button"
                                    className="w-full py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5"
                                    style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                                    Send Message
                                </button>
                            </form>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-emerald-950 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-10 mb-12">
                        <div>
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">Dent<span className="text-emerald-400">AI</span></span>
                            </div>
                            <p className="text-emerald-400 text-sm leading-relaxed">
                                Revolutionizing dental care through AI-powered analysis and expert connectivity.
                            </p>
                        </div>

                        {[
                            { heading: 'Navigate', links: ['Home', 'About', 'How It Works', 'Features', 'Contact'] },
                            { heading: 'For Patients', links: ['Upload X-Ray', 'View Reports', 'Book Consultation', 'Find Dentist', 'FAQs'] },
                            { heading: 'Support', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Help Center', 'Contact Us'] },
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{col.heading}</h4>
                                <ul className="space-y-3">
                                    {col.links.map(l => (
                                        <li key={l}>
                                            <button className="text-emerald-400 hover:text-white text-sm transition-colors">{l}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-emerald-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-emerald-500 text-sm">© 2025 Dent AI. All rights reserved.</p>
                        <p className="text-emerald-500 text-sm">Made with ❤️ by students, for patients.</p>
                    </div>
                </div>
            </footer>

            {/* animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;