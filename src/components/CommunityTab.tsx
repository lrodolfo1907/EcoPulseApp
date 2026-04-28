import { motion, AnimatePresence } from "motion/react";
import { PlusCircle, Award } from "lucide-react";

interface CommunityTabProps {
  isChallengesLoading: boolean;
  challenges: any[];
  joinedChallengeIds: string[];
  isSuggesting: boolean;
  setIsSuggesting: (val: boolean) => void;
  suggestion: { title: string; description: string; category: string };
  setSuggestion: (val: { title: string; description: string; category: string }) => void;
  handleSuggestChallenge: () => void;
  handleJoinChallenge: (challengeId: string) => void;
}

export function CommunityTab({
  isChallengesLoading,
  challenges,
  joinedChallengeIds,
  isSuggesting,
  setIsSuggesting,
  suggestion,
  setSuggestion,
  handleSuggestChallenge,
  handleJoinChallenge
}: CommunityTabProps) {
  return (
    <motion.div
      key="community"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Community Challenges</h2>
          <p className="text-gray-500 font-medium">Join global movements or suggest your own</p>
        </div>
        <button 
          onClick={() => setIsSuggesting(true)}
          className="bg-green-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg"
        >
          <PlusCircle size={20} /> Suggest Challenge
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isChallengesLoading ? (
          <p className="text-gray-500 font-bold">Loading challenges...</p>
        ) : challenges.length > 0 ? (
          challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              {challenge.category && (
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-3 border border-green-100">
                  {challenge.category}
                </span>
              )}
              <h4 className="text-lg font-black mb-2 leading-tight">{challenge.title}</h4>
              <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">{challenge.description}</p>
              <button 
                onClick={() => handleJoinChallenge(challenge.id)}
                disabled={joinedChallengeIds.includes(challenge.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${joinedChallengeIds.includes(challenge.id) ? 'bg-green-100 text-green-800 cursor-not-allowed' : 'bg-gray-50 text-gray-600 hover:bg-green-700 hover:text-white'}`}
              >
                {joinedChallengeIds.includes(challenge.id) ? 'Joined' : 'Join Challenge'}
              </button>
            </div>
          ))
        ) : (
          // Fallback mock data if no approved challenges exist yet
          [
            { title: "No Plastic Week", participants: 1240, daysLeft: 3, icon: Award, progress: 65, category: "Waste Reduction" },
            { title: "Cycle to Work", participants: 850, daysLeft: 5, icon: Award, progress: 40, category: "Climate Action" },
            { title: "Zero Waste Cooking", participants: 2100, daysLeft: 2, icon: Award, progress: 85, category: "Waste Reduction" },
            { title: "Tree Planting", participants: 450, daysLeft: 12, icon: Award, progress: 20, category: "Conservation" },
          ].map((challenge) => (
            <div key={challenge.title} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <challenge.icon size={24} />
              </div>
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-3 border border-green-100">
                {challenge.category}
              </span>
              <h4 className="text-lg font-black mb-2 leading-tight">{challenge.title}</h4>
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-4">
                <span>{challenge.participants} joined</span>
                <span className="text-green-600">{challenge.daysLeft}d left</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-6">
                <div className="bg-green-600 h-full transition-all" style={{ width: `${challenge.progress}%` }} />
              </div>
              <button 
                onClick={() => handleJoinChallenge(challenge.title)} // Using title as ID for mock data
                disabled={joinedChallengeIds.includes(challenge.title)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${joinedChallengeIds.includes(challenge.title) ? 'bg-green-100 text-green-800 cursor-not-allowed' : 'bg-gray-50 text-gray-600 hover:bg-green-700 hover:text-white'}`}
              >
                {joinedChallengeIds.includes(challenge.title) ? 'Joined' : 'Join Challenge'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Suggestion Modal */}
      <AnimatePresence>
        {isSuggesting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuggesting(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black mb-2">Suggest a Challenge</h3>
              <p className="text-gray-500 font-medium mb-8">Your idea will be validated by admins before going live.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Challenge Title</label>
                  <input 
                    type="text" 
                    value={suggestion.title}
                    onChange={(e) => setSuggestion({...suggestion, title: e.target.value})}
                    placeholder="e.g. Meatless Mondays"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={suggestion.description}
                    onChange={(e) => setSuggestion({...suggestion, description: e.target.value})}
                    placeholder="How can people participate?"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                  <select
                    value={suggestion.category}
                    onChange={(e) => setSuggestion({...suggestion, category: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-gray-600 font-medium"
                  >
                    <option value="Waste Reduction">Waste Reduction</option>
                    <option value="Climate Action">Climate Action</option>
                    <option value="Conservation">Conservation</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsSuggesting(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSuggestChallenge}
                    className="flex-1 py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                  >
                    Submit Idea
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
