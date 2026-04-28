import { motion } from "motion/react";
import { BookOpen, Sprout, Users, Map, Award, MessageCircle } from "lucide-react";

export function OnboardingTab() {
  const steps = [
    {
      icon: <Sprout size={32} className="text-green-600" />,
      title: "1. Find Initiatives",
      desc: "Head over to the Initiatives tab to discover local environmental projects and micro-tasks you can complete from home.",
    },
    {
      icon: <Users size={32} className="text-blue-600" />,
      title: "2. Join the Community",
      desc: "Check out the Community tab to suggest new challenges, vote on ideas, and see what other Eco-Warriors are up to.",
    },
    {
      icon: <Map size={32} className="text-amber-600" />,
      title: "3. Log Your Real Impact",
      desc: "Participate in real-life cleanup drives, tree planting events, and digital tasks to earn your Green Hours (GH).",
    },
    {
      icon: <Award size={32} className="text-purple-600" />,
      title: "4. Earn Rewards",
      desc: "Track your Green Hours in your Portfolio, climb the Leaderboard, and soon, redeem your GH for premium eco-rewards!",
    },
    {
      icon: <MessageCircle size={32} className="text-teal-600" />,
      title: "5. Ask EcoBot",
      desc: "Got questions? Try clicking the floating chat icon in the bottom right to talk to our AI EcoBot anytime.",
    }
  ];

  return (
    <motion.div
      key="guide"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-8 py-8"
    >
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
          <BookOpen size={40} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">Getting Started</h2>
        <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl mx-auto">
          Welcome to EcoPulse! We're thrilled to have you join our global movement for environmental action. Here is how you can start making a difference today.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center py-8">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">You are all set. Time to explore!</p>
      </div>
    </motion.div>
  );
}
