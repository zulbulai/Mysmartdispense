import React from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, BRANDS, DISCOUNT_THRESHOLDS } from '../constants';

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string;
    brand: string;
    minDiscount: number;
    search: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    brand: string;
    minDiscount: number;
    search: string;
  }>>;
}

export default function Filters({ isOpen, onClose, filters, setFilters }: FiltersProps) {
  const resetFilters = () => {
    setFilters({ category: '', brand: '', minDiscount: 0, search: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-neutral-900 z-[70] p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 gold-accent" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Refine Vault</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-10">
              <section>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-4">Category</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setFilters(f => ({ ...f, category: '' }))}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${filters.category === '' ? 'gold-bg text-black border-gold' : 'border-white/10 hover:border-white/30'}`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(c => (
                    <button 
                      key={c}
                      onClick={() => setFilters(f => ({ ...f, category: c }))}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${filters.category === c ? 'gold-bg text-black border-gold' : 'border-white/10 hover:border-white/30'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-4">Market Origin</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setFilters(f => ({ ...f, brand: '' }))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border text-left ${filters.brand === '' ? 'bg-white/10 border-white/20' : 'border-white/5 opacity-50'}`}
                  >
                    Any Brand
                  </button>
                  {BRANDS.map(b => (
                    <button 
                      key={b}
                      onClick={() => setFilters(f => ({ ...f, brand: b }))}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border text-left ${filters.brand === b ? 'bg-white/10 border-white/20' : 'border-white/5 opacity-50'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-4">Minimum Discount</label>
                <div className="grid grid-cols-3 gap-2">
                  {DISCOUNT_THRESHOLDS.map(d => (
                    <button 
                      key={d}
                      onClick={() => setFilters(f => ({ ...f, minDiscount: d }))}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${filters.minDiscount === d ? 'border-gold text-gold' : 'border-white/5 opacity-40'}`}
                    >
                      {d}%+
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
              <button 
                onClick={onClose}
                className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/90"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
