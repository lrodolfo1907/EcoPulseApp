import { motion } from "motion/react";
import { Search, MapPin, Globe, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface InitiativesTabProps {
  initiativeType: string;
  setInitiativeType: (type: string) => void;
  initiatives: any[];
  joinedInitiativeIds: string[];
  isInitiativesLoading: boolean;
  fetchInitiatives: (type: string) => void;
  handleJoinInitiative: (id: string, hours: number) => void;
}

export function InitiativesTab({
  initiativeType,
  setInitiativeType,
  initiatives,
  joinedInitiativeIds = [],
  isInitiativesLoading,
  fetchInitiatives,
  handleJoinInitiative
}: InitiativesTabProps) {
  const { t } = useTranslation();
  const [hideJoined, setHideJoined] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Conservation", "Climate Action", "Education", "Waste Reduction", "Advocacy"];

  let filteredInitiatives = hideJoined 
    ? initiatives.filter(item => !joinedInitiativeIds.includes(item.id))
    : initiatives;

  if (activeCategory !== "All") {
    filteredInitiatives = filteredInitiatives.filter(item => item.category === activeCategory);
  }

  return (
    <motion.div
      key="initiatives"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('initiatives.title')}</h2>
          <p className="text-gray-500 font-medium">{t('initiatives.subtitle')}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => setHideJoined(!hideJoined)}
            className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {hideJoined ? t('initiatives.showJoined') : t('initiatives.hideJoined')}
          </button>
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => { setInitiativeType("local"); fetchInitiatives("local"); }}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                initiativeType === "local" ? "bg-green-700 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {t('initiatives.local')}
            </button>
            <button 
              onClick={() => { setInitiativeType("global"); fetchInitiatives("global"); }}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                initiativeType === "global" ? "bg-green-700 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {t('initiatives.global')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border",
              activeCategory === cat 
                ? "bg-gray-900 text-white border-gray-900" 
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {cat === "All" ? cat : `#${cat}`}
          </button>
        ))}
      </div>

      {initiativeType === "local" && (
        <div className="bg-gray-100/50 rounded-[2rem] border border-gray-200 p-6 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-inner h-48 md:h-64 my-6">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")' }}></div>
          <MapPin size={40} className="text-gray-400 mb-3 relative z-10" />
          <h3 className="text-xl font-bold text-gray-800 relative z-10">{t('initiatives.mapSoonTitle')}</h3>
          <p className="text-gray-500 font-medium max-w-sm mt-2 relative z-10">{t('initiatives.mapSoonDesc')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isInitiativesLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-64 rounded-[2rem] animate-pulse border border-gray-100" />
          ))
        ) : filteredInitiatives.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-[2rem] border border-gray-100">
            <p className="text-gray-500 font-medium">{t('initiatives.noFound')}</p>
          </div>
        ) : (
          filteredInitiatives.map((item) => {
            const isJoined = joinedInitiativeIds.includes(item.id);
            return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    item.taskType === "micro" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {item.taskType === "micro" ? t('initiatives.microTask') : t('initiatives.regularTask')} {item.time && `• ${item.time}`}
                  </span>
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-green-50 text-green-700 ml-2">
                      {item.category}
                    </span>
                  )}
                  {item.verified && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> {t('initiatives.verified')}
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-bold leading-tight mb-2 group-hover:text-green-700 transition-colors">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  {item.dist ? <MapPin size={14} /> : <Globe size={14} />}
                  {item.org} {item.dist && `• ${item.dist}`}
                  {item.skill && `• Skill: ${item.skill}`}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-green-600" />
                  <span className="text-sm font-bold text-green-700">{t('plusPoints', { hours: item.hours })}</span>
                </div>
                {isJoined ? (
                  <button 
                    disabled
                    className="bg-green-100 text-green-800 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} /> {t('common.joined')}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleJoinInitiative(item.id, item.hours)}
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
                  >
                    {t('initiatives.joinNow')}
                  </button>
                )}
              </div>
            </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
