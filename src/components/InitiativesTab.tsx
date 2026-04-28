import { motion } from "motion/react";
import { Search, MapPin, Globe, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface InitiativesTabProps {
  initiativeType: string;
  setInitiativeType: (type: string) => void;
  initiatives: any[];
  isInitiativesLoading: boolean;
  fetchInitiatives: (type: string) => void;
  handleJoinInitiative: (id: string, hours: number) => void;
}

export function InitiativesTab({
  initiativeType,
  setInitiativeType,
  initiatives,
  isInitiativesLoading,
  fetchInitiatives,
  handleJoinInitiative
}: InitiativesTabProps) {
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
          <h2 className="text-3xl font-black tracking-tight">Environmental Initiatives</h2>
          <p className="text-gray-500 font-medium">Find ways to contribute and earn Green Hours</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search initiatives..."
              className="pl-12 pr-6 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-full md:w-64 font-bold text-sm"
            />
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => { setInitiativeType("local"); fetchInitiatives("local"); }}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                initiativeType === "local" ? "bg-green-700 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              Hyper-Local
            </button>
            <button 
              onClick={() => { setInitiativeType("global"); fetchInitiatives("global"); }}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                initiativeType === "global" ? "bg-green-700 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              Micro-Tasks
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isInitiativesLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-64 rounded-[2rem] animate-pulse border border-gray-100" />
          ))
        ) : (
          initiatives.map((item) => (
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
                    item.type === "In-Person" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {item.type} {item.time && `• ${item.time}`}
                  </span>
                  {item.verified && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-black leading-tight mb-2 group-hover:text-green-700 transition-colors">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  {item.dist ? <MapPin size={14} /> : <Globe size={14} />}
                  {item.org} {item.dist && `• ${item.dist}`}
                  {item.skill && `• Skill: ${item.skill}`}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-green-600" />
                  <span className="text-sm font-black text-green-700">+{item.hours} Green Hours</span>
                </div>
                <button 
                  onClick={() => handleJoinInitiative(item.id, item.hours)}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
                >
                  Join Now
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
