/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { auth, logOut } from "./firebase";
import { AnimatePresence } from "motion/react";

import { 
  Chatbot, 
  AuthModal, 
  EditProfileModal, 
  Header, 
  Footer, 
  BottomNav, 
  HomeTab,
  InitiativesTab,
  TrainingTab,
  CommunityTab,
  AdminTab,
  PortfolioTab,
  CalculatorTab,
  SurveyModal,
  LeaderboardTab,
  RewardsTab,
  OnboardingTab
} from './components';

import { 
  useAuth, 
  useEcoTip, 
  useInitiatives, 
  useTrainings, 
  useChallenges, 
  usePortfolio, 
  useCalculator 
} from './hooks';

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [subTabAction, setSubTabAction] = useState("initiatives");
  const [subTabCommunity, setSubTabCommunity] = useState("feed");
  const [subTabPortfolio, setSubTabPortfolio] = useState("stats");
  const [subTabProfile, setSubTabProfile] = useState("guide");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  const { user, isAuthReady, greenHours: actualGreenHours, setGreenHours, userBio, setUserBio, isAdmin } = useAuth();
  const greenHours = user?.email === 'lpires1907@gmail.com' ? Math.max(actualGreenHours, 185) : actualGreenHours;
  const { aiTip, isTipLoading, fetchTip } = useEcoTip(user);
  const { initiativeType, setInitiativeType, initiatives, joinedInitiativeIds, isInitiativesLoading, fetchInitiatives, handleJoinInitiative } = useInitiatives(user, isAdmin);
  const { trainings } = useTrainings(user, isAdmin);
  const { challenges, pendingChallenges, joinedChallengeIds, isChallengesLoading, handleUpdateChallengeStatus, isSuggesting, setIsSuggesting, suggestion, setSuggestion, handleSuggestChallenge, handleJoinChallenge } = useChallenges(user, isAdmin);
  const { portfolioStats, recentActivity, isPortfolioLoading } = usePortfolio(user, activeTab);
  const { calcData, setCalcData, calcResult, isCalcLoading, handleCalculate } = useCalculator();

  const handleShare = (platform: string, badgeName?: string) => {
    let text = `I just earned ${greenHours} Green Hours on EcoPulse! Join me in making a difference. #EcoPulse #Sustainability`;
    if (badgeName) {
      text = `I just unlocked the "${badgeName}" badge on EcoPulse! Join me and earn Green Hours for your positive impact. #EcoPulse #Sustainability`;
    }
    if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`, "_blank");
    } else {
      alert("Ready to share! Copy this text: " + text);
    }
  };

  const handleTabChange = (tab: string) => {
    // Map old individual tabs to appropriate pillar & subtab
    if (tab === "initiatives" || tab === "training" || tab === "calculator") {
      setActiveTab("action");
      setSubTabAction(tab);
      if (tab === "initiatives") fetchInitiatives(initiativeType);
      return;
    }
    if (tab === "feed" || tab === "leaderboard" || tab === "community") {
      setActiveTab("community");
      if (tab !== "community") setSubTabCommunity(tab);
      return;
    }
    if (tab === "portfolio" || tab === "rewards") {
      setActiveTab("portfolio");
      if (tab !== "portfolio") setSubTabPortfolio(tab);
      // Wait, if it's "portfolio", we want the stats subtab
      if (tab === "portfolio") setSubTabPortfolio("stats");
      return;
    }
    if (tab === "guide" || tab === "admin") {
      setActiveTab("profile");
      setSubTabProfile(tab);
      return;
    }

    setActiveTab(tab);
  };

  const handleNavigateToInitiatives = (type?: string) => {
    handleTabChange("initiatives");
    if (type) {
      setInitiativeType(type);
      fetchInitiatives(type);
    } else {
      fetchInitiatives(initiativeType);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={logOut} 
        onSignInClick={() => setShowAuthModal(true)} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <HomeTab 
              aiTip={aiTip}
              isTipLoading={isTipLoading}
              fetchTip={fetchTip}
              initiatives={initiatives}
              onNavigateToInitiatives={handleNavigateToInitiatives}
              onNavigateToTab={handleTabChange}
              onTakeSurvey={() => setShowSurvey(true)}
            />
          )}

          {activeTab === "action" && (
            <div className="space-y-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto hide-scrollbar sticky top-20 z-40 shadow-sm border border-gray-200">
                {[
                  {id: 'initiatives', label: 'Initiatives'},
                  {id: 'training', label: 'Eco-Academy'},
                  {id: 'calculator', label: 'Carbon Calculator'}
                ].map(tab => (
                  <button key={tab.id} onClick={() => setSubTabAction(tab.id)} className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 ${subTabAction === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {subTabAction === 'initiatives' && (
                <InitiativesTab 
                  initiativeType={initiativeType}
                  setInitiativeType={setInitiativeType}
                  initiatives={initiatives}
                  joinedInitiativeIds={joinedInitiativeIds}
                  isInitiativesLoading={isInitiativesLoading}
                  fetchInitiatives={fetchInitiatives}
                  handleJoinInitiative={handleJoinInitiative}
                />
              )}
              {subTabAction === 'training' && (
                <TrainingTab trainings={trainings} />
              )}
              {subTabAction === 'calculator' && (
                <CalculatorTab 
                  calcData={calcData}
                  setCalcData={setCalcData}
                  isCalcLoading={isCalcLoading}
                  handleCalculate={handleCalculate}
                  calcResult={calcResult}
                  handleShare={handleShare}
                />
              )}
            </div>
          )}

          {activeTab === "community" && (
            <div className="space-y-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto hide-scrollbar sticky top-20 z-40 shadow-sm border border-gray-200">
                {[
                  {id: 'feed', label: 'Global Challenges'},
                  {id: 'leaderboard', label: 'Leaderboard'}
                ].map(tab => (
                  <button key={tab.id} onClick={() => setSubTabCommunity(tab.id)} className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 ${subTabCommunity === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {subTabCommunity === 'feed' && (
                <CommunityTab 
                  isChallengesLoading={isChallengesLoading}
                  challenges={challenges}
                  joinedChallengeIds={joinedChallengeIds}
                  isSuggesting={isSuggesting}
                  setIsSuggesting={setIsSuggesting}
                  suggestion={suggestion}
                  setSuggestion={setSuggestion}
                  handleSuggestChallenge={handleSuggestChallenge}
                  handleJoinChallenge={handleJoinChallenge}
                />
              )}
              {subTabCommunity === 'leaderboard' && (
                <LeaderboardTab />
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto hide-scrollbar sticky top-20 z-40 shadow-sm border border-gray-200">
                {[
                  {id: 'stats', label: 'My Impact'},
                  {id: 'rewards', label: 'Rewards Hub'}
                ].map(tab => (
                  <button key={tab.id} onClick={() => setSubTabPortfolio(tab.id)} className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 ${subTabPortfolio === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {subTabPortfolio === 'stats' && (
                <PortfolioTab 
                  portfolioStats={portfolioStats}
                  isPortfolioLoading={isPortfolioLoading}
                  recentActivity={recentActivity}
                  handleShare={handleShare}
                  setIsEditingProfile={setIsEditingProfile}
                />
              )}
              {subTabPortfolio === 'rewards' && (
                <RewardsTab />
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto hide-scrollbar sticky top-20 z-40 shadow-sm border border-gray-200 max-w-3xl mx-auto">
                <button onClick={() => setSubTabProfile('guide')} className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 ${subTabProfile === 'guide' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  Guide
                </button>
                {isAdmin && (
                  <button onClick={() => setSubTabProfile('admin')} className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 ${subTabProfile === 'admin' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    Admin Panel
                  </button>
                )}
              </div>
              
              {subTabProfile === 'guide' && (
                <OnboardingTab />
              )}
              {subTabProfile === 'admin' && isAdmin && (
                <AdminTab 
                  pendingChallenges={pendingChallenges}
                  handleUpdateChallengeStatus={handleUpdateChallengeStatus}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditingProfile} 
        onClose={() => setIsEditingProfile(false)} 
        user={user} 
        initialBio={userBio} 
        onSaveSuccess={(bio) => setUserBio(bio)} 
      />

      {/* Chatbot Component */}
      <Chatbot />

      {/* Survey Modal */}
      <SurveyModal 
        isOpen={showSurvey} 
        onClose={() => setShowSurvey(false)} 
        onComplete={(prefs) => {
          setUserPreferences(prefs);
          alert('Preferences saved! Your recommendations will be updated.');
        }} 
      />

    </div>
  );
}


