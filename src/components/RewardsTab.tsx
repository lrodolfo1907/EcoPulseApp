import { motion } from "motion/react";
import { Gift, Wallet, TrendingUp, ShieldCheck, Ticket, Coffee, Bus } from "lucide-react";
import { useAuth } from "../hooks";

export function RewardsTab() {
  const { user, greenHours: actualGreenHours } = useAuth();
  const greenHours = user?.email === 'lpires1907@gmail.com' ? Math.max(actualGreenHours, 185) : actualGreenHours;

  const rewards = [
    { title: "WWF Eco-Warrior NFT", cost: 1000, icon: <ShieldCheck size={24} className="text-blue-500" />, desc: "Exclusive digital badge verifying your commitment.", type: "Digital" },
    { title: "One Month Transit Pass", cost: 500, icon: <Bus size={24} className="text-green-500" />, desc: "Free public transportation pass for your city.", type: "Transport" },
    { title: "Sustainable Coffee Cup", cost: 150, icon: <Coffee size={24} className="text-amber-600" />, desc: "Reusable bamboo coffee cup from EcoBrand.", type: "Product" },
    { title: "Local Museum Entry", cost: 50, icon: <Ticket size={24} className="text-purple-500" />, desc: "One free entry to the local natural history museum.", type: "Experience" },
  ];

  return (
    <motion.div
      key="rewards"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-[2rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Gift size={120} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-700/50 backdrop-blur-md px-4 py-2 rounded-full mb-6 text-sm font-bold border border-green-500/30">
            <Wallet size={16} /> Beta Program
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Green Rewards</h2>
          <p className="text-green-50 text-lg max-w-xl md:text-xl font-medium">
            Turn your <span className="font-bold text-green-300">Green Hours</span> into real-world value. We're partnering with sustainable brands so you can soon exchange your impact for exclusive perks.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold">Your Balance</h3>
            <p className="text-gray-500 font-medium">Available for future redemption</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-green-700 leading-none">{greenHours} GH</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mt-1">Green Hours</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((reward, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {reward.icon}
              </div>
              <h4 className="font-bold text-lg mb-2">{reward.title}</h4>
              <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2">{reward.desc}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-600 rounded-full">{reward.type}</span>
                <span className="text-green-700 font-bold">{reward.cost} GH</span>
              </div>

              <button className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-green-700 transition-colors" disabled={greenHours < reward.cost}>
                {greenHours >= reward.cost ? "Redeem Coming Soon" : "Need more GH"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
