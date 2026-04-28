import React from 'react';
import { Leaf, Zap, Users, Award, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-6 py-3 flex justify-between items-center z-50">
      {[
        { id: "home", label: "Home", icon: Leaf },
        { id: "action", label: "Action", icon: Zap },
        { id: "community", label: "Community", icon: Users },
        { id: "portfolio", label: "Portfolio", icon: Award },
        { id: "profile", label: "Profile", icon: User },
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
    </div>
  );
}