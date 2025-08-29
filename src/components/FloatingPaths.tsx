"use client";

import { motion } from "framer-motion";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(59,130,246,${0.08 + i * 0.02})`, // Blue tones for better visibility
        width: 0.3 + i * 0.02,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
                className="w-full h-full text-blue-500/20"
                viewBox="0 0 696 316"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.05 + path.id * 0.01}
                        initial={{ pathLength: 0.3, opacity: 0.3 }}
                        animate={{
                            pathLength: [0.3, 1, 0.3],
                            opacity: [0.2, 0.4, 0.2],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 25 + Math.random() * 15,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
            <FloatingPaths position={0.5} />
        </div>
    );
}
