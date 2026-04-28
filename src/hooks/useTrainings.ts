import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export function useTrainings(user: any, isAdmin: boolean) {
  const [trainings, setTrainings] = useState<any[]>([]);

  const fetchTrainings = async () => {
    const curatedCourses = [
      { title: "Climate Change: From Learning to Action", duration: "8h", level: "Beginner", provider: "UN CC:e-Learn", url: "https://unccelearn.org/course/view.php?id=71&page=overview" },
      { title: "Cities and Climate Change", duration: "2h", level: "Intermediate", provider: "UN CC:e-Learn", url: "https://unccelearn.org/course/view.php?id=20&page=overview" },
      { title: "One Planet, One Ocean", duration: "30h", level: "Advanced", provider: "SDG Academy (UN)", url: "https://sdgacademy.org/course/one-planet-one-ocean/" },
      { title: "Forests and Climate Change", duration: "2h", level: "Beginner", provider: "UN CC:e-Learn", url: "https://unccelearn.org/course/view.php?id=143&page=overview" },
      { title: "Introduction to Environmental Activism", duration: "3h", level: "Beginner", provider: "Greenpeace", url: "https://greenfuture-ea.greenpeace.org/en/courses?locale=en" },
      { title: "Energy Transition", duration: "10h", level: "Intermediate", provider: "SDG Academy (UN)", url: "https://sdgacademy.org/course/energy-transition/" },
      { title: "Sustainable Food Systems", duration: "10h", level: "Intermediate", provider: "FAO (UN)", url: "https://elearning.fao.org/" },
      { title: "Nature-Based Solutions", duration: "5h", level: "Advanced", provider: "The Nature Conservancy", url: "https://www.conservationtraining.org/" }
    ];

    const mockTrainingsFallback = curatedCourses.map((c, i) => ({ id: String(i), ...c }));

    if (!user) {
      setTrainings(mockTrainingsFallback);
      return;
    }

    try {
      const trainingsRef = collection(db, "trainings");
      const querySnapshot = await getDocs(trainingsRef);
      
      if (querySnapshot.empty) {
        if (isAdmin) {
           for (const t of curatedCourses) {
             await addDoc(trainingsRef, { ...t, createdAt: serverTimestamp() });
           }
           const newSnapshot = await getDocs(trainingsRef);
           setTrainings(newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
           setTrainings(mockTrainingsFallback);
        }
      } else {
        setTrainings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error("Error fetching trainings:", err);
      setTrainings(mockTrainingsFallback);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [user]);

  return { trainings, fetchTrainings };
}
