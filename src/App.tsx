/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, signInWithGoogle, logOut, db } from "./firebase";
import { 
  Leaf, 
  Zap, 
  Droplets, 
  TrendingUp, 
  Lightbulb, 
  User, 
  Menu, 
  X,
  ChevronRight,
  Globe,
  Award,
  Calculator as CalcIcon,
  RefreshCw,
  MapPin,
  Search,
  BookOpen,
  Share2,
  PlusCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { getEcoTip, calculateCarbonFootprint } from "./services/gemini";

const chartData = [
  { name: "Mon", value: 45 },
  { name: "Tue", value: 52 },
  { name: "Wed", value: 38 },
  { name: "Thu", value: 65 },
  { name: "Fri", value: 48 },
  { name: "Sat", value: 30 },
  { name: "Sun", value: 25 },
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [aiTip, setAiTip] = useState("Loading your daily eco-tip...");
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [greenHours, setGreenHours] = useState(42);

  // Initiatives State
  const [initiativeType, setInitiativeType] = useState("local");
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [isInitiativesLoading, setIsInitiativesLoading] = useState(false);

  // Calculator State
  const [calcData, setCalcData] = useState({ transport: 50, energy: 200, diet: "omnivore" });
  const [calcResult, setCalcResult] = useState<any>(null);
  const [isCalcLoading, setIsCalcLoading] = useState(false);

  // Training State
  const [trainings, setTrainings] = useState<any[]>([]);

  // Suggest Challenge State
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState({ title: "", description: "" });

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error("Auth error:", err);
      // Provide user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else {
        setAuthError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Portfolio State
  const [portfolioStats, setPortfolioStats] = useState({ joined: 0, completed: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);

  const fetchPortfolio = async () => {
    if (!user) return;
    setIsPortfolioLoading(true);
    try {
      const q = query(collection(db, "user_initiatives"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const joined = snap.size;
      const completed = snap.docs.filter(doc => doc.data().status === 'completed').length;
      setPortfolioStats({ joined, completed });

      // Fetch initiative details for recent activity
      const activities = [];
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        const initRef = doc(db, "initiatives", data.initiativeId);
        const initSnap = await getDoc(initRef);
        if (initSnap.exists()) {
          activities.push({
            title: initSnap.data().title,
            date: data.joinedAt ? new Date(data.joinedAt.toDate()).toLocaleDateString() : "Recently",
            hours: initSnap.data().hours,
            type: "Initiative"
          });
        }
      }
      setRecentActivity(activities);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setIsPortfolioLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "portfolio") {
      fetchPortfolio();
    }
  }, [activeTab, user]);

  const handleSuggestChallenge = async () => {
    if (!user) {
      alert("Please sign in to suggest a challenge.");
      return;
    }
    if (!suggestion.title || !suggestion.description) {
      alert("Please fill in both title and description.");
      return;
    }
    try {
      await addDoc(collection(db, "challenges"), {
        title: suggestion.title,
        description: suggestion.description,
        status: "pending",
        authorUid: user.uid,
        createdAt: serverTimestamp()
      });
      alert("Suggestion submitted! Our admins will review it soon.");
      setIsSuggesting(false);
      setSuggestion({ title: "", description: "" });
    } catch (error) {
      console.error("Error submitting challenge:", error);
      alert("Failed to submit challenge. Please try again.");
    }
  };

  const handleJoinInitiative = async (initiativeId: string, hours: number) => {
    if (!user) {
      alert("Please sign in to join an initiative.");
      return;
    }
    try {
      // Check if already joined
      const q = query(collection(db, "user_initiatives"), 
        where("userId", "==", user.uid), 
        where("initiativeId", "==", initiativeId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        alert("You have already joined this initiative!");
        return;
      }

      await addDoc(collection(db, "user_initiatives"), {
        userId: user.uid,
        initiativeId: initiativeId,
        status: "joined",
        joinedAt: serverTimestamp()
      });
      alert(`Successfully joined! Complete it to earn ${hours} Green Hours.`);
    } catch (error) {
      console.error("Error joining initiative:", error);
      alert("Failed to join. Please try again.");
    }
  };

  const fetchTip = async () => {
    setIsTipLoading(true);
    const tip = await getEcoTip();
    setAiTip(tip || "Small changes lead to big impacts!");
    setIsTipLoading(false);
  };

  const fetchInitiatives = async (type: string) => {
    setIsInitiativesLoading(true);
    
    const mockInitiativesFallback = [
      { id: "1", title: "Cleanup Drive - Guanabara Bay", org: "Urban Sea Institute", type: "local", hours: 3, verified: true },
      { id: "2", title: "Flora Mapping - Tijuca Forest", org: "SOS Atlantic Forest", type: "local", hours: 4, verified: false },
      { id: "3", title: "Report Translation (PT/EN)", org: "WWF International", type: "global", hours: 0.5, verified: true },
      { id: "4", title: "Satellite Image Identification", org: "Zero Deforestation Project", type: "global", hours: 0.2, verified: true },
    ];

    if (!user) {
      setInitiatives(mockInitiativesFallback.filter(i => i.type === type));
      setIsInitiativesLoading(false);
      return;
    }

    try {
      const initiativesRef = collection(db, "initiatives");
      const q = query(initiativesRef, where("type", "==", type));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Seed mock data if empty (for demo purposes)
        const mockInitiatives = [
          { title: "Cleanup Drive - Guanabara Bay", org: "Urban Sea Institute", type: "local", hours: 3, verified: true, description: "Help clean the bay." },
          { title: "Flora Mapping - Tijuca Forest", org: "SOS Atlantic Forest", type: "local", hours: 4, verified: false, description: "Map flora in the forest." },
          { title: "Report Translation (PT/EN)", org: "WWF International", type: "global", hours: 0.5, verified: true, description: "Translate reports." },
          { title: "Satellite Image Identification", org: "Zero Deforestation Project", type: "global", hours: 0.2, verified: true, description: "Identify satellite images." },
        ];
        
        // Only seed if user is admin, otherwise just show empty
        if (user && user.email === 'lpires1907@gmail.com') {
           for (const init of mockInitiatives) {
             await addDoc(initiativesRef, { ...init, createdAt: serverTimestamp() });
           }
           // Fetch again
           const newSnapshot = await getDocs(q);
           setInitiatives(newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
           // If not admin, just use mock data locally so UI isn't empty
           setInitiatives(mockInitiatives.filter(i => i.type === type).map((i, idx) => ({ id: String(idx), ...i })));
        }
      } else {
        setInitiatives(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error("Error fetching initiatives:", err);
      setInitiatives(mockInitiativesFallback.filter(i => i.type === type));
    } finally {
      setIsInitiativesLoading(false);
    }
  };

  const fetchTrainings = async () => {
    const mockTrainingsFallback = [
      { id: "1", title: "Circular Economy Basics", duration: "2h", level: "Beginner", provider: "WWF Academy" },
      { id: "2", title: "Climate Advocacy 101", duration: "5h", level: "Intermediate", provider: "Greenpeace Education" },
      { id: "3", title: "Sustainable Urban Planning", duration: "10h", level: "Advanced", provider: "UN-Habitat" },
    ];

    if (!user) {
      setTrainings(mockTrainingsFallback);
      return;
    }

    try {
      const trainingsRef = collection(db, "trainings");
      const querySnapshot = await getDocs(trainingsRef);
      
      if (querySnapshot.empty) {
        const mockTrainings = [
          { title: "Circular Economy Basics", duration: "2h", level: "Beginner", provider: "WWF Academy" },
          { title: "Climate Advocacy 101", duration: "5h", level: "Intermediate", provider: "Greenpeace Education" },
          { title: "Sustainable Urban Planning", duration: "10h", level: "Advanced", provider: "UN-Habitat" },
        ];
        
        if (user && user.email === 'lpires1907@gmail.com') {
           for (const t of mockTrainings) {
             await addDoc(trainingsRef, { ...t, createdAt: serverTimestamp() });
           }
           const newSnapshot = await getDocs(trainingsRef);
           setTrainings(newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
           setTrainings(mockTrainings.map((t, idx) => ({ id: String(idx), ...t })));
        }
      } else {
        setTrainings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error("Error fetching trainings:", err);
      setTrainings(mockTrainingsFallback);
    }
  };

  const handleCalculate = async () => {
    setIsCalcLoading(true);
    const result = await calculateCarbonFootprint(calcData);
    setCalcResult(result);
    setIsCalcLoading(false);
  };

  const handleShare = (platform: string) => {
    const text = `I just earned ${greenHours} Green Hours on EcoPulse by WWF! Join me in making a difference. #EcoPulse #WWF #Sustainability`;
    if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`, "_blank");
    } else {
      // Mock Instagram share (usually requires mobile app integration or stories)
      alert("Ready to share on Instagram! Copy this text: " + text);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          // Create new user profile
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            greenHours: 0,
            role: "user",
            createdAt: serverTimestamp()
          });
          setGreenHours(0);
        } else {
          setGreenHours(userSnap.data().greenHours || 0);
        }

        // Listen for real-time updates to greenHours
        const unsubUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setGreenHours(doc.data().greenHours || 0);
          }
        });
        return () => unsubUser();
      } else {
        setGreenHours(0);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTip();
    fetchInitiatives("local");
    fetchTrainings();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                <Leaf size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
                  EcoPulse
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">
                    by WWF
                  </span>
                </h1>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {["Dashboard", "Initiatives", "Calculator", "Training", "Community", "Portfolio"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item.toLowerCase());
                    if (item.toLowerCase() === "initiatives") fetchInitiatives(initiativeType);
                  }}
                  className={cn(
                    "text-sm font-bold transition-all px-3 py-2 rounded-lg",
                    activeTab === item.toLowerCase() 
                      ? "bg-green-50 text-green-700 shadow-sm" 
                      : "text-gray-500 hover:text-green-600 hover:bg-gray-50"
                  )}
                >
                  {item}
                </button>
              ))}
              <div className="h-8 w-px bg-gray-200 mx-2" />
              {user ? (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors" onClick={logOut} title="Click to log out">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Green Hours</p>
                    <p className="text-sm font-black text-green-700 leading-none mt-1">{greenHours}</p>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-green-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-b border-gray-200 px-4 py-6 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {["Dashboard", "Initiatives", "Calculator", "Training", "Community", "Portfolio"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item.toLowerCase());
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "text-left text-lg font-bold p-4 rounded-2xl transition-colors",
                    activeTab === item.toLowerCase() ? "bg-green-50 text-green-700" : "text-gray-600"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
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
                      Hello, Luiz! <br />
                      Ready to <span className="text-green-300 underline decoration-4 underline-offset-8">save the planet?</span>
                    </h2>
                    <p className="mt-6 text-green-100 text-lg leading-relaxed opacity-90">
                      You've earned 42 Green Hours. That's equivalent to planting 12 trees this month. Keep up the amazing work!
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

              {/* Stats & AI Tip */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: "Carbon Saved", value: "125.4 kg", icon: Globe, color: "bg-blue-50 text-blue-600" },
                    { label: "Energy Usage", value: "42 kWh", icon: Zap, color: "bg-amber-50 text-amber-600" },
                    { label: "Water Saved", value: "850 L", icon: Droplets, color: "bg-cyan-50 text-cyan-600" },
                  ].map((stat, i) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black mt-1">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Lightbulb size={20} />
                      </div>
                      <h3 className="text-lg font-black tracking-tight">Daily Eco-Tip</h3>
                    </div>
                    <p className={cn("text-gray-600 leading-relaxed transition-opacity italic", isTipLoading ? "opacity-50" : "opacity-100")}>
                      "{aiTip}"
                    </p>
                  </div>
                  <button 
                    onClick={fetchTip}
                    disabled={isTipLoading}
                    className="mt-6 relative z-10 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-all rounded-2xl font-bold flex items-center justify-center gap-2 border border-gray-200"
                  >
                    {isTipLoading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                    New Insight
                  </button>
                </div>
              </section>

              {/* Quick Actions & Initiatives Preview */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-2xl font-black tracking-tight">Explore Initiatives</h3>
                    <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
                      <button 
                        onClick={() => { setActiveTab("initiatives"); setInitiativeType("local"); fetchInitiatives("local"); }}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-green-700 hover:bg-green-50 transition-all flex items-center gap-2"
                      >
                        <MapPin size={16} /> Local
                      </button>
                      <button 
                        onClick={() => { setActiveTab("initiatives"); setInitiativeType("global"); fetchInitiatives("global"); }}
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
                        onClick={() => setActiveTab("initiatives")}
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
                      onClick={() => setActiveTab("initiatives")}
                      className="sm:col-span-2 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold hover:bg-gray-100 hover:border-green-200 hover:text-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      View All Initiatives <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-black tracking-tight">Eco-Academy</h3>
                  <div 
                    onClick={() => setActiveTab("training")}
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
          )}

          {activeTab === "initiatives" && (
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
          )}

          {activeTab === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <div className="max-w-2xl">
                <h2 className="text-3xl font-black tracking-tight">Eco-Academy</h2>
                <p className="text-gray-500 font-medium mt-2">
                  Increase your knowledge and capacity to contribute to the community with our curated training sessions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainings.map((course) => (
                  <div key={course.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all group">
                    <div className="w-full md:w-32 h-32 bg-green-50 rounded-3xl flex items-center justify-center text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all">
                      <BookOpen size={40} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                            {course.level}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                            {course.duration}
                          </span>
                        </div>
                        <h4 className="text-xl font-black mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{course.provider}</p>
                      </div>
                      <button className="mt-6 flex items-center gap-2 text-green-700 font-black hover:gap-4 transition-all">
                        Start Learning <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "community" && (
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
                {[
                  { title: "No Plastic Week", participants: 1240, daysLeft: 3, icon: Award, progress: 65 },
                  { title: "Cycle to Work", participants: 850, daysLeft: 5, icon: Award, progress: 40 },
                  { title: "Zero Waste Cooking", participants: 2100, daysLeft: 2, icon: Award, progress: 85 },
                  { title: "Tree Planting", participants: 450, daysLeft: 12, icon: Award, progress: 20 },
                ].map((challenge) => (
                  <div key={challenge.title} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <challenge.icon size={24} />
                    </div>
                    <h4 className="text-lg font-black mb-2 leading-tight">{challenge.title}</h4>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-4">
                      <span>{challenge.participants} joined</span>
                      <span className="text-green-600">{challenge.daysLeft}d left</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-6">
                      <div className="bg-green-600 h-full transition-all" style={{ width: `${challenge.progress}%` }} />
                    </div>
                    <button className="w-full py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-green-700 hover:text-white transition-all">
                      Join Challenge
                    </button>
                  </div>
                ))}
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
                      <p className="text-gray-500 font-medium mb-8">Your idea will be validated by WWF admins before going live.</p>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Challenge Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Meatless Mondays"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                          <textarea 
                            rows={4}
                            placeholder="How can people participate?"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                          />
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
          )}

          {activeTab === "portfolio" && (
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
                  <button className="bg-green-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg">
                    <Share2 size={20} /> Share Portfolio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                  <div className="w-32 h-32 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={64} />
                  </div>
                  <h3 className="text-4xl font-black text-green-700 mb-2">{greenHours}</h3>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Green Hours Earned</p>
                  <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Rank</span>
                      <span className="text-sm font-black text-green-700">Eco-Guardian</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Initiatives Joined</span>
                      <span className="text-sm font-black">{isPortfolioLoading ? "..." : portfolioStats.joined}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Initiatives Completed</span>
                      <span className="text-sm font-black">{isPortfolioLoading ? "..." : portfolioStats.completed}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-black">Recent Activity</h3>
                  {[
                    { title: "Cleanup Drive - Guanabara Bay", date: "Yesterday", hours: 3, type: "Initiative" },
                    { title: "Circular Economy Basics", date: "3 days ago", hours: 2, type: "Training" },
                    { title: "No Plastic Week", date: "Last week", hours: 5, type: "Challenge" },
                  ].map((activity, i) => (
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
                        <p className="text-lg font-black text-green-700">+{activity.hours}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto w-full"
            >
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-green-100 text-green-700 rounded-[1.5rem]">
                    <CalcIcon size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Carbon Calculator</h2>
                    <p className="text-gray-500 font-medium">Measure your weekly environmental footprint</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 group-focus-within:text-green-600 transition-colors">Transport (km/week)</label>
                    <input 
                      type="number" 
                      value={calcData.transport}
                      onChange={(e) => setCalcData({...calcData, transport: Number(e.target.value)})}
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg font-bold"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 group-focus-within:text-green-600 transition-colors">Energy Usage (kWh/month)</label>
                    <input 
                      type="number" 
                      value={calcData.energy}
                      onChange={(e) => setCalcData({...calcData, energy: Number(e.target.value)})}
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg font-bold"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 group-focus-within:text-green-600 transition-colors">Diet Type</label>
                    <select 
                      value={calcData.diet}
                      onChange={(e) => setCalcData({...calcData, diet: e.target.value})}
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg font-bold appearance-none"
                    >
                      <option value="omnivore">Omnivore</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleCalculate}
                    disabled={isCalcLoading}
                    className="w-full py-5 bg-green-700 hover:bg-green-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {isCalcLoading ? <RefreshCw className="animate-spin" /> : <CalcIcon />}
                    {isCalcLoading ? "Analyzing..." : "Calculate My Impact"}
                  </button>
                </div>

                {calcResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-8 bg-green-50 rounded-[2.5rem] border border-green-100 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <h3 className="text-sm font-black text-green-800 uppercase tracking-[0.2em] mb-6 text-center">Weekly Footprint</h3>
                      <div className="text-center mb-8">
                        <span className="text-7xl font-black text-green-700">{calcResult.total}</span>
                        <span className="text-green-700 font-black ml-3 text-xl">kg CO2e</span>
                      </div>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {Object.entries(calcResult.breakdown).map(([key, val]: any) => (
                          <div key={key} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-center border border-white">
                            <p className="text-[10px] uppercase font-black tracking-widest text-green-800 mb-1">{key}</p>
                            <p className="text-lg font-black">{val}kg</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-white rounded-3xl border border-green-100 shadow-sm">
                        <p className="text-gray-600 font-medium italic leading-relaxed">"{calcResult.suggestion}"</p>
                      </div>
                      <button 
                        onClick={() => handleShare("linkedin")}
                        className="mt-6 w-full py-3 bg-white border border-green-200 text-green-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-all"
                      >
                        <Share2 size={18} /> Share Result
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        {[
          { id: "dashboard", label: "Home", icon: Leaf },
          { id: "initiatives", label: "Impact", icon: Globe },
          { id: "calculator", label: "Calc", icon: CalcIcon },
          { id: "portfolio", label: "Profile", icon: Award },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (item.id === "initiatives") fetchInitiatives(initiativeType);
            }}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === item.id ? "text-green-700" : "text-gray-400"
            )}
          >
            <item.icon size={20} className={cn(activeTab === item.id && "scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <Menu size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
        </button>
      </div>

      {/* Footer (Hidden on mobile to avoid overlap with bottom nav) */}
      <footer className="hidden lg:block bg-white border-t border-gray-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white">
                <Leaf size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">EcoPulse</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-gray-400">
              <a href="#" className="hover:text-green-700 transition-colors">Privacy</a>
              <a href="#" className="hover:text-green-700 transition-colors">Terms</a>
              <a href="#" className="hover:text-green-700 transition-colors">WWF Partnership</a>
              <a href="#" className="hover:text-green-700 transition-colors">Contact</a>
            </div>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all border border-gray-100">
                <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all border border-gray-100">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              © 2026 EcoPulse by WWF. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}
              </h3>
              <p className="text-gray-500 font-medium mb-8">
                {authMode === 'signin' ? 'Sign in to continue your eco-journey.' : 'Join EcoPulse and start making an impact.'}
              </p>

              {authError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                >
                  {isAuthLoading ? 'Please wait...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between">
                <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
                <span className="text-xs text-center text-gray-500 uppercase font-bold tracking-widest">or</span>
                <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
              </div>

              <button 
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    setShowAuthModal(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm font-medium text-gray-500">
                {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setAuthError('');
                  }}
                  className="text-green-700 font-bold hover:underline"
                >
                  {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


