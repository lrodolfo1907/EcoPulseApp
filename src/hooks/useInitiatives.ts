import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export function useInitiatives(user: any, isAdmin: boolean) {
  const [initiativeType, setInitiativeType] = useState("local");
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [isInitiativesLoading, setIsInitiativesLoading] = useState(false);

  const fetchInitiatives = async (type: string) => {
    setIsInitiativesLoading(true);
    
    const mockInitiativesFallback = [
      { id: "1", title: "Cleanup Drive - Guanabara Bay", org: "Urban Sea Institute", type: "local", hours: 3, verified: true },
      { id: "2", title: "Flora Mapping - Tijuca Forest", org: "SOS Atlantic Forest", type: "local", hours: 4, verified: false },
      { id: "3", title: "Report Translation (PT/EN)", org: "Global EcoPartners", type: "global", hours: 0.5, verified: true },
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
          { title: "Report Translation (PT/EN)", org: "Global EcoPartners", type: "global", hours: 0.5, verified: true, description: "Translate reports." },
          { title: "Satellite Image Identification", org: "Zero Deforestation Project", type: "global", hours: 0.2, verified: true, description: "Identify satellite images." },
        ];
        
        // Only seed if user is admin, otherwise just show empty
        if (isAdmin) {
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
        if (data.previewUrl) {
          console.log("✉️ Email sent! View the email preview here:", data.previewUrl);
          alert(`Success! Check ${user.email} for your confirmation. Complete it to earn ${hours} Green Hours!`);
        } else {
          alert(`Successfully joined! Complete it to earn ${hours} Green Hours.`);
        }
      } catch (err) {
        alert(`Successfully joined! Complete it to earn ${hours} Green Hours.`);
      }

    } catch (error) {
      console.error("Error joining initiative:", error);
      alert("Failed to join. Please try again.");
    }
  };

  useEffect(() => {
    fetchInitiatives("local");
  }, [user]);

  return { initiativeType, setInitiativeType, initiatives, isInitiativesLoading, fetchInitiatives, handleJoinInitiative };
}
