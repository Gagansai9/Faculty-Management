import React from 'react';
import { motion } from 'framer-motion';

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string; // e.g., 'neon-blue', 'neon-purple'
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, subtitle, icon, color = 'neon-blue', children, className, onClick }) => {
    const colorMap: Record<string, string> = {
        'neon-blue': '#00f3ff',
        'neon-purple': '#bc13fe',
        'green-400': '#4ade80',
        'yellow-400': '#facc15'
    };

    const hexColor = colorMap[color] || color;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
            className={`glass-panel p-6 rounded-2xl relative overflow-hidden group w-full ${className || ''}`}
        >
            {/* Background Glow */}
            <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-500"
                style={{ backgroundColor: hexColor }}
            />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                        {value}
                        {subtitle && <span className="text-xs font-normal" style={{ color: hexColor }}>{subtitle}</span>}
                    </div>
                </div>
                <div
                    className="p-3 rounded-xl border shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                    style={{
                        backgroundColor: `${hexColor}1A`, // 10% opacity
                        borderColor: `${hexColor}33`, // 20% opacity
                        color: hexColor
                    }}
                >
                    {icon}
                </div>
            </div>

            {/* Optional Chart/Visual Area */}
            {children && (
                <div className="mt-4 relative z-10">
                    {children}
                </div>
            )}
        </motion.div>
    );
};

export default AnalyticsCard;
