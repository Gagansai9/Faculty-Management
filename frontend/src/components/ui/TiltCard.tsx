import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const rX = (mouseY / height - 0.5) * -20; // -10 to 10 deg
        const rY = (mouseX / width - 0.5) * 20;   // -10 to 10 deg
        setRotateX(rX);
        setRotateY(rY);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            className={`transition-transform duration-100 ease-out will-change-transform ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {children}
        </motion.div>
    );
};

export default TiltCard;
