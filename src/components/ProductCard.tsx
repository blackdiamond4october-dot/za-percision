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
      transition={{ delay: index * 0.1, duration: 0.6 }}
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
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={product.images?.[0] || ''}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-black/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-industrial-orange/20 backdrop-blur-md border border-industrial-orange/30 text-industrial-orange text-[10px] font-display uppercase tracking-widest rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col" style={{ transform: "translateZ(50px)" }}>
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-industrial-orange transition-colors uppercase italic tracking-tighter">
          {product.name}
        </h3>
        
        <p className="text-industrial-silver/70 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[10px] text-industrial-silver/50 uppercase tracking-wider">
            <Shield className="w-3 h-3 text-industrial-orange" />
            <span>Material: {product.material}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-industrial-silver/50 uppercase tracking-wider">
            <Truck className="w-3 h-3 text-industrial-orange" />
            <span>Compatibility: {product.compatibility}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.3em] text-industrial-silver/40">Inquiry Only</span>
            <span className="text-xs font-display text-industrial-orange font-bold uppercase italic">Custom Quote</span>
          </div>
          <button
            onClick={() => onOrder(product)}
            className="px-6 py-3 bg-industrial-orange text-black font-display text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_15px_rgba(239,125,0,0.2)]"
          >
            Details & Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}
