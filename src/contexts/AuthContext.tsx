import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

interface AuthContextType {
  user: any;
  isAuthReady: boolean;
  greenHours: number;
  setGreenHours: (hours: number) => void;
  userBio: string;
  setUserBio: (bio: string) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [greenHours, setGreenHours] = useState(0);
  const [userBio, setUserBio] = useState("");
  
  const isAdmin = user && user.email === 'lpires1907@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            greenHours: 0,
            role: "user",
            bio: "",
            createdAt: serverTimestamp()
          });
          setGreenHours(0);
          setUserBio("");
        } else {
          setGreenHours(userSnap.data().greenHours || 0);
          setUserBio(userSnap.data().bio || "");
        }

        const unsubUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setGreenHours(doc.data().greenHours || 0);
            setUserBio(doc.data().bio || "");
          }
        });
        return () => unsubUser();
      } else {
        setGreenHours(0);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthReady, greenHours, setGreenHours, userBio, setUserBio, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
