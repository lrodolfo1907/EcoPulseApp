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

  return { portfolioStats, recentActivity, isPortfolioLoading, fetchPortfolio };
}
