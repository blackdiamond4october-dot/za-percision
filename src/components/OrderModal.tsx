import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Package, ClipboardList } from 'lucide-react';
import { Product, Order } from '../types';
import confetti from 'canvas-confetti';
import { COMPANY_WHATSAPP } from '../constants';

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  contactInfo: { whatsapp: string; email: string };
  onSubmit: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
}

export default function OrderModal({ product, isOpen, onClose, contactInfo, onSubmit }: OrderModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    location: '',
    quantity: 1,
    notes: ''
  });

  const nextImg = () => setCurrentImageIdx(p => (p + 1) % (product?.images.length || 1));
  const prevImg = () => setCurrentImageIdx(p => (p - 1 + (product?.images.length || 1)) % (product?.images.length || 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const productUrl = `${window.location.origin}/#product/${product.id}`;
    const message = `*ZA PRECISION - NEW INQUIRY*
--------------------------
*Product:* ${product.name}
*Material:* ${product.material}
*Quantity:* ${formData.quantity}
*Customer:* ${formData.customerName}
*Phone:* ${formData.phone}
*Location:* ${formData.location}
--------------------------
*Link:* ${productUrl}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = contactInfo?.whatsapp || COMPANY_WHATSAPP || '';
    const cleanNumbers = whatsappNumber.replace(/\D/g, '');
    if (cleanNumbers) {
      window.open(`https://wa.me/${cleanNumbers}?text=${encodedMessage}`, '_blank');
    } else {
      console.error("No valid WhatsApp number found");
      alert("Direct contact is currently unavailable. Please try again later.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productId: product?.id || '',
      productName: product?.name || '',
      ...formData
    });
    
    handleWhatsAppOrder();
    
    setIsSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef7d00', '#ffffff', '#f28c28']
    });
    
    setTimeout(() => {
      onClose();
      setTimeout(() => setIsSubmitted(false), 500);
    }, 4000);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-industrial-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-20 w-10 h-10 glass rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
               <>
                {/* Product Gallery Section */}
                <div className="w-full md:w-1/2 bg-black/40 relative aspect-video md:aspect-auto group/gallery">
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={currentImageIdx}
                            src={product.images?.[currentImageIdx] || ''}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    
                    {(product.images?.length || 0) > 1 && (
                        <>
                            <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity"><ChevronLeft className="w-5 h-5"/></button>
                            <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5"/></button>
                        </>
                    )}

                    <div className="absolute top-8 left-8 flex gap-3">
                        {product.images?.map((_, i) => (
                            <motion.div 
                                key={i} 
                                animate={{ scale: i === currentImageIdx ? 1.2 : 1, opacity: i === currentImageIdx ? 1 : 0.4 }}
                                className={`w-8 h-1 rounded-full ${i === currentImageIdx ? 'bg-industrial-orange' : 'bg-white'}`}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl border-white/5">
                        <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tighter mb-2">{product.name}</h3>
                        <p className="text-[10px] text-industrial-silver/60 uppercase tracking-[0.2em]">{product.material} // {product.category}</p>
                    </div>
                </div>

                {/* Secure Order Form Section */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar scanlines">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <ClipboardList className="w-4 h-4 text-industrial-orange" />
                            <span className="text-[10px] font-display uppercase tracking-[0.4em] text-industrial-orange/60">Order Protocol</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-white mb-2 italic uppercase tracking-tighter">Initialize Order</h2>
                        <p className="text-industrial-silver/40 text-xs">A direct link to this component will be sent to our service team.</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Full Name</label>
                            <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">WhatsApp Contact</label>
                            <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Quantity</label>
                            <input 
                                required 
                                type="text" 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                name="quantity" 
                                value={formData.quantity} 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, quantity: val ? parseInt(val) : 0 }));
                                }} 
                                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white" 
                                placeholder="Units"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Location</label>
                            <input 
                                required 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white" 
                                placeholder="Shipping Address / Factory"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Technical Requirements</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white resize-none" />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="w-full py-5 bg-industrial-orange text-black font-display font-black uppercase tracking-[0.2em] text-xs hover:neon-glow transition-all flex items-center justify-center gap-3">
                                <Send className="w-4 h-4" />
                                Finalize Request via WhatsApp
                            </button>
                        </div>
                    </form>
                </div>
               </>
            ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-industrial-orange/20 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10 text-industrial-orange" />
                    </motion.div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Order Placed!</h2>
                    <p className="text-industrial-silver/70 max-w-sm">
                        Thank you for your request. Our technical team will contact you within 24 hours to finalize the details.
                    </p>
                    <div className="mt-8">
                        <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 3, ease: 'linear' }}
                                className="h-full w-full bg-industrial-orange"
                            />
                        </div>
                    </div>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
