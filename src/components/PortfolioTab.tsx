import { motion } from "motion/react";
import { Share2, User, Edit2, Award, MapPin, BookOpen, Lock } from "lucide-react";
import { useAuth } from '../hooks';
import { cn } from '../lib/utils';

interface PortfolioTabProps {
  portfolioStats: { joined: number; completed: number };
  isPortfolioLoading: boolean;
  recentActivity: any[];
  handleShare: (platform: string, badgeName?: string) => void;
  setIsEditingProfile: (val: boolean) => void;
}

const BADGES = [
  { id: "seedling", name: "Seedling", threshold: 1, icon: "🌱", description: "Earned your first green hour" },
  { id: "sprout", name: "Sprout", threshold: 10, icon: "🌿", description: "Reached 10 green hours" },
  { id: "sapling", name: "Sapling", threshold: 50, icon: "🌳", description: "Reached 50 green hours" },
  { id: "guardian", name: "Forest Guardian", threshold: 150, icon: "🛡️", description: "Reached 150 green hours" },
];

export function PortfolioTab({
  portfolioStats,
  isPortfolioLoading,
  recentActivity,
  handleShare,
  setIsEditingProfile
}: PortfolioTabProps) {
  const { user, userBio, greenHours: actualGreenHours } = useAuth();
  // Override green hours for the specific user so they unlock the badges and see total 185
  const greenHours = user?.email === 'lpires1907@gmail.com' ? Math.max(actualGreenHours, 185) : actualGreenHours;
  
  return (
    <motion.div
      key="portfolio"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Impact Portfolio</h2>
          <p className="text-gray-500 font-medium">Your journey towards a greener future</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleShare("linkedin")} className="p-3 bg-white border border-gray-200 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all">
            <Share2 size={24} />
          </button>
          <button onClick={() => handleShare("instagram")} className="p-3 bg-white border border-gray-200 rounded-2xl text-pink-600 hover:bg-pink-50 transition-all">
            <Share2 size={24} />
          </button>
          <button onClick={() => handleShare("general")} className="bg-green-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg">
            <Share2 size={20} /> Share Portfolio
          </button>
        </div>
      </div>

      {/* Profile Header */}
      {user && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-400 to-green-600 opacity-20" />
          <div className="relative z-10 w-24 h-24 bg-green-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={40} className="text-green-700" />
            )}
          </div>
          <div className="relative z-10 flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold">{user.displayName || "Eco Warrior"}</h3>
            <p className="text-gray-500 font-medium mb-2">{user.email}</p>
            <p className="text-gray-700 italic">{userBio || "Add a bio to tell the community about your eco-journey!"}</p>
          </div>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="relative z-10 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold">My Badges</h3>
            <p className="text-gray-500 font-medium">Unlock achievements by earning green hours</p>
          </div>
          <Award size={32} className="text-yellow-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES.map((badge) => {
            const unlocked = greenHours >= badge.threshold;
            
            return (
              <div 
                key={badge.id}
                className={cn(
                  "p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all group",
                  unlocked 
                    ? "bg-green-50 border-green-200 hover:border-green-400" 
                    : "bg-gray-50 border-transparent opacity-60"
                )}
              >
                <div className="text-5xl mb-4 relative drop-shadow-md">
                  {badge.icon}
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-full backdrop-blur-[2px]">
                      <Lock size={24} className="text-gray-700" />
                    </div>
                  )}
                </div>
                <h4 className={cn("font-black mb-1", unlocked ? "text-green-900" : "text-gray-700")}>
                  {badge.name}
                </h4>
                <p className="text-xs text-wrap text-gray-500 font-medium mb-4 h-8 flex items-center justify-center">
                  {unlocked ? badge.description : `Unlocks at ${badge.threshold} hrs`}
                </p>
                {unlocked && (
                  <button 
                    onClick={() => handleShare("badge", badge.name)}
                    className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 bg-white text-green-700 text-xs font-bold rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <Share2 size={12} /> Share
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
          <div className="w-32 h-32 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={64} />
          </div>
          <h3 className="text-4xl font-black text-green-700 mb-2">{greenHours}</h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Green Hours Earned</p>
          <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Rank</span>
              <span className="text-sm font-bold text-green-700">Eco-Guardian</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Initiatives Joined</span>
              <span className="text-sm font-bold">{isPortfolioLoading ? "..." : portfolioStats.joined}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Initiatives Completed</span>
              <span className="text-sm font-bold">{isPortfolioLoading ? "..." : portfolioStats.completed}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                  {activity.type === "Initiative" ? <MapPin size={20} /> : activity.type === "Training" ? <BookOpen size={20} /> : <Award size={20} />}
                </div>
                <div>
                  <h4 className="font-bold">{activity.title}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{activity.date} • {activity.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-700">+{activity.hours}h</p>
              </div>
            </div>
          )) : (
            <div className="bg-gray-50 p-8 rounded-3xl text-center">
              <p className="text-gray-500 font-medium">No recent activity yet. Join an initiative to start earning Green Hours!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
