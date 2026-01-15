import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BackgroundScene from '../components/3d/BackgroundScene';
import HeroSection from '../components/ui/HeroSection';
import FeaturesSection from '../components/ui/FeaturesSection';
import Footer from '../components/ui/Footer';

const Home = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-white">
            <div className="fixed inset-0 z-0">
                <BackgroundScene />
                <motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"
                />
            </div>

            <main className="relative z-10 pt-20">
                <HeroSection />
                <div id="features">
                    <FeaturesSection />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
