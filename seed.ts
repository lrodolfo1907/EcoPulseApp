import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const mockInitiatives = [
  { title: "River Cleanup Drive", org: "WWF Local Chapter", type: "local", hours: 4, verified: true, description: "Help clean the local river." },
  { title: "Tree Planting Weekend", org: "Green Earth", type: "local", hours: 6, verified: true, description: "Plant trees in the community park." },
  { title: "Digital Carbon Audit", org: "WWF Global", type: "global", hours: 2, verified: true, description: "Audit your digital carbon footprint." },
  { title: "Wildlife Image Tagging", org: "Conservation Int.", type: "global", hours: 1, verified: true, description: "Tag wildlife images for research." }
];

async function seed() {
  const initiativesRef = collection(db, 'initiatives');
  const snap = await getDocs(initiativesRef);
  if (snap.empty) {
    console.log("Seeding initiatives...");
    for (const init of mockInitiatives) {
      await addDoc(initiativesRef, { ...init, createdAt: serverTimestamp() });
    }
    console.log("Seeded successfully.");
  } else {
    console.log("Initiatives already exist.");
  }
}

seed().catch(console.error);
