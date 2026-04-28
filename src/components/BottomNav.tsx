import React from 'react';
import { Leaf, Globe, Calculator as CalcIcon, Award, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMoreClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onMoreClick }: BottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
      {[
        { id: "home", label: "Home", icon: Leaf },
        { id: "initiatives", label: "Impact", icon: Globe },
        { id: "calculator", label: "Calc", icon: CalcIcon },
        { id: "portfolio", label: "Profile", icon: Award },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === item.id ? "text-green-700" : "text-gray-400"
          )}
        >
          <item.icon size={20} className={cn(activeTab === item.id && "scale-110")} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center gap-1 text-gray-400"
      >
        <Menu size={20} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
      </button>
    </div>
  );
}