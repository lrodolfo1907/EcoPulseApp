import React from 'react';
import { Leaf, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="hidden lg:block bg-white border-t border-gray-100 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tighter"><span className="text-green-600">Eco</span>Pulse</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-green-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-700 transition-colors">Partnerships</a>
            <a href="#" className="hover:text-green-700 transition-colors">Contact</a>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all border border-gray-100">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all border border-gray-100">
              <Share2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            © 2026 EcoPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}