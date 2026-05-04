import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, MessageSquare, Package, User, Star, ArrowLeft, LogOut, Check, ShieldCheck, Upload, Image as ImageIcon, Link as LinkIcon, X, Lock, AlertTriangle } from 'lucide-react';
import { Product, Order, Review } from '../types';
import { cn } from '../lib/utils';
import { ADMIN_CODE } from '../constants';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  contactInfo: { whatsapp: string; email: string; techSupport?: string };
  onUpdateContact: (info: { whatsapp: string; email: string; techSupport?: string }) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrder: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  products,
  orders,
  contactInfo,
  onUpdateContact,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onDeleteOrder,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'engine' as Product['category'],
    images: [''],
    compatibility: '',
    material: '',
    dimensions: '',
  });

  const [imageInputTypes, setImageInputTypes] = useState<('url' | 'file')[]>(['url']);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleAddImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    setImageInputTypes(prev => [...prev, 'url']);
  };

  const handleRemoveImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newTypes = imageInputTypes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages.length > 0 ? newImages : [''] }));
    setImageInputTypes(newTypes.length > 0 ? newTypes : ['url']);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleImageChange(index, base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const toggleInputType = (index: number) => {
    const newTypes = [...imageInputTypes];
    newTypes[index] = newTypes[index] === 'url' ? 'file' : 'url';
    setImageInputTypes(newTypes);
    handleImageChange(index, ''); // Clear value when switching
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = formData.images.filter(url => url.trim() !== '');
    if (editingId) {
        const existing = products.find(p => p.id === editingId);
        if (existing) {
            onUpdateProduct({ ...existing, ...formData, images: cleanImages });
        }
        setEditingId(null);
    } else {
        onAddProduct({ ...formData, images: cleanImages });
        setIsAdding(false);
    }
    setFormData({ name: '', description: '', category: 'engine', images: [''], compatibility: '', material: '', dimensions: '' });
    setImageInputTypes(['url']);
  };

  const startEdit = (product: Product) => {
    setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        images: product.images.length > 0 ? product.images : [''],
        compatibility: product.compatibility,
        material: product.material,
        dimensions: product.dimensions || '',
    });
    setImageInputTypes(product.images.map(img => img.startsWith('data:') ? 'file' : 'url'));
    setEditingId(product.id);
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
           <h1 className="text-4xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
           <p className="text-industrial-silver/60 uppercase tracking-widest text-[10px]">Secure Control Center</p>
        </div>
        <button 
           onClick={onLogout}
           className="px-6 py-2.5 border border-red-500/20 text-red-500/80 font-display text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-black transition-all flex items-center gap-2 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
          <LogOut className="w-3 h-3 translate-y-[1px]" />
          Logout.Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: User },
            { id: 'settings', label: 'Settings', icon: ShieldCheck },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                    "flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-display text-xs uppercase tracking-widest whitespace-nowrap",
                    activeTab === tab.id 
                        ? "border-industrial-orange text-industrial-orange bg-industrial-orange/5" 
                        : "border-transparent text-industrial-silver/50 hover:text-white"
                )}
            >
                <tab.icon className="w-4 h-4" />
                {tab.label}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'products' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-display font-bold text-white">Product Inventory</h2>
                    <button 
                        onClick={() => { setIsAdding(true); setEditingId(null); }}
                        className="px-4 py-2 bg-industrial-orange text-black font-display text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New
                    </button>
                </div>

                {isAdding && (
                     <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-xl"
                    >
                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex justify-between items-center mb-2">
                                <h3 className="font-display text-lg text-industrial-orange">{editingId ? 'Edit Product' : 'Create New Product'}</h3>
                                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-industrial-silver hover:text-white"><ArrowLeft className="w-5 h-5"/></button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-industrial-silver/50 font-display">Product Name</label>
                                <input required className="w-full bg-white/5 border border-white/10 p-3 rounded text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-industrial-silver/50 font-display">Category</label>
                                <input required className="w-full bg-white/5 border border-white/10 p-3 rounded text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase text-industrial-silver/50 font-display">Product Images (URL or Local Upload)</label>
                                    <button type="button" onClick={handleAddImageField} className="text-industrial-orange text-[10px] uppercase flex items-center gap-1 font-bold bg-industrial-orange/10 px-2 py-1 rounded">
                                        <Plus className="w-3 h-3" /> Add Image Slot
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-mono text-industrial-silver/40">SLOT {idx + 1}</span>
                                                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => toggleInputType(idx)}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] uppercase font-bold transition-all",
                                                                imageInputTypes[idx] === 'url' ? "bg-industrial-orange text-black" : "text-white/40 hover:text-white"
                                                            )}
                                                        >
                                                            <LinkIcon className="w-3 h-3" /> URL
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => toggleInputType(idx)}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] uppercase font-bold transition-all",
                                                                imageInputTypes[idx] === 'file' ? "bg-industrial-orange text-black" : "text-white/40 hover:text-white"
                                                            )}
                                                        >
                                                            <Upload className="w-3 h-3" /> Upload
                                                        </button>
                                                    </div>
                                                </div>
                                                {formData.images.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveImageField(idx)} className="text-red-500/50 hover:text-red-500">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    {imageInputTypes[idx] === 'url' ? (
                                                        <input 
                                                            className="w-full bg-black/40 border border-white/10 p-3 rounded text-white text-sm focus:border-industrial-orange transition-all outline-none" 
                                                            placeholder="https://example.com/image.jpg"
                                                            value={img} 
                                                            onChange={e => handleImageChange(idx, e.target.value)} 
                                                        />
                                                    ) : (
                                                        <div className="relative group">
                                                            <input 
                                                                type="file" 
                                                                accept="image/*"
                                                                onChange={e => handleFileUpload(idx, e)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="w-full bg-black/40 border-2 border-dashed border-white/10 p-8 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-industrial-orange/50 transition-all">
                                                                <Upload className="w-6 h-6 text-industrial-silver/40 group-hover:text-industrial-orange group-hover:scale-110 transition-all" />
                                                                <span className="text-[10px] uppercase tracking-widest text-industrial-silver/60">
                                                                    {img.startsWith('data:') ? 'Image selected' : 'Drop file or click to upload'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {img && (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/40">
                                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] uppercase text-industrial-silver/50 font-display">Description</label>
                                <textarea required rows={3} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-industrial-silver/50 font-display">Custom Dimensions</label>
                                <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-industrial-silver/50 font-display">Compatibility</label>
                                <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white" value={formData.compatibility} onChange={e => setFormData({...formData, compatibility: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="w-full py-4 bg-industrial-orange text-black font-display font-bold uppercase tracking-widest">{editingId ? 'Update Product' : 'Publish Product'}</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="glass p-6 rounded-xl flex flex-col">
                            <div className="flex gap-4 mb-4">
                                <img 
                                    src={product.images?.[0] || ''} 
                                    className="w-20 h-20 object-cover rounded" 
                                    alt="" 
                                />
                                <div>
                                    <h4 className="font-display font-bold text-white text-sm uppercase italic">{product.name}</h4>
                                    <p className="text-industrial-orange text-[10px] font-display uppercase tracking-widest">{product.category}</p>
                                    <p className="text-industrial-silver/40 text-[9px] font-bold mt-1 uppercase">ID: {product.id}</p>
                                </div>
                            </div>
                            <div className="mt-auto flex gap-2">
                                <button onClick={() => startEdit(product)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-display uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                    <Edit3 className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => onDeleteProduct(product.id)} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 text-[10px] font-display uppercase tracking-widest transition-all">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-white">Received Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-[10px] uppercase font-display text-industrial-silver/50 tracking-widest">
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Product</th>
                                <th className="py-4 px-4">Qty</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.sort((a,b) => b.timestamp - a.timestamp).map(order => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                                    <td className="py-4 px-4 text-xs text-industrial-silver">
                                        {new Date(order.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm font-medium text-white">{order.customerName}</div>
                                        <div className="text-[10px] text-industrial-silver/60">{order.phone}</div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-industrial-orange">
                                        {order.productName}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-white">
                                        {order.quantity}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={cn(
                                            "text-[9px] uppercase tracking-widest px-2 py-1 rounded-full",
                                            order.status === 'pending' ? "bg-amber-500/20 text-amber-500" :
                                            order.status === 'contacted' ? "bg-blue-500/20 text-blue-500" :
                                            "bg-emerald-500/20 text-emerald-500"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {order.status !== 'completed' && (
                                                <button 
                                                    onClick={() => onUpdateOrder(order.id, 'completed')}
                                                    className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded transition-all"
                                                    title="Complete Order"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this order?')) {
                                                        onDeleteOrder(order.id);
                                                    }
                                                }}
                                                className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-all"
                                                title="Delete Order"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-industrial-silver/30 font-display uppercase tracking-widest text-xs">No orders received yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase italic tracking-tighter">System Configuration</h2>
                    <p className="text-industrial-silver/40 text-[10px] uppercase tracking-widest">Global Protocol Management</p>
                </div>
                
                <div className="glass p-10 rounded-2xl border-white/5 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-industrial-orange/20" />
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-industrial-orange shadow-[0_0_8px_#ef7d00]" />
                            <label className="text-[10px] uppercase tracking-[0.2em] text-industrial-silver/50 font-display">Business WhatsApp [Secure]</label>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm focus:border-industrial-orange transition-all outline-none" 
                                value={contactInfo.whatsapp}
                                onChange={(e) => onUpdateContact({ ...contactInfo, whatsapp: e.target.value })}
                                placeholder="92XXXXXXXXXX"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-mono text-industrial-silver/30">WA.me Protocol</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-industrial-orange shadow-[0_0_8px_#ef7d00]" />
                            <label className="text-[10px] uppercase tracking-[0.2em] text-industrial-silver/50 font-display">Technical Support Phone</label>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm focus:border-industrial-orange transition-all outline-none" 
                                value={contactInfo.techSupport || ''}
                                onChange={(e) => onUpdateContact({ ...contactInfo, techSupport: e.target.value })}
                                placeholder="0303XXXXXXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-industrial-orange shadow-[0_0_8px_#ef7d00]" />
                            <label className="text-[10px] uppercase tracking-[0.2em] text-industrial-silver/50 font-display">Service Contact Email</label>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm focus:border-industrial-orange transition-all outline-none" 
                                value={contactInfo.email}
                                onChange={(e) => onUpdateContact({ ...contactInfo, email: e.target.value })}
                                placeholder="service@zaprecision.com"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 text-emerald-500/60 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-emerald-500">Auto-Sync Enabled</p>
                                <p className="text-[9px] text-emerald-500/40">Configuration values are persisted via LocalStorage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="glass p-10 rounded-2xl border-white/5 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20" />
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-display font-bold text-white uppercase italic tracking-tighter">Change Admin Password</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" />
                            <label className="text-[10px] uppercase tracking-[0.2em] text-industrial-silver/50 font-display">New Password</label>
                        </div>
                        <input
                            type="password"
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm focus:border-red-400 transition-all outline-none"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setPasswordChanged(false); }}
                            placeholder="Enter new admin password"
                        />
                    </div>
                    <button
                        type="button"
                        disabled={!newPassword.trim()}
                        onClick={() => setConfirmPasswordModal(true)}
                        className="w-full py-4 bg-red-500/20 text-red-400 font-display font-bold uppercase tracking-widest text-xs border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Change Password
                    </button>
                    {passwordChanged && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-500 text-xs">
                            <Check className="w-4 h-4" />
                            <span className="font-display uppercase tracking-widest text-[10px]">Password updated successfully</span>
                        </motion.div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Password Confirmation Modal */}
      <AnimatePresence>
        {confirmPasswordModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmPasswordModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm glass p-8 rounded-2xl border-red-500/20 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3 uppercase">Are You Sure?</h3>
              <p className="text-industrial-silver/60 text-sm mb-8">This will permanently change your admin login password. Make sure you remember the new password.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmPasswordModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-white/60 font-display text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('admin_password', newPassword.trim());
                    setConfirmPasswordModal(false);
                    setNewPassword('');
                    setPasswordChanged(true);
                  }}
                  className="flex-1 py-3 bg-red-500 text-white font-display text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-red-600 transition-all"
                >
                  I Am Sure
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
