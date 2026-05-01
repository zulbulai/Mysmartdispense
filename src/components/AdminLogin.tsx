import React, { useState } from 'react';
import { LogIn, Shield, AlertCircle, Key } from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

interface AdminLoginProps {
  onUnlock: () => void;
}

export default function AdminLogin({ onUnlock }: AdminLoginProps) {
  const [user, loading] = useAuthState(auth);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isAdmin = user?.email === 'jitendraeditiz@gmail.com';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Jite@123') {
      onUnlock();
      setError('');
    } else {
      setError('Invalid Access Key');
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 gold-accent">
        <Shield />
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-12 rounded-3xl max-w-md w-full text-center"
      >
        <div className="w-16 h-16 gold-bg rounded-full flex items-center justify-center mx-auto mb-8">
          <Shield className="w-8 h-8 text-black" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight uppercase mb-4">Admin Access</h1>
        <p className="text-sm opacity-40 uppercase tracking-widest mb-10">Vault Protection Level: Alpha</p>

        {!user ? (
          <>
            <p className="text-sm opacity-60 mb-10">Identity verification required to initialize management protocols.</p>
            <button 
              onClick={signInWithGoogle}
              className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/90 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Authenticate Admin
            </button>
          </>
        ) : !isAdmin ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4 text-left">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-500 uppercase tracking-tighter">Unauthorized Agent</p>
              <p className="text-xs opacity-60">Your credentials ({user.email}) do not have clearance for this sector.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-4 text-left mb-6">
               <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-bold text-green-500 uppercase tracking-tighter">Permission Verified</p>
                 <p className="text-xs opacity-60">Welcome, Admin. Please enter your secondary access key.</p>
               </div>
            </div>
            
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input 
                type="password"
                placeholder="Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-gold/30 outline-none transition-all"
                autoFocus
              />
            </div>

            {error && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">{error}</p>}

            <button 
              type="submit"
              className="w-full gold-bg text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all"
            >
              Unlock Console
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
