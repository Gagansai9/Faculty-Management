import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';
import { Shield, Zap, Users, Globe, Lock, Activity } from 'lucide-react';

const features = [
    {
        icon: <Zap size={32} />,
        title: "Real-Time Sync",
        description: "Instant data propagation across all connected clients via optimized WebSocket streams.",
        color: "text-yellow-400"
    },
    {
        icon: <Shield size={32} />,
        title: "Military-Grade Security",
        description: "256-bit encryption for all sensitive faculty and student data records.",
        color: "text-neon-blue"
    },
    {
        icon: <Activity size={32} />,
        title: "Live Analytics",
        description: "Dynamic visualization of system load, task velocity, and pending authorizations.",
        color: "text-green-400"
    },
    {
        icon: <Users size={32} />,
        title: "Role-Based Access",
        description: "Strict hierarchical constraints ensuring data integrity between Admin and Faculty data.",
        color: "text-purple-400"
    },
    {
        icon: <Lock size={32} />,
        title: "Auto-Audit Logging",
        description: "Immutable logs for every action taken within the command center.",
        color: "text-red-400"
    },
    {
        icon: <Globe size={32} />,
        title: "Global Reach",
        description: "Optimized CDNs ensure low-latency access from any campus location worldwide.",
        color: "text-white"
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-[89px] relative z-10">
            <div className="container mx-auto px-[21px]">
                <motion.div
                    initial={{ opacity: 0, y: 21 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.89 }}
                    className="text-center mb-[55px]"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-[21px] tracking-tight">
                        SYSTEM CAPABILITIES
                    </h2>
                    <p className="text-neon-blue font-mono tracking-widest text-sm">
                        NEXT-GEN CAMPUS ARCHITECTURE
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[34px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 34 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: index * 0.13 }}
                        >
                            <TiltCard className="glass-panel p-[34px] h-full flex flex-col items-start border border-white/5 hover:border-neon-blue/30 group">
                                <div className={`mb-[21px] p-[21px] rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-[13px] group-hover:text-neon-blue transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
