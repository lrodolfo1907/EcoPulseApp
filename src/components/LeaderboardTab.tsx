import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Globe, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks';
import { useTranslation } from 'react-i18next';

export function LeaderboardTab() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'global' | 'local'>('global');
  const { user } = useAuth();

  const BADGES = [
    { id: "seedling", name: t('portfolio.badges.seedling'), threshold: 1, icon: "🌱", description: t('portfolio.badges.seedlingDesc') },
    { id: "sprout", name: t('portfolio.badges.sprout'), threshold: 10, icon: "🌿", description: t('portfolio.badges.sproutDesc') },
    { id: "sapling", name: t('portfolio.badges.sapling'), threshold: 50, icon: "🌳", description: t('portfolio.badges.saplingDesc') },
    { id: "guardian", name: t('portfolio.badges.guardian'), threshold: 150, icon: "🛡️", description: t('portfolio.badges.guardianDesc') },
  ];

  let globalUsers: any[] = [
    { rank: 1, name: "Eco Ninja", hours: 450, impact: "Planted 50 Trees", color: "bg-yellow-100 text-yellow-700", rankColor: "text-yellow-600", location: "Brazil" },
    { rank: 2, name: "Maria S.", hours: 320, impact: "Recycled 1000kg", color: "bg-gray-100 text-gray-700", rankColor: "text-gray-500", location: "Portugal" },
    { rank: 3, name: "Green Future", hours: 285, impact: "Saved 5000L Water", color: "bg-amber-100 text-amber-700", rankColor: "text-amber-800", location: "Canada" },
    { rank: 4, name: "Ocean Saver", hours: 190, impact: "Cleaned 5 beaches", color: "bg-green-50 text-green-700", rankColor: "text-green-700", location: "Australia" },
    { rank: 5, name: "Carbon Zero", hours: 150, impact: "Avoided 200kg CO2", color: "bg-green-50 text-green-700", rankColor: "text-green-700", location: "Japan" },
  ];

  let localUsers: any[] = [
    { rank: 1, name: "Maria S.", hours: 320, impact: "Recycled 1000kg", color: "bg-yellow-100 text-yellow-700", rankColor: "text-yellow-600", location: "Rio de Janeiro" },
    { rank: 2, name: "Joao P.", hours: 210, impact: "Planted 20 Trees", color: "bg-gray-100 text-gray-700", rankColor: "text-gray-500", location: "Rio de Janeiro" },
    { rank: 3, name: "Ana Beatriz", hours: 165, impact: "Saved 1500L Water", color: "bg-amber-100 text-amber-700", rankColor: "text-amber-800", location: "Rio de Janeiro" },
    { rank: 4, name: "Carlos M.", hours: 120, impact: "Cleaned 2 beaches", color: "bg-green-50 text-green-700", rankColor: "text-green-700", location: "Rio de Janeiro" },
    { rank: 5, name: "Luiza F.", hours: 90, impact: "Avoided 50kg CO2", color: "bg-green-50 text-green-700", rankColor: "text-green-700", location: "Rio de Janeiro" },
  ];

  if (user?.email === 'lpires1907@gmail.com') {
    const me = {
      name: user.displayName || t('leaderboard.me'),
      hours: 185,
      impact: "Eco-Guardian Activities",
      color: "bg-green-100 text-green-800 border-2 border-green-500 shadow-sm",
      rankColor: "text-green-800",
      location: "Rio de Janeiro",
      isCurrentUser: true
    };
    
    // Insert and re-rank for global
    globalUsers.push({ ...me, rank: 0 } as any);
    globalUsers.sort((a, b) => b.hours - a.hours);
    globalUsers = globalUsers.slice(0, 5).map((u, i) => ({ ...u, rank: i + 1, color: u.isCurrentUser ? me.color : (i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-700" : i === 2 ? "bg-amber-100 text-amber-700" : "bg-green-50 text-green-700") }));
    
    // Insert and re-rank for local
    localUsers.push({ ...me, rank: 0 } as any);
    localUsers.sort((a, b) => b.hours - a.hours);
    localUsers = localUsers.slice(0, 5).map((u, i) => ({ ...u, rank: i + 1, color: u.isCurrentUser ? me.color : (i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-700" : i === 2 ? "bg-amber-100 text-amber-700" : "bg-green-50 text-green-700") }));
  }

  const currentUsers = activeView === 'global' ? globalUsers : localUsers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-2 flex items-center gap-4">
            <span className="bg-yellow-100 text-yellow-600 p-2 rounded-2xl"><Award size={36} /></span>
            {t('leaderboard.title')}
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            {t('leaderboard.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex bg-gray-100 p-2 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveView('global')}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
            activeView === 'global' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Globe size={20} />
          {t('leaderboard.global')}
        </button>
        <button
          onClick={() => setActiveView('local')}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
            activeView === 'local' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <MapPin size={20} />
          {t('leaderboard.local')}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-4">
          {currentUsers.map((user, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={user.rank} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className={cn("w-12 h-12 flex items-center justify-center rounded-full font-black text-xl flex-shrink-0", user.color)}>
                  #{user.rank}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg md:text-xl group-hover:text-green-800 transition-colors">{user.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <p className="text-sm text-gray-500 font-bold">{user.impact}</p>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <MapPin size={12} /> {user.location}
                    </p>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <div className="flex gap-1 items-center mt-1 sm:mt-0">
                      {BADGES.filter(b => user.hours >= b.threshold).map(badge => (
                        <span key={badge.id} title={badge.name} className="text-base leading-none cursor-help bg-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm border border-gray-100">{badge.icon}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-2xl md:text-3xl text-green-600 block leading-none">{user.hours}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t('leaderboard.hours')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
