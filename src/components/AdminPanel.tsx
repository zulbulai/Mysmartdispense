import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Link as LinkIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { createProduct, updateProduct, deleteProduct, getAllProducts } from '../lib/firestoreService';
import { CATEGORIES, BRANDS } from '../constants';

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'discountPercentage'>>({
    name: '',
    originalPrice: 0,
    finalPrice: 0,
    category: CATEGORIES[0],
    subCategory: '',
    brand: BRANDS[0],
    imageUrl: '',
    purchaseLink: '',
    availability: true,
    tags: []
  });

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, availability: e.target.checked }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.originalPrice || !formData.finalPrice) return;
    await createProduct(formData);
    setShowAddForm(false);
    fetchData();
    setFormData({
      name: '',
      originalPrice: 0,
      finalPrice: 0,
      category: CATEGORIES[0],
      subCategory: '',
      brand: BRANDS[0],
      imageUrl: '',
      purchaseLink: '',
      availability: true,
      tags: []
    });
  };

  const handleUpdate = async (id: string) => {
    await updateProduct(id, formData);
    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const startEditing = (p: Product) => {
    setFormData({ ...p });
    setEditingId(p.id);
    setShowAddForm(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="pt-24 px-6 pb-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Admin Console</h1>
          <p className="text-sm opacity-40 uppercase tracking-widest mt-1">Manage the Vault Inventory</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'New Deal'}
        </button>
      </div>

      <AnimatePresence>
        {(showAddForm || editingId) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 glass-morphism rounded-3xl overflow-hidden p-8"
          >
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleAddSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Product Name</label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors"
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Original Price (₹)</label>
                      <input 
                        type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Final Price (₹)</label>
                      <input 
                        type="number" name="finalPrice" value={formData.finalPrice} onChange={handleInputChange} required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors appearance-none"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Brand</label>
                      <select name="brand" value={formData.brand} onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors appearance-none"
                      >
                        {BRANDS.map(b => <option key={b} value={b} className="bg-neutral-900">{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Image URL</label>
                    <div className="flex gap-2">
                       <input 
                        type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required
                        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 opacity-20" />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Purchase Link</label>
                    <input 
                      type="url" name="purchaseLink" value={formData.purchaseLink} onChange={handleInputChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-colors"
                      placeholder="https://amazon.in/dp/..."
                    />
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <input 
                      type="checkbox" id="availability" checked={formData.availability} onChange={handleCheckboxChange}
                      className="w-5 h-5 accent-gold"
                    />
                    <label htmlFor="availability" className="text-sm font-medium">Product is Available</label>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                 <button 
                  type="submit"
                  className="bg-gold text-black px-10 py-3 rounded-full font-bold uppercase text-sm tracking-widest flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Save Changes' : 'Publish Deal'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-morphism rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-8 h-8 gold-accent animate-spin" />
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-40">Decrypting Vault...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 opacity-10" />
            <p className="opacity-40 uppercase text-xs tracking-widest">No deals found in the archives.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Prices</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Stock</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/10 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-sm line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold opacity-60">{p.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-2">
                       <span className="font-mono text-sm">₹{p.finalPrice}</span>
                       <span className="font-mono text-[10px] opacity-30 line-through">₹{p.originalPrice}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.availability ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {p.availability ? 'IN STOCK' : 'EXHAUSTED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEditing(p)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><Edit2 className="w-4 h-4 opacity-40" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
