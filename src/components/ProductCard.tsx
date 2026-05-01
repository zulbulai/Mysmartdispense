import React from 'react';
import { ExternalLink, Tag, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountStr = product.discountPercentage ? `${product.discountPercentage}%` : null;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group glass-morphism rounded-[2rem] overflow-hidden flex flex-col h-full premium-border pro-card-shadow"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {discountStr && (
          <div className="absolute top-4 right-4 gold-bg text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider pro-card-shadow">
            {discountStr} OFF
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="glass-morphism px-3 py-1 rounded-full backdrop-blur-sm border-white/10">
            <span className="text-[8px] uppercase tracking-widest font-black opacity-80">{product.brand}</span>
          </div>
        </div>

        {!product.availability && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-500 border border-red-500/50 px-4 py-2 rounded-lg">Negative Inventory</span>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[8px] uppercase font-bold tracking-[0.4em] gold-accent px-2 py-0.5 border border-gold/20 rounded bg-gold/5">
              {product.category}
            </span>
          </div>
          <h3 className="text-2xl font-display font-bold tracking-tight line-clamp-2 leading-[1.1] group-hover:gold-accent transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto space-y-8">
          <div className="flex items-end justify-between border-t border-white/10 pt-6">
            <div className="flex flex-col">
              <span className="text-[7px] uppercase tracking-[0.4em] font-black opacity-20 mb-2">Current Value Index</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-bold gold-accent">₹{product.finalPrice}</span>
                <span className="text-sm font-mono opacity-20 line-through decoration-gold/40">₹{product.originalPrice}</span>
              </div>
            </div>
          </div>

          <a 
            href={product.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/btn w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.3em] transition-all duration-500 relative overflow-hidden ${
              product.availability 
                ? 'gold-bg text-black hover:scale-[1.03] active:scale-[0.97]' 
                : 'bg-white/5 text-white/10 cursor-not-allowed pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            {product.availability ? (
              <>
                <span className="relative z-10">Access Manifest</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </>
            ) : (
              'Link Offline'
            )}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
