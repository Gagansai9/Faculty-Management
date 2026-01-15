import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface TaskProgressSliderProps {
    progress: number;
    onChange?: (newProgress: number) => void;
    readOnly?: boolean;
}

const TaskProgressSlider: React.FC<TaskProgressSliderProps> = ({ progress, onChange, readOnly = false }) => {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // We can clean up unused vars if we rely on the input range
    // const [isDragging, setIsDragging] = useState(false);
    // const x = useMotionValue(0);
    // const width = useTransform(x, (latest) => `${latest}%`);

    // Just using the input logic below is cleaner and robust

    return (
        <div className="w-full mt-4 relative group">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono tracking-wider">
                <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.6)]'}`}></span>
                    PROGRESS_STATUS
                </span>
                <span className={`font-bold text-lg ${progress === 100 ? 'text-green-400' : 'text-neon-blue'}`}>{progress}%</span>
            </div>

            <div className="relative h-6 flex items-center" ref={progressBarRef}>
                {/* Background Track */}
                <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    {/* Grid pattern overlay on track */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] w-full h-full" />
                </div>

                {/* Filled Track (Animated) */}
                <motion.div
                    className={`absolute h-1.5 rounded-full ${readOnly ? 'bg-slate-600' : 'bg-gradient-to-r from-neon-blue via-cyan-400 to-neon-purple'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Glowing effect on the bar */}
                    {!readOnly && <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[4px] rounded-full" />}
                </motion.div>

                {/* Interactive hidden input for robust logic */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => !readOnly && onChange && onChange(parseInt(e.target.value))}
                    disabled={readOnly}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Custom Thumb (Visual only, follows progress) */}
                {!readOnly && (
                    <motion.div
                        className="absolute h-6 w-6 bg-black border-2 border-neon-blue rounded-full shadow-[0_0_15px_rgba(0,243,255,0.5)] flex items-center justify-center pointer-events-none z-20"
                        initial={{ left: 0 }}
                        animate={{ left: `calc(${progress}% - 12px)` }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }} // Extremely smooth follow
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>

                        {/* Tooltip on Hover/Interact */}
                        <div className="absolute -top-8 bg-black/80 border border-neon-blue/30 text-neon-blue text-[10px] px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {progress}%
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Markers */}
            {!readOnly && (
                <div className="flex justify-between px-1 mt-1">
                    {[0, 25, 50, 75, 100].map(mark => (
                        <div
                            key={mark}
                            className={`w-0.5 h-1.5 rounded transition-colors ${progress >= mark ? 'bg-neon-blue/50' : 'bg-gray-700'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskProgressSlider;
