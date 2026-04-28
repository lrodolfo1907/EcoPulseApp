import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Share2, Sparkles, RefreshCw, Globe, Zap, Droplets, MapPin, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks';

interface HomeTabProps {
  aiTip: string;
  isTipLoading: boolean;
  fetchTip: (forceRefresh?: boolean) => void;
  initiatives: any[];
  onNavigateToInitiatives: (type?: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export function HomeTab({ 
  aiTip, 
  isTipLoading, 
  fetchTip, 
  initiatives, 
  onNavigateToInitiatives, 
  onNavigateToTab 
}: HomeTabProps) {
  const { user, greenHours } = useAuth();

  const handleShare = (platform: string) => {
    const text = `I just earned ${greenHours} Green Hours on EcoPulse! Join me in making a difference. #EcoPulse #Sustainability`;
    if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`, "_blank");
    } else {
      alert("Ready to share on Instagram! Copy this text: " + text);
    }
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      {/* Hero Section */}
      <section className="bg-green-700 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-green-200">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black leading-tight">
              Hello, {user?.displayName?.split(' ')[0] || 'Eco Warrior'}! <br />
              Ready to <span className="text-green-300 underline decoration-4 underline-offset-8">save the planet?</span>
            </h2>
            <p className="mt-6 text-green-100 text-lg leading-relaxed opacity-90">
              You've earned {greenHours} Green Hours. That's equivalent to planting {Math.floor(greenHours * 0.3)} trees this month. Keep up the amazing work!
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => handleShare("linkedin")}
                className="bg-white text-green-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-50 transition-all shadow-lg"
              >
                <Share2 size={20} /> Export to LinkedIn
              </button>
              <button 
                onClick={() => handleShare("instagram")}
                className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-500 transition-all border border-green-500"
              >
                <Share2 size={20} /> Share on Instagram
              </button>
            </div>
          </motion.div>
        </div>
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-600/50 to-transparent pointer-events-none" />
        <Leaf className="absolute -bottom-10 -right-10 w-64 h-64 text-green-600 opacity-20 rotate-45" />
      </section>

      {/* Centralized Eco Tip & Consolidated Impact Widget */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Eco Tip - Centralized and Visual */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-[2.5rem] border border-green-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Leaf size={120} className="text-green-700 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-green-700">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-black text-green-900">Daily Eco Tip</h3>
            </div>
            {isTipLoading ? (
              <div className="animate-pulse flex flex-col gap-3">
                <div className="h-4 bg-green-200 rounded w-3/4"></div>
                <div className="h-4 bg-green-200 rounded w-full"></div>
                <div className="h-4 bg-green-200 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-lg text-green-800 font-medium leading-relaxed">
                {aiTip}
              </p>
            )}
            <button 
              onClick={() => fetchTip(true)}
              className="mt-8 text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} className={isTipLoading ? "animate-spin" : ""} />
              Get another tip
            </button>
          </div>
        </div>

        {/* Consolidated Impact Overview */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-2xl font-black mb-6">Your Impact Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Carbon Saved", value: "125.4 kg", icon: Globe, color: "bg-blue-50 text-blue-600" },
              { label: "Energy Usage", value: "42 kWh", icon: Zap, color: "bg-amber-50 text-amber-600" },
              { label: "Water Saved", value: "850 L", icon: Droplets, color: "bg-cyan-50 text-cyan-600" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <p className="text-xl font-black">{stat.value}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-600">Monthly Goal Progress</span>
              <span className="text-sm font-black text-green-700">75%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full w-3/4" />
            </div>
          </div>
        </div>

      </section>

      {/* Quick Actions & Initiatives Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-black tracking-tight">Explore Initiatives</h3>
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <button 
                onClick={() => onNavigateToInitiatives("local")}
                className="px-6 py-2 rounded-xl text-sm font-bold text-green-700 hover:bg-green-50 transition-all flex items-center gap-2"
              >
                <MapPin size={16} /> Local
              </button>
              <button 
                onClick={() => onNavigateToInitiatives("global")}
                className="px-6 py-2 rounded-xl text-sm font-bold text-purple-700 hover:bg-purple-50 transition-all flex items-center gap-2"
              >
                <Globe size={16} /> Global
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {initiatives.slice(0, 2).map((item) => (
              <div 
                key={item.id} 
                onClick={() => onNavigateToTab("initiatives")}
                className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {item.type}
                  </span>
                  <span className="text-xs font-black text-green-700">+{item.hours}h</span>
                </div>
                <h4 className="font-black text-gray-800 group-hover:text-green-700 transition-colors line-clamp-1">{item.title}</h4>
                <p className="text-xs text-gray-400 font-bold mt-1">{item.org}</p>
              </div>
            ))}
            <button 
              onClick={() => onNavigateToTab("initiatives")}
              className="sm:col-span-2 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold hover:bg-gray-100 hover:border-green-200 hover:text-green-600 transition-all flex items-center justify-center gap-2"
            >
              View All Initiatives <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-black tracking-tight">Eco-Academy</h3>
          <div 
            onClick={() => onNavigateToTab("training")}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-full min-h-[250px] relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h4 className="text-xl font-black mb-2">Boost Your Knowledge</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Join our curated training sessions to increase your capacity to contribute.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-green-700 font-black relative z-10">
              Go to Academy <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <BookOpen className="absolute -bottom-10 -right-10 w-40 h-40 text-green-50 opacity-50 rotate-12" />
          </div>
        </div>
      </section>
    </motion.div>
  );
}