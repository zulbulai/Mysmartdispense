import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { getAllProducts } from './lib/firestoreService';
import { Product } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Filters from './components/Filters';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { Filter, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minDiscount: 0,
    search: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesBrand = !filters.brand || p.brand === filters.brand;
    const matchesDiscount = p.discountPercentage >= filters.minDiscount;
    const matchesSearch = !filters.search || 
      p.name.toLowerCase().includes(filters.search.toLowerCase()) || 
      p.category.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesBrand && matchesDiscount && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Floating Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative z-30 -mt-16 mb-24"
        >
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-grow group">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 opacity-20 group-focus-within:opacity-100 group-focus-within:gold-accent transition-all" />
              <input 
                type="text"
                placeholder="Search the encrypted archives..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full glass-morphism rounded-3xl pl-16 pr-8 py-7 text-xl focus:outline-none focus:border-gold/50 transition-all font-display font-light tracking-tight pro-card-shadow"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="glass-morphism rounded-3xl px-10 py-7 flex items-center gap-4 hover:border-gold/50 transition-all group justify-center pro-card-shadow"
            >
              <Filter className="w-5 h-5 opacity-40 group-hover:gold-accent transition-colors" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">Refine Index</span>
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <div className="relative">
               <Loader2 className="w-12 h-12 gold-accent animate-spin" />
               <div className="absolute inset-0 blur-xl bg-gold/20 animate-pulse" />
             </div>
             <p className="text-[10px] uppercase font-bold tracking-[0.6em] opacity-40 animate-pulse">Decrypting Protocol 07...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-6 mb-12 opacity-30">
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] whitespace-nowrap">
                Showing {filteredProducts.length} Active Records
              </span>
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32 glass-morphism rounded-[3rem] border-dashed"
              >
                 <div className="max-w-md mx-auto space-y-6">
                    <p className="text-2xl font-display font-light opacity-60">The requested query returned null records in the current vault sector.</p>
                    <button 
                      onClick={() => setFilters({category: '', brand: '', minDiscount: 0, search: ''})} 
                      className="text-[10px] uppercase tracking-[0.4em] font-black gold-accent hover:opacity-80 transition-opacity flex items-center gap-3 mx-auto"
                    >
                      <div className="w-8 h-px bg-gold" />
                      Reset Protocol
                      <div className="w-8 h-px bg-gold" />
                    </button>
                 </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Filters 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters} 
        setFilters={setFilters} 
      />
    </main>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const isAdmin = user?.email === 'jitendraeditiz@gmail.com';

  if (loading) return null;
  
  if (!user || !isAdmin || !isUnlocked) {
    return <AdminLogin onUnlock={() => setIsUnlocked(true)} />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Simple Footer */}
        <footer className="py-12 border-t border-white/5 bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tighter uppercase">Mysmartdispense</span>
              <span className="text-[10px]">© 2026 Smart Aggregator</span>
            </div>
            <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

