import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "../config/firebase.js";

export async function updateStreak(uid, lastDate) {
  const today = new Date().toDateString();
  let streak = 1;

  if (lastDate === today) return;

  if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
    streak++;
  }

  await updateDoc(doc(db, "users", uid), {
    currentStreak: streak,
    lastCompletionDate: today
  });
}
