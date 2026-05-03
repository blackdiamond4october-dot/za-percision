import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Star, Truck, Shield, Clock } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
  index: number;
}

export default function ProductCard({ product, onOrder, index }: ProductCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col h-full glass rounded-xl overflow-hidden perspective-1000"
    >
      {/* Product Image */}
      <div className="relative h-36 sm:h-48 md:h-64 overflow-hidden">
        <motion.img
          src={product.images?.[0] || ''}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-black/80 to-transparent" />
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-industrial-orange/20 backdrop-blur-md border border-industrial-orange/30 text-industrial-orange text-[8px] sm:text-[10px] font-display uppercase tracking-widest rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col" style={{ transform: "translateZ(50px)" }}>
        <h3 className="text-sm sm:text-base md:text-xl font-display font-bold text-white mb-1 sm:mb-2 group-hover:text-industrial-orange transition-colors uppercase italic tracking-tighter line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-industrial-silver/70 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-6 hidden sm:block">
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-industrial-silver/50 uppercase tracking-wider">
            <Shield className="w-3 h-3 text-industrial-orange flex-shrink-0" />
            <span className="truncate">Material: {product.material}</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-industrial-silver/50 uppercase tracking-wider">
            <Truck className="w-3 h-3 text-industrial-orange flex-shrink-0" />
            <span className="truncate">{product.compatibility}</span>
          </div>
        </div>

        <div className="mt-auto pt-3 sm:pt-6 border-t border-white/5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col flex-shrink-0">
            <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-industrial-silver/40 mb-0.5 sm:mb-1">Inquiry</span>
            <span className="text-[9px] sm:text-xs font-display text-industrial-orange font-bold uppercase italic leading-tight">Custom<br />Quote</span>
          </div>
          <button
            onClick={() => onOrder(product)}
            className="flex-1 px-2 sm:px-3 xl:px-4 py-2 sm:py-3 bg-industrial-orange text-black font-display text-[8px] sm:text-[9px] xl:text-[10px] font-black uppercase tracking-[0.05em] sm:tracking-[0.1em] hover:bg-white transition-all shadow-[0_0_15px_rgba(239,125,0,0.2)] text-center whitespace-nowrap min-w-0"
          >
            <span className="hidden sm:inline">Details & Order</span>
            <span className="sm:hidden">Order</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
