import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-bold text-white tracking-tighter mb-2">
                            UNI<span className="text-neon-blue">NEXUS</span>
                        </h4>
                        <p className="text-gray-500 text-sm">
                            &copy; 2026 Advanced Campus Systems. All rights reserved.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="text-gray-400 hover:text-neon-blue transition-colors transform hover:scale-110"
                            >
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-gray-600 flex items-center justify-center gap-1 font-mono">
                    ENGINEERED WITH <Heart size={10} className="text-red-500 fill-red-500" /> BY SYSTEM ARCHITECTS
                </div>
            </div>
        </footer>
    );
};

export default Footer;
