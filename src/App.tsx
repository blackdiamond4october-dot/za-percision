/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  Github, 
  Lock,
  Star,
  Factory
} from 'lucide-react';

import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';
import { Product, Order, Review } from './types';
import { INITIAL_PRODUCTS, ADMIN_CODE, COMPANY_NAME, COMPANY_WHATSAPP, COMPANY_EMAIL, TECHNICAL_SUPPORT_PHONE } from './constants';
import { cn } from './lib/utils';

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('industrial_products');
    const parsed = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    
    // Migration: image(string) -> images(string[])
    return parsed.map((p: any) => ({
      ...p,
      images: p.images || (p.image ? [p.image] : [])
    })) as Product[];
  });
  
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem('industrial_contact');
    const defaults = { 
        whatsapp: COMPANY_WHATSAPP || '', 
        email: COMPANY_EMAIL || '', 
        techSupport: TECHNICAL_SUPPORT_PHONE || '' 
    };
    try {
        const parsed = saved ? JSON.parse(saved) : null;
        return { ...defaults, ...parsed };
    } catch {
        return defaults;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('industrial_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [activePage, setActivePage] = useState<'home' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('industrial_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('industrial_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('industrial_contact', JSON.stringify(contactInfo));
  }, [contactInfo]);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'about' | 'contact'>('home');

  // --- HANDLERS ---
  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (activePage !== 'home') setActivePage('home');
  };
  const handlePlaceOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCodeInput === ADMIN_CODE) {
      setIsAdmin(true);
      setActivePage('admin');
      setShowAdminLogin(false);
      setAdminCodeInput('');
    } else {
      alert('Access Denied: Invalid Credentials');
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setActivePage('home');
  };

  // --- COMPONENTS ---
  if (isLoading) {
    return (
      <div className="h-screen bg-industrial-black flex flex-col items-center justify-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ 
             opacity: 1,
             scale: [1, 1.05, 1],
           }}
           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
           className="relative w-32 h-32 mb-12 flex items-center justify-center"
        >
            {/* Triangular Symbol Custom Loader */}
            <Logo className="w-48 h-48" glow />
            
            {/* HUD Data Circles for Video Effect */}
            <motion.div 
                className="absolute inset-0 border border-industrial-orange/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="absolute -inset-4 border border-industrial-orange/10 border-dashed rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>
        
        <div className="flex flex-col items-center gap-4">
            <motion.h2 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-industrial-orange font-display tracking-[0.8em] uppercase text-[10px] shimmer-effect px-4"
            >
              SYSTEM.ZA_PRECISION // INITIALIZING
            </motion.h2>
            <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                <motion.div 
                    className="absolute inset-0 bg-industrial-orange shadow-[0_0_15px_rgba(239,125,0,0.8)]"
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            <motion.p 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-[8px] font-mono text-industrial-silver/40 uppercase tracking-widest"
            >
                Protocol: Secure_Auth_v7.0.4
            </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-industrial-black min-h-screen text-white gradient-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 py-3 px-6 md:px-12 flex items-center justify-between backdrop-blur-md">
        <div 
          className="flex items-center gap-3 cursor-pointer group relative"
          onClick={() => { setActivePage('home'); setActiveTab('home'); }}
        >
          <Logo className="w-12 h-12 md:w-14 md:h-14 group-hover:scale-110 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-industrial-orange/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
          <div className="flex flex-col">
            <span className="font-display font-black text-lg md:text-xl tracking-tighter uppercase italic leading-none">
                ZA <span className="text-industrial-orange neon-text transition-all">PRECISION</span>
            </span>
            <span className="text-[7px] md:text-[8px] font-display uppercase tracking-[0.3em] text-white/30 text-right">Engineering</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Products', 'About', 'Contact'].map(item => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ scale: 1.1, color: '#ef7d00' }}
              className="text-[10px] font-display uppercase tracking-widest text-industrial-silver/60 transition-colors relative group"
            >
              {item}
              <motion.span 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="absolute -bottom-1 left-0 h-[1px] bg-industrial-orange transition-all"
              />
            </motion.a>
          ))}
          {activePage === 'home' ? (
            <motion.button 
                onClick={() => setShowAdminLogin(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 125, 0, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="text-[10px] font-display uppercase tracking-widest px-6 py-2 neon-border text-industrial-orange rounded-full hover:bg-industrial-orange hover:text-black transition-all"
            >
                ADMIN
            </motion.button>
          ) : (
            <motion.button 
                onClick={logoutAdmin}
                whileHover={{ scale: 1.1 }}
                className="text-[10px] font-display uppercase tracking-widest text-red-500"
            >
                Exit Portal
            </motion.button>
          )}
        </div>

        <button className="md:hidden text-white w-10 h-10 flex items-center justify-center glass rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu / Dashboard */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-y-0 left-0 w-[85%] z-[100] bg-industrial-black/98 backdrop-blur-md border-r border-industrial-orange/20 flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Logo className="w-12 h-12" glow />
                    <div className="flex flex-col">
                        <span className="font-display font-black text-lg tracking-tighter uppercase italic leading-none">
                            ZA <span className="text-industrial-orange">PRECISION</span>
                        </span>
                        <span className="text-[7px] font-display uppercase tracking-[0.4em] text-white/30">System Dashboard</span>
                    </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/40">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-industrial-orange font-display text-[10px] uppercase font-black">ISO 9001</span>
                    <span className="text-[8px] text-white/40 uppercase">Certified</span>
                </div>
                <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-industrial-orange font-display text-[10px] uppercase font-black">{products.length}</span>
                    <span className="text-[8px] text-white/40 uppercase">Components</span>
                </div>
            </div>

            <nav className="flex flex-col gap-4">
                {[
                    { id: 'home', label: 'Overview', icon: Globe },
                    { id: 'products', label: 'Component Catalog', icon: Factory },
                    { id: 'about', label: 'System Information', icon: ShieldCheck },
                    { id: 'contact', label: 'Live Inquiry', icon: MessageCircle },
                ].map(item => (
                    <motion.button 
                        key={item.id}
                        onClick={() => handleNavClick(item.id as any)}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "flex items-center gap-5 py-5 px-6 rounded-2xl transition-all border group",
                            activeTab === item.id 
                                ? "bg-industrial-orange/10 border-industrial-orange/30 text-industrial-orange shadow-[0_0_30px_rgba(239,125,0,0.15)]" 
                                : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-industrial-orange" : "group-hover:text-white")} />
                        <span className="font-display uppercase tracking-[0.3em] text-[11px] font-bold">{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div layoutId="mobile-indicator-active" className="ml-auto w-2 h-2 bg-industrial-orange rounded-full shadow-[0_0_15px_rgba(239,125,0,1)]" />
                        )}
                    </motion.button>
                ))}
            </nav>

            <div className="mt-auto pt-8">
                <button 
                    onClick={() => { setShowAdminLogin(true); setMobileMenuOpen(false); }}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/40 flex items-center justify-center gap-3 hover:text-white hover:bg-white/10 transition-all"
                >
                    <Lock className="w-4 h-4" />
                    Secure Staff Entry
                </button>
                <p className="text-center mt-6 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    ZA_PRECISION_MOBILE_STATION // v2.1
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />
        )}
      </AnimatePresence>

      <main className="pb-24 md:pb-0">
        {activePage === 'home' && (
          <>
            <Hero />
            
            {/* Products Section */}
            <section id="products" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-industrial-orange font-display text-[10px] uppercase tracking-[0.3em] mb-4"
                    >
                        Industrial Inventory
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase"
                    >
                        Precision Components
                    </motion.h2>
                    <div className="h-1 w-20 bg-industrial-orange/50 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, i) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            index={i}
                            onOrder={handlePlaceOrder}
                        />
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white/[0.02] border-y border-white/5 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-display font-bold mb-16 uppercase tracking-wider">Client Trust</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                          { name: 'Pepsi Bottling Co.', quote: 'ZA Precision parts have significantly extended our production runs between maintenance cycles.', role: 'Operations Manager' },
                          { name: 'Global Bev Corp', quote: 'The dimensional accuracy of their custom manifolds is superior to OEM parts we used previously.', role: 'Technical Lead' }
                        ].map((t, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="glass p-8 rounded-2xl relative"
                            >
                                <Star className="absolute top-[-15px] left-8 w-8 h-8 text-industrial-blue fill-industrial-blue" />
                                <p className="text-industrial-silver italic mb-6 leading-relaxed">"{t.quote}"</p>
                                <div className="text-left border-l-2 border-industrial-blue pl-4">
                                    <h4 className="font-display font-bold text-sm">{t.name}</h4>
                                    <p className="text-[10px] text-industrial-silver/50 uppercase tracking-widest">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-square glass rounded-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-industrial-orange/10 group-hover:bg-industrial-orange/20 transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center">
                             <Logo className="w-48 h-48 opacity-40 group-hover:scale-110 transition-transform duration-700" glow />
                        </div>
                        <div className="absolute bottom-8 left-8 right-8">
                             <div className="glass p-6 rounded-2xl backdrop-blur-xl border-white/10">
                                <h4 className="font-display font-black text-xl mb-1 italic">EST. 2004</h4>
                                <p className="text-[10px] text-industrial-silver/50 uppercase tracking-[0.3em]">Engineering excellence for two decades</p>
                             </div>
                        </div>
                    </div>
                    <div>
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-industrial-orange font-display text-xs uppercase tracking-[0.4em] mb-6 block font-bold"
                        >
                            Our Legacy
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 uppercase leading-none">
                            Precision <br /><span className="text-industrial-silver/40">Is Our DNA</span>
                        </h2>
                        <p className="text-industrial-silver mb-8 leading-relaxed text-lg">
                            ZA Precision started as a small machine shop with one vision: to provide the bottling and food packaging industry with components that outperform OEM standards. 
                        </p>
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-display font-bold text-industrial-orange italic">ISO 9001</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Certified quality management systems ensuring consistency.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-display font-bold text-industrial-orange italic">24/7</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Technical support line for critical component failure.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="glass px-6 py-4 rounded-xl flex items-center gap-4">
                                <Phone className="w-5 h-5 text-industrial-orange" />
                                <div>
                                    <p className="text-[9px] uppercase text-white/30 font-display">Technical Hotline</p>
                                    <p className="font-bold text-sm">{contactInfo.techSupport}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
                <div className="glass rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <h2 className="text-4xl font-display font-black text-white mb-6 uppercase leading-tight">
                            Build Your <span className="text-industrial-orange">Custom</span> Part
                        </h2>
                        <p className="text-industrial-silver mb-8 leading-relaxed">
                            Need a part that isn't in our catalog? Our engineers specialize in reverse engineering 
                            and manufacturing custom components for legacy machinery and high-speed lines.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-industrial-orange group-hover:text-black transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-industrial-silver/50 font-display">Technical Support</p>
                                    <p className="font-bold">{contactInfo.techSupport}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-industrial-orange group-hover:text-black transition-all">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-industrial-silver/50 font-display">Direct Email</p>
                                    <p className="font-bold">{COMPANY_EMAIL}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 glass p-8 rounded-2xl border-industrial-orange/10">
                        <div className="flex flex-col items-center text-center gap-4">
                            <MessageCircle className="w-12 h-12 text-industrial-orange" />
                            <h3 className="font-display font-bold uppercase">Quick Inquiry</h3>
                            <p className="text-xs text-industrial-silver/60 mb-4">Average response time: 30 minutes</p>
                            <a 
                                href={`https://wa.me/${(COMPANY_WHATSAPP || '').replace(/\D/g,'')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-industrial-orange text-black font-display font-black uppercase text-xs tracking-widest hover:neon-glow transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp Chat
                            </a>
                        </div>
                    </div>
                </div>
            </section>
          </>
        )}

        {activePage === 'admin' && isAdmin && (
          <AdminPanel 
            products={products}
            orders={orders}
            contactInfo={contactInfo}
            onUpdateContact={setContactInfo}
            onAddProduct={(p) => setProducts([...products, { ...p, id: Math.random().toString(36).substring(7) } as Product])}
            onUpdateProduct={(p) => setProducts(products.map(old => old.id === p.id ? p : old))}
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
            onUpdateOrder={(id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o))}
            onLogout={logoutAdmin}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAdminLogin(false)}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-sm glass p-8 rounded-2xl border-industrial-orange/20"
                >
                    <div className="text-center mb-8">
                        <Lock className="w-12 h-12 text-industrial-orange mx-auto mb-4" />
                        <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase">Access Portal</h2>
                        <p className="text-industrial-silver/50 text-xs uppercase tracking-widest font-display">Enter Admin Credential</p>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div className="space-y-2">
                             <input
                                autoFocus
                                type="password"
                                value={adminCodeInput}
                                onChange={e => setAdminCodeInput(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 px-4 py-4 rounded-lg text-center tracking-[1em] text-2xl focus:border-industrial-orange outline-none transition-all"
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-industrial-orange text-black font-display font-bold uppercase tracking-widest hover:neon-glow transition-all">
                            Verify Identity
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/5 text-center">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3">
                <Logo className="w-8 h-8 opacity-60" />
                <span className="font-display font-black text-lg tracking-tighter uppercase italic text-industrial-silver/80">
                    ZA <span className="text-industrial-silver/60">PRECISION</span>
                </span>
            </div>
            <div className="flex gap-8">
                <motion.a href="#" whileHover={{ scale: 1.1, color: '#ef7d00' }} className="text-industrial-silver/50 hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-4 h-4" /> Documentation</motion.a>
                <motion.a href="#" whileHover={{ scale: 1.1, color: '#ef7d00' }} className="text-industrial-silver/50 hover:text-white transition-colors">Privacy Policy</motion.a>
                <motion.a href="#" whileHover={{ scale: 1.1, color: '#ef7d00' }} className="text-industrial-silver/50 hover:text-white transition-colors">Safety Standards</motion.a>
            </div>
          </div>
          <p className="text-[10px] font-display uppercase tracking-widest text-industrial-silver/30">
            © {new Date().getFullYear()} {COMPANY_NAME} Industrial. All Rights Reserved. Manufactured in ISO 9001:2015 Facility.
          </p>
      </footer>

      {/* Persistent Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full bg-industrial-black/95 backdrop-blur-md border-t border-industrial-orange/20 z-[90] md:hidden flex items-center justify-around py-4 px-4 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {[
            { id: 'home', label: 'Overview', icon: Globe },
            { id: 'products', label: 'Parts', icon: Factory },
            { id: 'about', label: 'Spec', icon: ShieldCheck },
            { id: 'contact', label: 'Chat', icon: MessageCircle },
        ].map(item => (
            <button
                key={item.id}
                onClick={() => handleNavClick(item.id as any)}
                className={cn(
                    "flex flex-col items-center gap-2 transition-all relative",
                    activeTab === item.id ? "text-industrial-orange scale-110" : "text-white/20"
                )}
            >
                {activeTab === item.id && (
                    <motion.div layoutId="bottom-nav-active" className="absolute -top-4 w-12 h-[3px] bg-industrial-orange rounded-full shadow-[0_0_20px_rgba(239,125,0,0.8)]" />
                )}
                <item.icon className={cn("w-6 h-6", activeTab === item.id ? "text-industrial-orange" : "")} />
                <span className="text-[7px] font-display font-black uppercase tracking-[0.3em] leading-none">{item.label}</span>
            </button>
        ))}
      </nav>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-28 right-6 z-[60] flex flex-col gap-4 md:bottom-8 md:right-8">
          <motion.a
            href={`https://wa.me/${(COMPANY_WHATSAPP || '').replace(/\D/g,'')}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
          >
            <MessageCircle className="w-7 h-7" />
          </motion.a>
      </div>

      <OrderModal 
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        contactInfo={contactInfo}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}
