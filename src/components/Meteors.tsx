"use client";
import { motion } from "framer-motion";
 
export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 25).fill(true);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full"
      >
        {meteors.map((_, idx) => {
          const meteorCount = number || 25;
          // Better distribution across the full viewport
          const position = (idx * (100 / meteorCount)) + Math.random() * 10;
          const delay = Math.random() * 8;
          const duration = 3 + Math.random() * 4;
          
          return (
            <motion.span
              key={"meteor" + idx}
              className={`absolute h-0.5 w-0.5 rotate-[45deg] rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(59,130,246,0.3)]
                before:absolute before:top-1/2 before:h-[1px] before:w-[80px] before:-translate-y-[50%] before:transform 
                before:bg-gradient-to-r before:from-blue-400 before:via-blue-300 before:to-transparent before:content-[''] ${className || ""}`}
              style={{
                top: "-10px",
                left: position + "%",
                animationDelay: delay + "s",
                animationDuration: duration + "s",
              }}
              initial={{ 
                x: -100, 
                y: -100,
                opacity: 0
              }}
              animate={{ 
                x: window?.innerWidth || 1200, 
                y: window?.innerHeight || 800,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: duration,
                delay: delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                repeatDelay: Math.random() * 3
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};
