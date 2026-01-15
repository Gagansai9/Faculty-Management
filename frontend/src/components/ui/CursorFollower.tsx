import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorFollower = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    // Smooth spring animation for the cursor
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);

            // Check if hovering over clickable elements
            const target = e.target as HTMLElement;
            setIsHovering(
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') !== null ||
                target.closest('a') !== null ||
                target.tagName === 'INPUT' ||
                target.tagName === 'SELECT'
            );
        };

        window.addEventListener("mousemove", mouseMove);
        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-blue pointer-events-none z-[9999] mix-blend-difference hidden md:block"
            style={{
                x: cursorX,
                y: cursorY,
            }}
            animate={{
                scale: isHovering ? 1.5 : 1,
                backgroundColor: isHovering ? "rgba(0, 243, 255, 0.2)" : "transparent"
            }}
            transition={{
                scale: { duration: 0.2 },
                backgroundColor: { duration: 0.2 }
            }}
        >
            <div className="absolute inset-0 rounded-full bg-neon-blue blur-md opacity-20"></div>
        </motion.div>
    );
};
export default CursorFollower;
