import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-6 mesh-gradient">
      <div className="noise-overlay absolute inset-0" />
      
      {/* Dynamic Background Blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] -z-10"
      />
      
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full glass-morphism mb-8 border-gold/20"
        >
          <div className="w-2 h-2 rounded-full gold-bg animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold gold-accent">Archive Level: Elite</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-[160px] font-display font-bold tracking-tighter uppercase mb-6 leading-[0.8] mix-blend-difference"
        >
          Smart <br />
          <span className="gold-accent italic">Dispense</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base md:text-xl md:max-w-2xl text-white/70 uppercase tracking-[0.2em] font-medium mb-16 leading-relaxed"
        >
          Your elite gateway to the internet's most exclusive, hand-picked premium deals.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold mb-1 gold-accent">1,204</span>
            <span className="text-[7px] uppercase tracking-[0.3em] font-bold opacity-30">Active Nodes</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold mb-1 gold-accent">$2.4M</span>
            <span className="text-[7px] uppercase tracking-[0.3em] font-bold opacity-30">Volume Index</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold mb-1 gold-accent">99.9%</span>
            <span className="text-[7px] uppercase tracking-[0.3em] font-bold opacity-30">Reliability</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 flex flex-col items-center gap-2 opacity-20"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] font-bold">Protocol Active</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
