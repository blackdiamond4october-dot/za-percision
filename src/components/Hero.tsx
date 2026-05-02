import { motion } from 'motion/react';
import ThreeLogo from './ThreeGear';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ThreeLogo />
      </div>

      {/* Spacing for mobile to see the gear */}
      <div className="h-20 lg:hidden" />

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex flex-col items-center"
        >
          <span className="text-industrial-orange font-display tracking-[0.8em] text-[10px] uppercase bg-black/60 px-6 py-2 rounded-full border border-industrial-orange/20 shimmer-effect">
            SINCE 1998
          </span>
        </motion.div>

          <span className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.8] mb-8 will-change-transform">
            ZA <span className="text-industrial-orange neon-text inline-block relative">
              PRECISION
              <motion.span 
                  className="absolute inset-0 text-red-500/5 -z-10 translate-x-[1px] blur-[2px]"
                  animate={{ x: [1, -1, 1], opacity: [0.05, 0.2, 0.05] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
              >PRECISION</motion.span>
              <motion.span 
                  className="absolute inset-0 text-cyan-500/5 -z-10 -translate-x-[1px] blur-[2px]"
                  animate={{ x: [-1, 1, -1], opacity: [0.05, 0.2, 0.05] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
              >PRECISION</motion.span>
            </span>
          </span>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-industrial-silver/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto"
        >
          Manufacturing custom, high-performance spare parts for industrial machinery. 
          Built to survive the most demanding production lines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 125, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-industrial-orange text-black font-display font-bold uppercase tracking-wider overflow-hidden transition-all hover:pr-12"
          >
            <span className="relative z-10">Explore Catalog</span>
            <span className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-0 group-hover:right-4 group-hover:opacity-100 transition-all font-bold">
                →
            </span>
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 125, 0, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-industrial-orange/30 text-industrial-orange font-display font-medium uppercase tracking-wider hover:bg-industrial-orange/10 transition-all"
          >
            Request Custom Part
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[9px] font-display uppercase tracking-[0.4em] text-industrial-silver/60">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-4 h-4 text-industrial-orange" />
        </motion.div>
      </motion.div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-industrial-black via-transparent to-industrial-black opacity-60" />
    </section>
  );
}
