import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Reveal } from '../Reveal/Reveal';

const contactInfo = [
    { icon: EnvelopeIcon, label: 'Email', val: 'contact@dentai.com' },
    { icon: PhoneIcon, label: 'Phone', val: '+92 328 2020966' },
    { icon: MapPinIcon, label: 'Office', val: 'Gulshan-e-Iqbal Block 11, Karachi' },
];

const inputClass = "w-full px-4 py-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all";
const errorInputClass = "border-red-300 focus:ring-red-400";

const EMAILJS_SERVICE_ID = 'service_7wwccoe';
const EMAILJS_TEMPLATE_ID = 'template_a34exrg';
const EMAILJS_PUBLIC_KEY = 'RNl9n451hcq0JeKtL';
const RECEIVER_EMAIL = 'ansarihamad084@gmail.com';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactSection = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = 'Required';
        if (!form.lastName.trim()) newErrors.lastName = 'Required';
        if (!form.email.trim()) {
            newErrors.email = 'Required';
        } else if (!EMAIL_REGEX.test(form.email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!form.subject.trim()) newErrors.subject = 'Required';
        if (!form.message.trim()) newErrors.message = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setSending(true);
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: RECEIVER_EMAIL,
                    from_name: `${form.firstName} ${form.lastName}`,
                    from_email: form.email,
                    subject: form.subject,
                    message: form.message,
                },
                EMAILJS_PUBLIC_KEY
            );

            toast.success("Message sent! We'll get back to you soon.");
            setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('Email send error:', err);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" className="py-28 px-6 lg:px-18 bg-emerald-50/40">
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
                    <Reveal>
                        <div className="space-y-6">
                            {contactInfo.map((c, i) => (
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

                    <Reveal delay={150}>
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-lg space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Ali"
                                        value={form.firstName}
                                        onChange={handleChange('firstName')}
                                        className={`${inputClass} ${errors.firstName ? errorInputClass : ''}`}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Khan"
                                        value={form.lastName}
                                        onChange={handleChange('lastName')}
                                        className={`${inputClass} ${errors.lastName ? errorInputClass : ''}`}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    placeholder="ali@example.com"
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Subject</label>
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    value={form.subject}
                                    onChange={handleChange('subject')}
                                    className={`${inputClass} ${errors.subject ? errorInputClass : ''}`}
                                />
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="Tell us more..."
                                    value={form.message}
                                    onChange={handleChange('message')}
                                    className={`${inputClass} resize-none ${errors.message ? errorInputClass : ''}`}
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full cursor-pointer py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:-translate-y-0 flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                                {sending && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};