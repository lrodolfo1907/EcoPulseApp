import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function usePortfolio(user: any, activeTab: string) {
  const [portfolioStats, setPortfolioStats] = useState({ joined: 0, completed: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);

  const fetchPortfolio = async () => {
    if (!user) return;
    setIsPortfolioLoading(true);
    try {
      const q = query(collection(db, "user_initiatives"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      
      let joined = snap.size;
      let completed = snap.docs.filter(doc => doc.data().status === 'completed').length;

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

      if (user.email === 'lpires1907@gmail.com') {
        joined = Math.max(joined, 24);
        completed = Math.max(completed, 21);
        
        // Add robust mock activities if the user hasn't generated enough real ones yet
        if (activities.length < 5) {
          activities.push(
            { title: "Cleanup Drive - Guanabara Bay", date: "Yesterday", hours: 3, type: "Initiative" },
            { title: "No Plastic Week", date: "2 days ago", hours: 10, type: "Challenge" },
            { title: "Flora Mapping - Tijuca Forest", date: "Last week", hours: 4, type: "Initiative" },
            { title: "Circular Economy Masterclass", date: "2 weeks ago", hours: 15, type: "Training" },
            { title: "Neighborhood Compost Setup", date: "3 weeks ago", hours: 1, type: "Initiative" },
            { title: "Tree Planting Event", date: "Last month", hours: 5, type: "Initiative" },
            { title: "Ocean Saver Micro-Task", date: "Last month", hours: 2, type: "Initiative" },
            { title: "Global Recycling Relay", date: "Last month", hours: 25, type: "Challenge" }
          );
        }
      }

      setPortfolioStats({ joined, completed });
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

  return { portfolioStats, recentActivity, isPortfolioLoading, fetchPortfolio };
}
