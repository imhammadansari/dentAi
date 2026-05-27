import React, { useState, useEffect } from 'react';
import {
    SparklesIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    ShieldCheckIcon,
    ClockIcon,
    ChartBarIcon,
    CameraIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    XMarkIcon,
    Bars3Icon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';

// Import images (you'll need to add these images to your public folder or use image URLs)
// For now, I'll use placeholder images from Unsplash

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <>
            <main className='flex flex-col'>
                <div className="bg-gradient-to-b from-white to-emerald-50 px-[40px]">
                    {/* Navigation Header */}

                    <Header />
                    {/* Hero Section */}
                    <section id="home" className="py-10 px-6">
                        <div className="container mx-auto max-w-7xl">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                                        🦷 AI-Powered Dental Care
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-6">
                                        Smart Dental Care
                                        <span className="text-emerald-600 block">with Artificial Intelligence</span>
                                    </h1>
                                    <p className="text-[16px] text-emerald-700 mb-8">
                                        Upload your dental X-rays and get instant AI-powered analysis.
                                        Book consultations with top dentists and track your oral health journey.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button onClick={() => navigate("/patient-dashboard/home")} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }} className="px-8 cursor-pointer py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group">
                                            Get Started Free
                                        </button>
                                        {/* <button className="px-8 py-4 bg-white border-2 border-emerald-200 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all cursor-pointer">
                                            Watch Demo
                                        </button> */}
                                    </div>
                                    {/* <div className="flex items-center gap-6 mt-8">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-dent border-2 border-white"></div>
                                    ))}
                                </div>
                                <p className="text-emerald-700">
                                    <span className="font-bold text-emerald-900">10,000+</span> happy patients
                                </p>
                            </div> */}
                                </div>
                                <div className="relative">
                                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
                                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80"
                                        alt="Dental AI Analysis"
                                        className="rounded-3xl shadow-2xl relative z-10"
                                    />
                                    <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-emerald-900">98% Accuracy</p>
                                                <p className="text-sm text-emerald-600">AI Detection Rate</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trusted By Section */}
                    {/* <section className="py-16 bg-white border-y border-emerald-100">
                <div className="container mx-auto px-6">
                    <p className="text-center text-emerald-600 mb-8">Trusted by leading dental clinics worldwide</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 w-32 bg-emerald-100 rounded-lg opacity-50 hover:opacity-100 transition-opacity"></div>
                        ))}
                    </div>
                </div>
            </section> */}

                    {/* About Us Section */}
                    <section id="about" className="py-20 px-6">
                        <div className="container mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                                <h2 className="text-[40px] font-bold text-emerald-900 mb-4">About Dent AI</h2>
                                <p className="text-xl text-emerald-600 max-w-3xl mx-auto">
                                    Revolutionizing dental care through artificial intelligence and expert connectivity
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <img
                                        src="/images/about-image.jpg"
                                        alt="Dental Team"
                                        className="rounded-2xl shadow-xl"
                                    />
                                </div>
                                <div className="space-y-6">
                                    <p className="text-lg text-emerald-700">
                                        Dent AI was founded by a passionate team of university students who saw an opportunity to make dental care more accessible and accurate. What started as a final year project at the university quickly evolved into a mission to revolutionize dental diagnostics. Combining our academic knowledge in artificial intelligence with real-world healthcare needs, we built a platform that helps patients get faster, more reliable dental insights.
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-white rounded-xl border border-emerald-100">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                                                <UserGroupIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-emerald-900">10+ Dentists</h4>
                                            <p className="text-sm text-emerald-600">Expert Network</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-emerald-100">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                                                <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-emerald-900">100+ Reports</h4>
                                            <p className="text-sm text-emerald-600">Generated</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-emerald-100">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                                                <CalendarDaysIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-emerald-900">50+ Consultations</h4>
                                            <p className="text-sm text-emerald-600">Completed</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-emerald-100">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                                                <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-emerald-900">90% Satisfaction</h4>
                                            <p className="text-sm text-emerald-600">Patient Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section id="how-it-works" className="py-20 px-6 bg-white">
                        <div className="container mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-emerald-900 mb-4">How Dent AI Works</h2>
                                <p className="text-xl text-emerald-600 max-w-3xl mx-auto">
                                    Simple, fast, and accurate - get your dental analysis in three easy steps
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center relative">
                                    {/* <div className="absolute top-12 left-1/2 w-full h-0.5 bg-emerald-200 hidden md:block"></div> */}
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-3xl font-bold text-emerald-600">1</span>
                                        </div>
                                        <img
                                            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                            alt="Upload X-Ray"
                                            className="rounded-xl shadow-lg mb-4 h-48 w-full object-cover"
                                        />
                                        <h3 className="text-xl font-bold text-emerald-900 mb-2">Upload X-Ray</h3>
                                        <p className="text-emerald-600">Simply upload your dental X-ray images to our secure platform</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-3xl font-bold text-emerald-600">2</span>
                                        </div>
                                        <img
                                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                            alt="AI Analysis"
                                            className="rounded-xl shadow-lg mb-4 h-48 w-full object-cover"
                                        />
                                        <h3 className="text-xl font-bold text-emerald-900 mb-2">AI Analysis</h3>
                                        <p className="text-emerald-600">Our AI instantly analyzes your X-rays and generates detailed reports</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-3xl font-bold text-emerald-600">3</span>
                                        </div>
                                        <img
                                            src="https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                                            alt="Consult Dentist"
                                            className="rounded-xl shadow-lg mb-4 h-48 w-full object-cover"
                                        />
                                        <h3 className="text-xl font-bold text-emerald-900 mb-2">Consult Dentist</h3>
                                        <p className="text-emerald-600">Connect with expert dentists for follow-up consultations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us Section */}
                    <section id="why-us" className="py-20 px-6">
                        <div className="container mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-emerald-900 mb-4">Why Choose Dent AI</h2>
                                <p className="text-xl text-emerald-600 max-w-3xl mx-auto">
                                    Experience the future of dental care with our innovative platform
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                            <ClockIcon className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-900 mb-2">24/7 Availability</h3>
                                        <p className="text-emerald-600">Upload X-rays anytime, get reports instantly</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                            <ChartBarIcon className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-900 mb-2">90% Accuracy</h3>
                                        <p className="text-emerald-600">AI-powered detection with high precision</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                            <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-900 mb-2">Secure & Private</h3>
                                        <p className="text-emerald-600">All data encrypted with bcrypt before storage</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                            <UserGroupIcon className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-900 mb-2">Expert Network</h3>
                                        <p className="text-emerald-600">Connect with top dental specialists</p>
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src="/images/why-us.png"
                                        alt="Dental Technology"
                                        className="rounded-2xl shadow-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-20 px-6 bg-white">
                        <div className="container mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-emerald-900 mb-4">What Our Patients Say</h2>
                                <p className="text-xl text-emerald-600 max-w-3xl mx-auto">
                                    Real stories from real people who transformed their dental health with Dent AI
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    {
                                        name: 'Maaz Ilyas',
                                        role: 'Patient',
                                        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
                                        quote: 'The AI analysis detected a cavity I didn\'t know I had. I was able to book a consultation immediately and get it treated early.'
                                    },
                                    // {
                                    //     name: 'Fasih Ur Rehman',
                                    //     role: 'Patient',
                                    //     image: 'https://images.unsplash.com/photo-1494790108777-466fd103c8ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
                                    //     quote: 'Amazing platform! The reports are so detailed and easy to understand. Saved me so much time and worry.'
                                    // },
                                    {
                                        name: 'Dr. Michael Chen',
                                        role: 'Dentist',
                                        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                                        quote: 'As a dentist, I love how Dent AI helps my patients understand their dental health better before consultations.'
                                    }
                                ].map((testimonial, index) => (
                                    <div key={index} className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                            <div>
                                                <h4 className="font-bold text-emerald-900">{testimonial.name}</h4>
                                                <p className="text-sm text-emerald-600">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-emerald-700 italic">"{testimonial.quote}"</p>
                                        <div className="flex mt-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className="text-amber-400">★</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    {/* <section className="py-16 bg-gradient-dent">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-emerald-100">X-Rays Analyzed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-emerald-100">Accuracy Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-emerald-100">Happy Patients</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-emerald-100">Support</div>
                        </div>
                    </div>
                </div>
            </section> */}

                    {/* Contact Section */}
                    <section id="contact" className="py-20 px-6">
                        <div className="container mx-auto max-w-7xl">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h2 className="text-4xl font-bold text-emerald-900 mb-4">Get in Touch</h2>
                                    <p className="text-xl text-emerald-600 mb-8">
                                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                    </p>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <EnvelopeIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-emerald-600">Email</p>
                                                <p className="font-medium text-emerald-900">contact@dentai.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <PhoneIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-emerald-600">Phone</p>
                                                <p className="font-medium text-emerald-900">+92 3282020966</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <MapPinIcon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-emerald-600">Office</p>
                                                <p className="font-medium text-emerald-900">Gulshan-e-Iqbal Block 11, Karachi Sindh</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <img
                                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                            alt="Contact"
                                            className="rounded-2xl shadow-lg"
                                        />
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-lg">
                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">Message</label>
                                            <textarea
                                                rows="5"
                                                className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="Tell us more about your inquiry..."
                                            ></textarea>
                                        </div>
                                        <button className="w-full py-4 bg-gradient-dent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all">
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                </div>
                <Footer />

            </main>
        </>
    );
};

export default LandingPage;