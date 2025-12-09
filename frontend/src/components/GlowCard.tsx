import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const GlowCard = ({ children, delay = 0, className = "" }: GlowCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 1 }}
    transition={{ duration: 0.7, ease: "easeOut", delay }}
    className={`group relative rounded-2xl bg-gray-800/40 backdrop-blur-xl p-8 overflow-hidden cursor-pointer h-fit border border-white/10 shadow-2xl ${className}`}
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
    }}>
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background: 'radial-gradient(500px at var(--x, 50%) var(--y, 50%), rgba(0, 145, 255, 0.3), transparent 80%)',
      }} 
    />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);
