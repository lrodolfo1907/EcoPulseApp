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
  CalculatorTab 
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { user, isAuthReady, greenHours, setGreenHours, userBio, setUserBio, isAdmin } = useAuth();
  const { aiTip, isTipLoading, fetchTip } = useEcoTip(user);
  const { initiativeType, setInitiativeType, initiatives, isInitiativesLoading, fetchInitiatives, handleJoinInitiative } = useInitiatives(user, isAdmin);
  const { trainings } = useTrainings(user, isAdmin);
  const { challenges, pendingChallenges, joinedChallengeIds, isChallengesLoading, handleUpdateChallengeStatus, isSuggesting, setIsSuggesting, suggestion, setSuggestion, handleSuggestChallenge, handleJoinChallenge } = useChallenges(user, isAdmin);
  const { portfolioStats, recentActivity, isPortfolioLoading } = usePortfolio(user, activeTab);
  const { calcData, setCalcData, calcResult, isCalcLoading, handleCalculate } = useCalculator();

  const handleShare = (platform: string) => {
    const text = `I just earned ${greenHours} Green Hours on EcoPulse! Join me in making a difference. #EcoPulse #Sustainability`;
    if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`, "_blank");
    } else {
      alert("Ready to share on Instagram! Copy this text: " + text);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "initiatives") fetchInitiatives(initiativeType);
  };

  const handleNavigateToInitiatives = (type?: string) => {
    setActiveTab("initiatives");
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
            />
          )}

          {activeTab === "initiatives" && (
            <InitiativesTab 
              initiativeType={initiativeType}
              setInitiativeType={setInitiativeType}
              initiatives={initiatives}
              isInitiativesLoading={isInitiativesLoading}
              fetchInitiatives={fetchInitiatives}
              handleJoinInitiative={handleJoinInitiative}
            />
          )}

          {activeTab === "training" && (
            <TrainingTab trainings={trainings} />
          )}

          {activeTab === "community" && (
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

          {activeTab === "admin" && isAdmin && (
            <AdminTab 
              pendingChallenges={pendingChallenges}
              handleUpdateChallengeStatus={handleUpdateChallengeStatus}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioTab 
              portfolioStats={portfolioStats}
              isPortfolioLoading={isPortfolioLoading}
              recentActivity={recentActivity}
              handleShare={handleShare}
              setIsEditingProfile={setIsEditingProfile}
            />
          )}

          {activeTab === "calculator" && (
            <CalculatorTab 
              calcData={calcData}
              setCalcData={setCalcData}
              isCalcLoading={isCalcLoading}
              handleCalculate={handleCalculate}
              calcResult={calcResult}
              handleShare={handleShare}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onMoreClick={() => setIsMenuOpen(true)} 
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

    </div>
  );
}


