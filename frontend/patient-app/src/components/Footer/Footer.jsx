import React from 'react'
import {
    SparklesIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
    return (
        <footer className="bg-emerald-900 text-white py-16 px-[40px]">
            <div className="container mx-auto max-w-[1440px]">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-dent rounded-xl flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Dent AI</h3>
                        </div>
                        <p className="text-emerald-300 mb-4">
                            Revolutionizing dental care through artificial intelligence and expert connectivity.
                        </p>
                        {/* <div className="flex gap-4">
                            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                                <div key={social} className="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer">
                                    <span className="text-sm">{social[0].toUpperCase()}</span>
                                </div>
                            ))}
                        </div> */}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Home', 'About', 'How It Works', 'Why Us', 'Contact'].map((link) => (
                                <li key={link}>
                                    <button className="text-emerald-300 hover:text-white transition-colors">
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6">For Patients</h4>
                        <ul className="space-y-3">
                            {['Upload X-Ray', 'View Reports', 'Book Consultation', 'Find Dentist', 'FAQs'].map((link) => (
                                <li key={link}>
                                    <button className="text-emerald-300 hover:text-white transition-colors">
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6">For Dentists</h4>
                        <ul className="space-y-3">
                            {['Join as Dentist', 'Partner Program', 'Resources', 'Support', 'Terms'].map((link) => (
                                <li key={link}>
                                    <button className="text-emerald-300 hover:text-white transition-colors">
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-emerald-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-emerald-300 text-sm">
                        © 2024 Dent AI. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <button className="text-emerald-300 hover:text-white text-sm">Privacy Policy</button>
                        <button className="text-emerald-300 hover:text-white text-sm">Terms of Service</button>
                        <button className="text-emerald-300 hover:text-white text-sm">Cookie Policy</button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
