import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 max-w-7xl mx-auto text-center md:text-left md:items-start md:ml-[5%]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                {/* Decorative Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/5 mb-8 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                    </span>
                    <span className="text-neon-blue font-mono text-xs tracking-widest">SYSTEM V4.0 // ONLINE</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-6xl md:text-[6rem] lg:text-[7.5rem] font-bold leading-tight tracking-tighter mb-6 relative">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                        FACULTY
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500 filter drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                        MANAGEMENT
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed">
                    A next-generation academic neural network. Secure, efficient, and built for the future of education administration.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <motion.button
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-4 bg-neon-blue text-black font-bold text-lg rounded-none clip-path-polygon hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] flex items-center gap-3"
                    >
                        <Cpu size={20} />
                        <span>ENTER PORTAL</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 border border-white/20 text-white font-bold text-lg rounded-none hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-sm"
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <Globe size={20} className="text-purple-400" />
                        <span>EXPLORE NETWORK</span>
                    </motion.button>
                </div>

                {/* Stats / Tech Specs */}
                <div className="mt-16 flex items-center gap-12 border-t border-white/10 pt-8 text-left">
                    <div>
                        <div className="text-3xl font-bold text-white">99.9%</div>
                        <div className="text-xs text-gray-500 font-mono tracking-widest mt-1">UPTIME</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">256<span className="text-neon-blue">b</span></div>
                        <div className="text-xs text-gray-500 font-mono tracking-widest mt-1">ENCRYPTION</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">v4.0</div>
                        <div className="text-xs text-gray-500 font-mono tracking-widest mt-1">VERSION</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
