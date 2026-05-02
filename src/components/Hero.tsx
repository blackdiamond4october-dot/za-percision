import { motion } from 'motion/react';
import ThreeLogo from './ThreeGear';
import { ChevronDown, Search, X } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Hero({ searchQuery, onSearchChange }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-32 md:pb-16">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ThreeLogo />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-5xl w-full flex flex-col items-center">

        {/* Search Bar — Above Everything */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-lg mb-8"
        >
          <div className="flex items-center bg-black/50 backdrop-blur-md border border-white/10 rounded-full overflow-hidden focus-within:border-industrial-orange/50 transition-colors shadow-lg">
            <div className="pl-5 text-industrial-silver/40">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search spare parts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-white text-sm outline-none placeholder:text-industrial-silver/30"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="pr-5 text-industrial-silver/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* SINCE 1998 Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8 flex flex-col items-center"
        >
          <span className="text-industrial-orange font-display tracking-[0.5em] sm:tracking-[0.8em] text-[9px] sm:text-[10px] uppercase bg-black/60 px-4 sm:px-6 py-2 rounded-full border border-industrial-orange/20 shimmer-effect">
            SINCE 1998
          </span>
        </motion.div>

        {/* Title */}
        <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-6 sm:mb-8 will-change-transform">
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
          transition={{ duration: 1, delay: 1 }}
          className="text-industrial-silver/80 text-sm sm:text-lg md:text-xl font-light mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
        >
          Manufacturing custom, high-performance spare parts for industrial machinery. 
          Built to survive the most demanding production lines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 125, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-industrial-orange text-black font-display font-bold uppercase tracking-wider overflow-hidden transition-all hover:pr-12 text-sm"
          >
            <span className="relative z-10">Explore Parts</span>
            <span className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-0 group-hover:right-4 group-hover:opacity-100 transition-all font-bold">
                →
            </span>
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 125, 0, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-industrial-orange/30 text-industrial-orange font-display font-medium uppercase tracking-wider hover:bg-industrial-orange/10 transition-all text-sm"
          >
            Request Custom Part
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator — positioned well above mobile nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
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
