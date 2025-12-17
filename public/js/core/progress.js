import { db } from "../config/firebase.js";
import { doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export async function getUserProgress(uid) {
  const snap = await getDocs(collection(db, "users", uid, "progress"));
  return snap.docs.map(d => d.data().levelId);
}

export async function completeLevel(uid, levelId) {
  const ref = doc(db, "users", uid, "progress", String(levelId));
  await setDoc(ref, {
    levelId,
    completedAt: new Date()
  });
}
