import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Package, ClipboardList, ChevronDown, Search } from 'lucide-react';
import { Product, Order } from '../types';
import confetti from 'canvas-confetti';

const COUNTRY_CODES = [
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+40', country: 'Romania', flag: '🇷🇴' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
  { code: '+964', country: 'Iraq', flag: '🇮🇶' },
  { code: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
];

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
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Default Pakistan
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    location: '',
    quantity: 1,
    notes: ''
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRY_CODES.filter(c =>
    c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch)
  );

  const nextImg = () => setCurrentImageIdx(p => (p + 1) % (product?.images.length || 1));
  const prevImg = () => setCurrentImageIdx(p => (p - 1 + (product?.images.length || 1)) % (product?.images.length || 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFullPhone = () => `${selectedCountry.code}${formData.phone}`;

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const fullPhone = getFullPhone();
    const message = `*🔧 ZA PRECISION — NEW ORDER*
━━━━━━━━━━━━━━━━━━━━━━

*📦 PRODUCT DETAILS*
• Name: ${product.name}
• Category: ${product.category}
• Material: ${product.material}
• Dimensions: ${product.dimensions || 'N/A'}

*👤 CUSTOMER DETAILS*
• Name: ${formData.customerName}
• Phone: ${fullPhone}
• Location: ${formData.location}

*📋 ORDER INFO*
• Quantity: ${formData.quantity}
• Notes: ${formData.notes || 'None'}

━━━━━━━━━━━━━━━━━━━━━━
_Sent from ZA Precision Website_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = (contactInfo?.whatsapp || '').replace(/\D/g, '');
    if (whatsappNumber) {
      const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Direct contact is currently unavailable. Please try again later.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = getFullPhone();
    onSubmit({
      productId: product?.id || '',
      productName: product?.name || '',
      ...formData,
      phone: fullPhone,
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
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ customerName: '', phone: '', email: '', location: '', quantity: 1, notes: '' });
        setSelectedCountry(COUNTRY_CODES[0]);
      }, 500);
    }, 4000);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
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
            className="relative w-full max-w-5xl bg-industrial-black border border-white/5 rounded-2xl sm:rounded-3xl overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85dvh] sm:max-h-[95vh] md:max-h-[90vh]"
          >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-8 h-8 sm:w-10 sm:h-10 glass rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {!isSubmitted ? (
               <>
                {/* Product Gallery Section */}
                <div className="w-full md:w-1/2 bg-black/40 relative aspect-[16/10] md:aspect-auto group/gallery flex-shrink-0">
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
                            <button onClick={prevImg} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 glass rounded-full flex items-center justify-center opacity-70 md:opacity-0 group-hover/gallery:opacity-100 transition-opacity"><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                            <button onClick={nextImg} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 glass rounded-full flex items-center justify-center opacity-70 md:opacity-0 group-hover/gallery:opacity-100 transition-opacity"><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                        </>
                    )}

                    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 flex gap-2 sm:gap-3">
                        {product.images?.map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: i === currentImageIdx ? 1.2 : 1, opacity: i === currentImageIdx ? 1 : 0.4 }}
                                className={`w-6 sm:w-8 h-1 rounded-full ${i === currentImageIdx ? 'bg-industrial-orange' : 'bg-white'}`}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 p-4 sm:p-6 glass rounded-xl sm:rounded-2xl border-white/5">
                        <h3 className="text-base sm:text-xl font-display font-black text-white italic uppercase tracking-tighter mb-1 sm:mb-2">{product.name}</h3>
                        <p className="text-[9px] sm:text-[10px] text-industrial-silver/60 uppercase tracking-[0.2em]">{product.material} // {product.category}</p>
                    </div>
                </div>

                {/* Secure Order Form Section */}
                <div className="flex-1 p-4 sm:p-8 md:p-12 md:overflow-y-auto">
                    <div className="mb-6 sm:mb-10">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <ClipboardList className="w-4 h-4 text-industrial-orange" />
                            <span className="text-[9px] sm:text-[10px] font-display uppercase tracking-[0.4em] text-industrial-orange/60">Order Protocol</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-1 sm:mb-2 italic uppercase tracking-tighter">Initialize Order</h2>
                        <p className="text-industrial-silver/40 text-[10px] sm:text-xs">Order details will be sent to our team via WhatsApp.</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Full Name</label>
                            <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white text-sm" />
                        </div>

                        {/* Phone with Country Code */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Phone Number</label>
                            <div className="flex gap-2">
                                {/* Country Code Selector */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowCountryDropdown(!showCountryDropdown); setCountrySearch(''); }}
                                        className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg text-white text-sm hover:border-industrial-orange/50 transition-colors min-w-[90px] sm:min-w-[100px]"
                                    >
                                        <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
                                        <span className="text-xs sm:text-sm font-mono">{selectedCountry.code}</span>
                                        <ChevronDown className="w-3 h-3 text-industrial-silver/40 ml-auto" />
                                    </button>

                                    <AnimatePresence>
                                        {showCountryDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute top-full left-0 mt-1 w-64 sm:w-72 bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            >
                                                {/* Search input */}
                                                <div className="p-2 border-b border-white/5">
                                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                                        <Search className="w-3.5 h-3.5 text-industrial-silver/40" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search country..."
                                                            value={countrySearch}
                                                            onChange={(e) => setCountrySearch(e.target.value)}
                                                            className="bg-transparent text-white text-xs outline-none w-full placeholder:text-industrial-silver/30"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                {/* Country list */}
                                                <div className="max-h-52 sm:max-h-64 overflow-y-auto">
                                                    {filteredCountries.map((c) => (
                                                        <button
                                                            key={c.code + c.country}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCountry(c);
                                                                setShowCountryDropdown(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-industrial-orange/10 transition-colors ${
                                                                selectedCountry.code === c.code ? 'bg-industrial-orange/5 text-industrial-orange' : 'text-white'
                                                            }`}
                                                        >
                                                            <span className="text-lg">{c.flag}</span>
                                                            <span className="text-xs flex-1 truncate">{c.country}</span>
                                                            <span className="text-[10px] font-mono text-industrial-silver/50">{c.code}</span>
                                                        </button>
                                                    ))}
                                                    {filteredCountries.length === 0 && (
                                                        <p className="text-center text-industrial-silver/30 text-xs py-4">No country found</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Phone number input */}
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^\d]/g, '');
                                        setFormData(prev => ({ ...prev, phone: val }));
                                    }}
                                    placeholder="Enter phone number"
                                    className="flex-1 bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white text-sm min-w-0"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Quantity</label>
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
                                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white text-sm"
                                placeholder="Units"
                            />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Location</label>
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white text-sm"
                                placeholder="Shipping Address / Factory"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-industrial-silver/50 font-display">Technical Requirements</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:border-industrial-orange transition-colors text-white resize-none text-sm" />
                        </div>
                        <div className="md:col-span-2 pt-2 sm:pt-4">
                            <button type="submit" className="w-full py-4 sm:py-5 bg-industrial-orange text-black font-display font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:neon-glow transition-all flex items-center justify-center gap-2 sm:gap-3 rounded-lg">
                                <Send className="w-4 h-4" />
                                Send Order via WhatsApp
                            </button>
                        </div>
                    </form>
                </div>
               </>
            ) : (
                <div className="w-full py-12 flex flex-col items-center justify-center text-center px-6">
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
