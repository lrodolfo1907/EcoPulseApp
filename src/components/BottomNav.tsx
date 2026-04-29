import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Zap, Users, Award, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-6 py-3 flex justify-between items-center z-50">
      {[
        { id: "home", label: t('nav.home'), icon: Leaf },
        { id: "action", label: t('nav.action'), icon: Zap },
        { id: "community", label: t('nav.community'), icon: Users },
        { id: "portfolio", label: t('nav.portfolio'), icon: Award },
        { id: "profile", label: t('nav.profile'), icon: User },
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