import React, { useEffect } from 'react';

import { Navbar } from '../../components/Navbar/Navbar';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { StatsSection } from '../../components/StatsSection/StatsSection';
import { AboutSection } from '../../components/AboutSection/AboutSection';
import { HowItWorks } from '../../components/HowItWorks/HowItWorks';
import { FeatureSection } from '../../components/FeatureSection/FeatureSection';
import { TestimonialsSection } from '../../components/TestimonialsSection/TestimonialsSection';
import { CTASection } from '../../components/CTASection/CTASection';
import { ContactSection } from '../../components/ContactSection/ContactSection';
import { Footer } from '../../components/Footer/Footer';
import { PageAnimations } from '../../components/PageAnimations/PageAnimations';

const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};


const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="bg-white text-emerald-950 overflow-x-hidden">
            <Navbar />
            <HeroSection scrollTo={scrollTo} />
            <StatsSection />
            <AboutSection />
            <HowItWorks />
            <FeatureSection />
            <TestimonialsSection />
            <CTASection />
            <ContactSection />
            <Footer />
            <PageAnimations />
        </div>
    );
};

export default LandingPage;