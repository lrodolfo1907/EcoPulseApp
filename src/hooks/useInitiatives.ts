import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import confetti from "canvas-confetti";

export function useInitiatives(user: any, isAdmin: boolean) {
  const [initiativeType, setInitiativeType] = useState("local");
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [joinedInitiativeIds, setJoinedInitiatives] = useState<string[]>([]);
  const [isInitiativesLoading, setIsInitiativesLoading] = useState(false);

  const mockInitiativesFallback = [
    { id: "1", title: "Cleanup Drive - Guanabara Bay", org: "Urban Sea Institute", type: "local", taskType: "regular", hours: 3, verified: true, category: "Conservation", description: "Help clean the bay." },
    { id: "2", title: "Flora Mapping - Tijuca Forest", org: "SOS Atlantic Forest", type: "local", taskType: "regular", hours: 4, verified: false, category: "Climate Action", description: "Map flora in the forest." },
    { id: "3", title: "Report Translation (PT/EN)", org: "Global EcoPartners", type: "global", taskType: "micro", hours: 0.5, verified: true, category: "Education", description: "Translate reports." },
    { id: "4", title: "Satellite Image Identification", org: "Zero Deforestation Project", type: "global", taskType: "micro", hours: 0.2, verified: true, category: "Conservation", description: "Identify satellite images." },
    { id: "5", title: "Neighborhood Compost Setup", org: "Community Gardens", type: "local", taskType: "micro", hours: 1, verified: false, category: "Waste Reduction", description: "Help set up a local compost bin." },
    { id: "6", title: "Online Policy Petition Signatures", org: "Earth Guardians", type: "global", taskType: "micro", hours: 0.1, verified: true, category: "Advocacy", description: "Share and gather signatures." },
    { id: "7", title: "Tree Planting Event", org: "Green City", type: "local", taskType: "regular", hours: 5, verified: true, category: "Conservation", description: "Plant trees in the new park." },
    { id: "8", title: "Ocean AI Training Data", org: "DeepBlue", type: "global", taskType: "micro", hours: 0.5, verified: true, category: "Conservation", description: "Tag plastic in underwater drone footage." },
    { id: "9", title: "Local Park Audit", org: "City Council", type: "local", taskType: "micro", hours: 1, verified: true, category: "Conservation", description: "Document broken facilities in local parks." },
    { id: "10", title: "E-Waste Collection Drive", org: "TechRecycle", type: "local", taskType: "regular", hours: 4, verified: true, category: "Waste Reduction", description: "Help coordinate e-waste dropoffs." },
  ];

  const fetchInitiatives = async (type: string) => {
    setIsInitiativesLoading(true);

    if (!user) {
      setInitiatives(mockInitiativesFallback.filter(i => i.type === type));
      setIsInitiativesLoading(false);
      return;
    }

    try {
      const dbInitiatives: any[] = [];
      const initiativesRef = collection(db, "initiatives");
      const q = query(initiativesRef, where("type", "==", type));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        querySnapshot.docs.forEach(doc => {
          dbInitiatives.push({ id: doc.id, ...doc.data() });
        });
      }

      // Merge with mock to ensure all robust data exists
      const merged = [...dbInitiatives];
      const dbTitles = new Set(dbInitiatives.map(i => i.title));
      
      mockInitiativesFallback.filter(i => i.type === type).forEach(mock => {
        if (!dbTitles.has(mock.title)) {
          merged.push(mock);
        }
      });
      
      setInitiatives(merged);

      // Fetch joined initiatives
      const joinedQ = query(collection(db, "user_initiatives"), where("userId", "==", user.uid));
      const joinedSnap = await getDocs(joinedQ);
      if (!joinedSnap.empty) {
        setJoinedInitiatives(joinedSnap.docs.map(doc => doc.data().initiativeId));
        // Special case for mock user lpires1907@gmail.com
        if (user.email === 'lpires1907@gmail.com') {
          setJoinedInitiatives(prev => [...prev, ...merged.map(m => m.id)]);
        }
      } else if (user.email === 'lpires1907@gmail.com') {
        // Mock that they joined EVERYTHING
        setJoinedInitiatives(merged.map(m => m.id));
      } else {
        setJoinedInitiatives([]);
      }
    } catch (err) {
      console.error("Error fetching initiatives:", err);
      setInitiatives(mockInitiativesFallback.filter(i => i.type === type));
    } finally {
      setIsInitiativesLoading(false);
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
      
      // Send email logic for initiative
      let challengeTitle = initiativeId;
      const joinedInitiative = initiatives.find(i => i.id === initiativeId);
      if (joinedInitiative) {
        challengeTitle = joinedInitiative.title;
      }

      try {
        const response = await fetch('/api/email/confirm-join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: user.email, 
            name: user.displayName,
            challengeTitle 
          })
        });
        const data = await response.json();
        
        // Trigger confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#22c55e', '#bef264', '#fcd34d'],
          zIndex: 9999
        });

        if (data.previewUrl) {
          console.log("✉️ Email sent! View the email preview here:", data.previewUrl);
          setTimeout(() => alert(`Success! Check ${user.email} for your confirmation. Complete it to earn ${hours} Green Hours!`), 500);
        } else {
          setTimeout(() => alert(`Successfully joined! Complete it to earn ${hours} Green Hours.`), 500);
        }
      } catch (err) {
        // Trigger confetti even if email fails!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#22c55e', '#bef264', '#fcd34d'],
          zIndex: 9999
        });
        setTimeout(() => alert(`Successfully joined! Complete it to earn ${hours} Green Hours.`), 500);
      }

      // Optimistically update joined list
      setJoinedInitiatives(prev => [...prev, initiativeId]);

    } catch (error) {
      console.error("Error joining initiative:", error);
      alert("Failed to join. Please try again.");
    }
  };

  useEffect(() => {
    fetchInitiatives("local");
  }, [user]);

  return { initiativeType, setInitiativeType, initiatives, joinedInitiativeIds, isInitiativesLoading, fetchInitiatives, handleJoinInitiative };
}
