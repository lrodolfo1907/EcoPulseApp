import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export function useChallenges(user: any, isAdmin: boolean) {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>([]);
  const [isChallengesLoading, setIsChallengesLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState({ title: "", description: "" });

  const fetchChallenges = async () => {
    const mockChallengesFallback = [
      { id: "mock1", title: "No Plastic Week", description: "Avoid single-use plastics for an entire week.", participants: 1240, daysLeft: 3, progress: 65, status: "approved" },
      { id: "mock2", title: "Cycle to Work", description: "Commute by bike instead of car.", participants: 850, daysLeft: 5, progress: 40, status: "approved" },
      { id: "mock3", title: "Zero Waste Cooking", description: "Cook meals with zero food waste.", participants: 2100, daysLeft: 2, progress: 85, status: "approved" },
      { id: "mock4", title: "Tree Planting", description: "Join local tree planting events.", participants: 450, daysLeft: 12, progress: 20, status: "approved" },
    ];

    if (!user) {
      setChallenges(mockChallengesFallback);
      setJoinedChallengeIds([]);
      setIsChallengesLoading(false);
      return;
    }

    setIsChallengesLoading(true);
    try {
      // Fetch approved challenges
      const approvedQ = query(collection(db, "challenges"), where("status", "==", "approved"));
      const approvedSnap = await getDocs(approvedQ);
      setChallenges(approvedSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch user's joined challenges
      const joinedQ = query(collection(db, "user_challenges"), where("userId", "==", user.uid));
      const joinedSnap = await getDocs(joinedQ);
      setJoinedChallengeIds(joinedSnap.docs.map(d => d.data().challengeId));

      // Fetch pending challenges if admin
      if (isAdmin) {
        const pendingQ = query(collection(db, "challenges"), where("status", "==", "pending"));
        const pendingSnap = await getDocs(pendingQ);
        setPendingChallenges(pendingSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setChallenges(mockChallengesFallback);
    } finally {
      setIsChallengesLoading(false);
    }
  };

  const handleUpdateChallengeStatus = async (challengeId: string, newStatus: string) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "challenges", challengeId), { status: newStatus });
      alert(`Challenge ${newStatus} successfully!`);
      fetchChallenges(); // Refresh lists
    } catch (error) {
      console.error("Error updating challenge:", error);
      alert("Failed to update challenge.");
    }
  };

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

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      alert("Please sign in to join a challenge.");
      return;
    }
    try {
      // Check if already joined
      const q = query(collection(db, "user_challenges"), 
        where("userId", "==", user.uid), 
        where("challengeId", "==", challengeId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        alert("You have already joined this challenge!");
        return;
      }

      await addDoc(collection(db, "user_challenges"), {
        userId: user.uid,
        challengeId: challengeId,
        status: "joined",
        joinedAt: serverTimestamp()
      });
      setJoinedChallengeIds(prev => [...prev, challengeId]);
      
      // Determine the challenge title for the email
      let challengeTitle = challengeId;
      const joinedChallenge = challenges.find(c => c.id === challengeId);
      if (joinedChallenge) {
        challengeTitle = joinedChallenge.title;
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
          alert(`Success! We've sent a confirmation email to ${user.email}.`);
        } else {
          alert(`Successfully joined the challenge!`);
        }
      } catch (err) {
        // Email failed but join succeeded
        alert(`Successfully joined the challenge! (Email confirmation pending)`);
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
      alert("Failed to join. Please try again.");
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  return { 
    challenges, 
    pendingChallenges, 
    joinedChallengeIds,
    isChallengesLoading, 
    fetchChallenges, 
    handleUpdateChallengeStatus,
    isSuggesting,
    setIsSuggesting,
    suggestion,
    setSuggestion,
    handleSuggestChallenge,
    handleJoinChallenge
  };
}
