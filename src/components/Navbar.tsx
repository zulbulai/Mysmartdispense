import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Shield, User, LogIn, LogOut } from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const isAdmin = user?.email === 'jitendraeditiz@gmail.com';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism h-16 flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gold-bg rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:gold-accent transition-colors">Deals</Link>
          {isAdmin && (
            <Link to="/admin" className="p-2 hover:gold-accent transition-colors flex items-center justify-center rounded-full bg-white/5 border border-white/10" title="Admin Console">
              <Shield className="w-4 h-4" />
            </Link>
          )}
          
          <div className="h-4 w-px bg-white/20" />

          {user ? (
            <div className="flex items-center gap-4">
              <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
              <button 
                onClick={() => auth.signOut()}
                className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="text-sm font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
