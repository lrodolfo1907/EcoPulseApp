import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onSignInClick: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export function Header({ activeTab, onTabChange, onLogout, onSignInClick, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const { user, isAdmin, greenHours } = useAuth();
  const navItems = ["Home", "Initiatives", "Calculator", "Training", "Community", "Portfolio"];
  if (isAdmin) navItems.push("Admin");

  const handleTabClick = (item: string) => {
    onTabChange(item.toLowerCase());
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                <Leaf size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
                  <span><span className="text-green-600">Eco</span>Pulse</span>
                </h1>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleTabClick(item)}
                  className={cn(
                    "text-sm font-bold transition-all px-3 py-2 rounded-lg",
                    activeTab === item.toLowerCase() 
                      ? "bg-green-50 text-green-700 shadow-sm" 
                      : "text-gray-500 hover:text-green-600 hover:bg-gray-50"
                  )}
                >
                  {item}
                </button>
              ))}
              <div className="h-8 w-px bg-gray-200 mx-2" />
              {user ? (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors" onClick={onLogout} title="Click to log out">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Green Hours</p>
                    <p className="text-sm font-black text-green-700 leading-none mt-1">{greenHours}</p>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onSignInClick}
                  className="bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-green-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-b border-gray-200 px-4 py-6 shadow-xl absolute w-full z-40"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleTabClick(item)}
                  className={cn(
                    "text-left text-lg font-bold p-4 rounded-2xl transition-colors",
                    activeTab === item.toLowerCase() ? "bg-green-50 text-green-700" : "text-gray-600"
                  )}
                >
                  {item}
                </button>
              ))}
              {!user && (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSignInClick();
                  }}
                  className="text-left text-lg font-bold p-4 rounded-2xl text-green-700 bg-green-50 mt-2"
                >
                  Sign In
                </button>
              )}
              {user && (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="text-left text-lg font-bold p-4 rounded-2xl text-red-600 hover:bg-red-50 mt-2"
                >
                  Log Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}